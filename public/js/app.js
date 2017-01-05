var thingPanel = angular.module('thingPanel', [
    'ngAnimate',
    'ngResource',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'oc.lazyLoad',
    'nouislider',
    'ngTable'
]);

thingPanel.controller('connections.edit.ctrl', ['$state', '$http',function($state, $http){
    var vm = this;
    vm.go = function(state){
        $state.go(state);
    };

    vm.save = function(){        
        $http({
            data: vm.data,
            method: 'POST',
            url: '/cp/connections/'
        }).then(function successCallback(response) {
            console.log(response);            
        }, function errorCallback(response) {
            console.log(response);
        });
    };
}])
 