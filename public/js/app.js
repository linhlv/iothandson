var materialAdmin = angular.module('materialAdmin', [
    'ngAnimate',
    'ngResource',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'oc.lazyLoad',
    'nouislider',
    'ngTable'
]);

materialAdmin.controller('connections.edit.ctrl', ['$state', '$http',function($state, $http){
    var vm = this;
    vm.go = function(state){
        $state.go(state);
    };

    vm.save = function(){
        // Simple GET request example:
        $http({
            method: 'POST',
            url: '/cp/connections/'
        }).then(function successCallback(response) {
            console.log(response);
            // this callback will be called asynchronously
            // when the response is available
        }, function errorCallback(response) {
            console.log(response);
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    };
}])
 