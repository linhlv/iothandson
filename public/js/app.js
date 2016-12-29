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

materialAdmin.controller('connections.edit.ctrl', ['$state',function($state){
    var vm = this;
    vm.go = function(state){
        $state.go(state);
    }
}])
 