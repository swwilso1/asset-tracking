# MultiConnect Asset Tracking and Monitoring App
The asset tracking and monitoring application is meant to jump start your development with scriptr.io and the MultiTech® MultiConnect™ Conduit. It's a complete end-to-end scenario that allows you to add as many devices and features as you like.


# Features
- Entry point "asset-tracking/view/html/login.html"
- Ingest API "asset-tracking/api/ingest" called by the conduit on every new payload the conduit publishes. Note that the conduit's expected payload is as follow:
```
{
	"id" : "xh2345",
	"temperature" : 43,
	"luminosity" : 634.0497503898733,
	"pressure" : 28759,
	"location" : {
		"lat" : "48.858",
		"lon" : "2.2951"
	}
}
```
- Installation API "asset-tracking/install/auto.install.scriptr" to install the app dependencies:
     - The channels needed by the application.
     - A default subdomain for the account, if not available.
     - Default credentials (demo/demo) to use for login.
     - Store and schemas needed to store the devices data:
            - store: multitech
            - schemas: multitech_event, multitech_latest_event, multitech_alert
- Uninstallation API "asset-tracking/install/uninstall.scriptr" to uninstall the app dependencies.
- Simulator API "asset-tracking/simulator/conduit/data" to simulate the conduit calls to the asset-tracking/api/ingest API for testing purposes. It generates random data for 3 devices.

# How to view the application
The installation API "asset-tracking/install/auto.install.scriptr" needs to be executed once. If you registered with scriptr.io with the MULTITECH promotion code, this script should have already been executed.

To visualize your conduit data in real-time, open the script "asset-tracking/view/html/login.html" and click View, then login with the demo/demo credentials. You will land on a map with a cluster view of all the devices locations that pushed data through your conduit.

Zooming into the map and clicking on a marker will display an info window with the latest data the device has published. You can click on edit dashboard to view a detailed dashboard of a specific device.

Clicking on alerts in the left menu, lists all the logged events from your devices. You can filter by device ID to view the logs of a specific device.

As your conduit starts pushing data to the "asset-tracking/api/ingest" API, the dashboard and the map will reflect the new readings from your devices automatically.

# Notes
This app provides a simulator that allows you to simulate the data feed from the gateway for testing purposes. To use it, you can schedule the "quickstart-app/simulator/conduit/data" script on a recurring basis with a time interval of your choice.

# Dependencies
Underscore module (if you registered with scriptr.io with the MULTITECH promotion code, this module should have already been installed).

Your application is deployed to your account with a package version of the [UIComponents](https://github.com/scriptrdotio/UIComponents) module which you can find under asset-tracking/view/build/. If you wish to use an unpackaged version of the [UIComponents](https://github.com/scriptrdotio/UIComponents) module and modify it, replace index.html with index.unpackage.html and checkout the rc0.1 branch of [UIComponents](https://github.com/scriptrdotio/UIComponents). Read more about it [here](https://github.com/scriptrdotio/multitech-asset-tracking/blob/master/asset-tracking/view/build/Readme.md).

# About the code
This section gives you an overview of the structure of the application and describes the responsibilities of the different scripts and file that compose it.

## /api folder
The api folder contains scripts that define the API of the asset-tracking application, i.e. they are used by clients, such as the user interface (UI) or the client application running on the devices.

- api/ingest: this script is invoked by the (mDot Box) device via requests containing the measurements made by the device's sensors.
"api/ingest" uses "entities/deviceManager" to persit the data. It uses "entities/alertManager" to check for the occurrence of alerts. 
The script also uses "entities/notificationManager" to publish the received data in real-time to the UI.
- api/alerts: this script is invoked by the UI to obtain the list of the alerts that were triggered by the application. This list is actually obtained from "entities/deviceManager". Passing the "filter" parameter narrows the list to the alerts related to the device with and id matching the value of "filter". Paginating the list of alerts is done by passing the "resultsPerPage" and "pageNumber" parameters, set to the desired values.
- api/historicalEvents: this script is invoked by the UI to obtain the list of all the events that occurred through time. If the id parameter is passed along with the request, the list of events is narrowed down to the events related to the device with the specified id.
- api/latestEvents: this script is invoked by the UI to obtain the latest events of all devices or the latest event of a specific device, if the id parameter is passed along with the request and set to a valid device id.

## /entities folder
This folder contains the scripts that implement the business logic and business rules of the application. 

- /entities/deviceManager: this script is responsible for managing device data and persiting them in the "multitech" data store of your account (**note:** to view your data stores, click on "Tools" in the scriptr.io workspace toolbar, then click on "Data Explorer").
- /entities/alertManager: the alertManager receives device data and applies business rules on them to determine if an alert should be raised. Business rules are defined in a decision table ("/entities/rules/alerts"), which is loaded and executed by the "entities/rules/apply" script (**note:** decision tables are standalone API, i.e. you can send them requests - e.g. http requests - or you can execute them from within a script by using the **sdtLibScript.execute()** utility. Check "/entities/rules/apply" and "/entities/utils" for details)
- /entities/notificationManager: the notificationManager reads the latest updates from the deviceManager, transforms them into a format that suits the expectations of the charts in the UI, and broadcasts them to the latter by publishing the data into the "responseChannel"  channel (**note:** we use channels in scriptr.io to broadcast messages in real-time to other components, such as for example UI components). The charts in the UI are subscribed to the channel upon installation of the application and therefore, will automatically reflect data updates as soon as they are ingested (/api/ingest).
- /entities/utils: a utility script that contains utility functions, such as format(), to transform incoming device data into a structure that is expected by the UI
-/entities/rules/alerts: a decision table that defines the conditions to generate an alert (some threshold values). You can modify these rules visually from the scriptr.io workspace (the script opens in a decision table editor)

## /entities/helper/mail
This folder contains two utility scripts for applying email templates.
- /entities/helper/mail/mailer: a simple script that applies an email template to some content, before sending it using scriptr.io's  built-in "sendMail()" function
- /entities/helper/mail/templates: simple email template definition for alerts

## /view folder
This folder contains the scripts that define the User Interface of the application. The scripts are distributed into three seperate sub-folders depending on their type: "/html" for the HTML pages, "/javascript" for the controllers (MVC design) and "/css" for the look and feel. Note that the UI is leveraging a subset of scriptr.io's UI component, which has been pre-packed for this demo application.

### /view/html
- /view/html/index.html: this page is the template of the application's UI: it is composed of a header, a menu on the left-side, and a content section, within which different pages will be displayed depending on the action triggered by the user of the application.
- /view/html/login.html, /view/html/logout.html: these pages are used for the login/logout process. They are part of the login component that you can install as a separate module.

#### /view/html/views/main
- view/html/views/main/main.html: the main content, composed of a map widget showing the location of the devices (assuming the devices are sending location data. If you have an mDot-Box device, switch to the GPS Survey mode to receive the location of your device)
- view/html/views/main/info_simulator.html: this is an info window shown when clicking on a device marker on the map
- /html/views/main/dashboard.html:  the dashboard that displays the latest values received from the Conduit device as well as the historical data (i.e. the different values through time)

#### /view/html/views/alerts
- /view/html/views/alerts/alerts.html: grid that displays the list of alerts that were generated when receiving device data (alerts are generated depending on the business rules defined in "/entities/rules/alerts"

### /view/javascript
The asset-tracking application leverages Angular.js and therefore adopts the corresponding MVC implementation. This folder contains the definition of the application's controllers.

- view/javascript/module.js: implements the routing logic of the menu
- view/javascript/controller.js: the main controller of the application
- view/javascript/layout.js: defines the items used in the header, menu and header of the application
- view/javascript/config.js: configuration of the application (http and websocket providers)

## /simulator
This folder contains a simple simulator that you can use to generate data in complement to (or in replacement of) the mDot-Box device
