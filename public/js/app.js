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


thingPanel.controller('connections.list.ctrl', ['$scope','$state', '$http',function($scope, $state, $http){
    var vm = this;

    vm.remove = function(id){
        console.log('remove', id);
    };

    vm.open = function(id){
        $state.go('panel.list', {
            connectionId: id
        });
    };

    var init  = function(){
        $http({            
            method: 'GET',
            url: '/cp/connections/'
        }).then(function successCallback(response) {
            vm.list = response.data;            
        }, function errorCallback(response) {}); 
    };

    init();      
}]);
 

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
}]);


thingPanel.controller('panel.ctrl', ['$scope','$state', '$http', '$stateParams',function($scope, $state, $http, $stateParams){
    var vm = this;    

    var init  = function(){
        $http({            
            method: 'GET',
            url: '/cp/connections/' + $stateParams.connectionId
        }).then(function successCallback(response) {
            vm.data = response.data;
            $scope.$broadcast('panel_connection', response.data);
        }, function errorCallback(response) {}); 
    };

    init(); 
}]);

thingPanel.controller('panel.list.ctrl', ['$scope','$state', '$stateParams', '$http',function($scope, $state, $stateParams, $http){
    var vm = this;    

    vm.edit = function(id){
        $state.go('panel.edit', {id: id});   
    };

    vm.delete = function(id){
        swal({
            title: "Are you sure your want to delete?",
            text: "You are going to delete this publish!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        },function(){
            $http({            
                method: 'DELETE',
                url: '/cp/publications/' + $stateParams.connectionId + '/' + id
            }).then(function successCallback(response) {     
                swal({
                    title: 'Deleted !',   
                    text: 'Your publication has been deleted!',   
                    type: 'success'
                }, function(){
                    rebind();
                });       
            }, function errorCallback(response) {});             
        });
    };

    var socket = io();

    socket.on('mqtt_published', function(data){
        if(data.success){
            swal({
                title: 'MQTT published !',   
                text: 'You published!',   
                type: 'success'
            }, function(){});
        }else{
            swal({
                title: 'MQTT published !',   
                text: data.message,   
                type: 'error'
            }, function(){});
        }
    });

    vm.publish = function (id, value){      
        socket.emit('mqtt_publish', {
            id: id,
            value: value
        });
    };

    var rebind  = function(){
        $http({            
            method: 'GET',
            url: '/cp/publications/' + $stateParams.connectionId
        }).then(function successCallback(response) {            
            vm.list = response.data;
        }, function errorCallback(response) {}); 
    };

    rebind(); 
}]);


thingPanel.controller('panel.edit.ctrl', ['$scope','$state', '$stateParams', '$http',function($scope, $state, $stateParams, $http){
    var vm = this;
    vm.data = vm.data || {};
    
    vm.cancel = function(){
        $state.go('panel.list', { connectionId: $stateParams.connectionId });
    };

    vm.save = function(){
        if(!$scope.f.$valid){             
            $scope.f.$setSubmitted(false);     
            return;            
        }

        var publication = vm.data;
        
        publication.connectionId = $stateParams.connectionId;      
        
        var savingData = {
            data: vm.data            
        };

        if($stateParams.id && $stateParams.id!=='0'){
            savingData.url = '/cp/publications/' + $stateParams.connectionId + '/' + $stateParams.id;
            savingData.method = 'PUT';
        }  else{
            savingData.url = '/cp/publications/';
            savingData.method = 'POST';
        }

        $http(savingData).then(function successCallback(response) {
            swal({
                title: "Saved publication successfully!",   
                text: "You are able to control your device remotely!",   
                type: "success"
            }, function(){
                $scope.f.$setSubmitted(false);   
                $state.go('panel.list', { connectionId: $stateParams.connectionId });          
            });              
        }, function errorCallback(response) {
            swal({
                title: "Saving publication with errors!",   
                text: "You may entered incorrect information, please check again!",   
                type: "error"
            }, function(){
                $scope.f.$setSubmitted(false);                    
            });   
        });   
    };    


    var init  = function(){
        $http({            
            method: 'GET',
            url: '/cp/publications/' + $stateParams.connectionId + '/' + $stateParams.id
        }).then(function successCallback(response) {            
            vm.data = response.data;
            
        }, function errorCallback(response) {}); 
    };

    init(); 
}]);