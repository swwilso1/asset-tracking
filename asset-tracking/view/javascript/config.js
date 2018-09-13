//configuration constants


//login apis and expiry value
var login = {
   redirectTarget: "/asset-tracking/view/html/index.html#/main",
   expiry:6,
   loginTarget: "/asset-tracking/view/html/login.html",
   loginApi: "/asset-tracking/api/login/login",
   validateTokenApi: "/asset-tracking/api/login/validateToken"
};

//web sockets 
var wssConfig = ["wsClientProvider",function (wsClientProvider) {
    wsClientProvider.setPublishChannel("requestChannel");
    wsClientProvider.setSubscribeChannel("responseChannel");
}];

//https provider
var httpsConfig = ["httpClientProvider",function (httpClientProvider) {
}]
