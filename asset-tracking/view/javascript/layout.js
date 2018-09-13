//layout params

//menu items
var menuItems = {
  "mainMenu": "menu1",
  "menu1": [
    {"id":"1", "iconClass":"fa fa-map", "label": "Map", "route":"#/main", "active":"true"},
    {"id":"2", "iconClass":"fa fa-warning", "label": "Alerts", "route":"#/alerts", "active":"false"}
  ]
}; 

//header items
var headerItems = {
    "logo": "//cdn.rawgit.com/scriptrdotio/resources/02fa919a/multitech/images/logo%20multi-tech.png",
    "items": [],
    "logout": {"icon": "fa fa-sign-out", "label": "Logout", "route":"#/logout"}
};

//angular js routs
var routingItems = {
  "params": [
    {"route": "/", "template": "/asset-tracking/view/html/views/main/main.html", "controller": "mapCtrl as vm"},
    {"route": "main", "template": "/asset-tracking/view/html/views/main/main.html", "controller": "mapCtrl as vm"},
    {"route": "dashboard/deviceId/:deviceId*", "template": "/asset-tracking/view/html/views/main/dashboard.html","controller": "dashboardCtrl as vm"},
    {"route": "alerts", "template": "/asset-tracking/view/html/views/alerts/alerts.html"},
    {"route": "logout", "template": "/asset-tracking/view/html/logout.html"}
  ]
};
