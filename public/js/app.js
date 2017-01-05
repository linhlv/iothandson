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

thingPanel.controller('connections.edit.ctrl', ['$scope','$state', '$http',function($scope, $state, $http){
    var vm = this;

    vm.go = function(state){
        $state.go(state);
    };

    vm.save = function(){             
        if(!$scope.f.$valid){             
            $scope.f.$setSubmitted(false);     
            return;            
        }

        $http({
            data: vm.data,
            method: 'POST',
            url: '/cp/connections/'
        }).then(function successCallback(response) {
            swal({
                title: "Created connection successfully!",   
                text: "You are welcome to be Vietnam Urban Farmers user!",   
                type: "success"
            }, function(){
                $scope.f.$setSubmitted(false);   
                $state.go('connections.list');                 
            });              
        }, function errorCallback(response) {
            swal({
                title: "Creating connection with errors!",   
                text: "You may entered incorrect information, please check again!",   
                type: "error"
            }, function(){
                $scope.f.$setSubmitted(false);                    
            });   
        });   
    };
}])
 