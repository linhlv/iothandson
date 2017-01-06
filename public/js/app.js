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
    var socket = io();

    socket.on('mqtt_connected', function(data){
        console.log(data);
        $scope.$broadcast('mqtt_connected', { connected: true });
        swal({
            title: 'MQTT connected !',   
            text: 'You are connected to ' + vm.data.server + '!',   
            type: 'success'
        }, function(){});
    });

    socket.on('mqtt_disconnected', function(data){
        console.log(data);
        $scope.$broadcast('mqtt_disconnected', { connected: false });
        swal({
            title: 'MQTT disconnected !',   
            text: 'You are disconnected to ' + vm.data.server + '!',   
            type: 'success'
        }, function(){});
    });

    var vm = this;    

    vm.connecting = false;

    vm.connectingChange = function(){        
        if(vm.connecting){
            socket.emit('mqtt_connect', {connectionId : $stateParams.connectionId});                
        }else{
            socket.emit('mqtt_disconnect', {connectionId : $stateParams.connectionId});                
        }        
    }

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
    vm.connecting = false;   

    $scope.$on('panel_connection', function (event, data) {
        vm.connection = data;
    });

    $scope.$on('mqtt_connected', function (event, data) {
        vm.connecting = data.connected;
        console.log('event mqtt_connected'); // 'Data to send'
        console.log(data); // 'Data to send'
    });

    $scope.$on('mqtt_disconnected', function (event, data) {
        vm.connecting = data.connected;
        console.log('event mqtt_disconnected'); // 'Data to send'
        console.log(data); // 'Data to send'
    });

    

    vm.edit = function(id){
        $state.go('panel.edit', {id: id});   
    };

    vm.delete = function(id){
        
    };

    vm.publish = function (id,value){
        if(!vm.connecting){
            swal({
                title: 'Disconnected !',   
                text: 'You are not connected to ' + vm.connection.server + ', Please connect and try again!',   
                type: 'error'
            }, function(){});
        }
        console.log(id, value);
    };

    var init  = function(){
        $http({            
            method: 'GET',
            url: '/cp/publications/' + $stateParams.connectionId
        }).then(function successCallback(response) {            
            vm.list = response.data;
        }, function errorCallback(response) {}); 
    };

    init(); 
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

        $http({
            data: vm.data,
            method: 'POST',
            url: '/cp/publications/'
        }).then(function successCallback(response) {
            swal({
                title: "Created publication successfully!",   
                text: "You are able to control your device remotely!",   
                type: "success"
            }, function(){
                $scope.f.$setSubmitted(false);   
                $state.go('panel.list', { connectionId: $stateParams.connectionId });          
            });              
        }, function errorCallback(response) {
            swal({
                title: "Creating publication with errors!",   
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