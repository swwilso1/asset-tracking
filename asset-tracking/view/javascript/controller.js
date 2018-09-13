//Angular js controllers 

//app controller
myApp.controller('appCtrl', function($scope, $timeout, wsClient, httpClient, headerItemsJson, menuItemsJson, $window, $location, mapConstants, $sce, $routeParams) {
    var vm = this;
    vm.scope = $scope;
    vm.headerItems = headerItemsJson;
    vm.user = {"login": JSON.parse($.cookie('user')).name};
    vm.menuItems = menuItemsJson;
    
    
    vm.init = function() {
        
    }
   
});

//map controller
myApp.controller('mapCtrl', function($scope, $timeout, wsClient, httpClient, headerItemsJson, menuItemsJson, $window, $location, mapConstants, $sce, $routeParams) {
    var vm = this;
    vm.scope = $scope;
    vm.deviceKey = null;
    
    
    vm.sources = mapConstants.sources;
    vm.icons = mapConstants.infoWindows.icons;
    
    vm.init = function() {
    }
    
    
    vm.onSelectAsset = function(data) {
        if(data){
            vm.selectedDevice = data;
            vm.params = {"id": data.assetId}
            vm.tag = "live_data_" + data.assetId;  
        }
    }
});

//dashboard controller
myApp.controller('dashboardCtrl', function($scope, $timeout, wsClient, httpClient, headerItemsJson, menuItemsJson, $window, $location, mapConstants, $sce, $routeParams) {
    var vm = this;
    vm.selectedDeviceId = null;
    vm.icons = mapConstants.infoWindows.icons;
    
    vm.gridsterOptions = {
        pushing: false,
        minRows: 1, // the minimum height of the grid, in rows
        maxRows: 100,
        columns: 3, // the width of the grid, in columns
        colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
        rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
        margins: [10, 10], // the pixel distance between each widget
        defaultSizeX: 2, // the default width of a gridster item, if not specifed
        defaultSizeY: 1, // the default height of a gridster item, if not specified
        mobileBreakPoint: 1024, // if the screen is not wider that this, remove the grid layout and stack the items
        minColumns: 1,
        resizable: {
            enabled: false
        },
        draggable: {
            enabled: false
        }
    };
    
    vm.init = function(){
        if($routeParams && $routeParams.deviceId) {
            vm.selectedDeviceId = $routeParams.deviceId;
        	vm.params = {"id":  vm.selectedDeviceId }
        	
            vm.msgTag = "dashboard_data_" +  vm.selectedDeviceId;
        
            
            wsClient.subscribe(vm.msgTag, vm.consumeData.bind(vm), $scope.$id);  
            
            httpClient.get("asset-tracking/api/latestevents", vm.params).then(
                function(data, response) {
                	vm.consumeData(data)
                },
            	function(err) {
                	console.log('ERROR', error);
           	 });
         }
    }
    
    vm.consumeData = function(data) {
        console.log("------>",data)
        if(data.live) {
            data = data.live
        }
        if(data && data[vm.selectedDeviceId] && data[vm.selectedDeviceId][0] && data[vm.selectedDeviceId][0][0])
        	vm.selectedDevice = data[vm.selectedDeviceId][0][0];
    }
   
    vm.historicalFormatData = function(data){
        if(data.historical) 
        	return data.historical;
        else
            return data;
    }
    
});




