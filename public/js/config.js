thingPanel
    .config(function ($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/connections/list");


        $stateProvider
            //------------------------------
            // CONNECTIONS
            //------------------------------
            .state ('connections', {
                url: '/connections',
                templateUrl: 'views/connections.html'
            })

            //------------------------------
            // HOME
            //------------------------------
            .state ('connections.list', {
                url: '/list',
                templateUrl: 'views/connections.list.html',
                controller: 'connections.list.ctrl as vm',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'css',
                                insertBefore: '#app-level',
                                files: [
                                    'vendors/bower_components/fullcalendar/dist/fullcalendar.min.css',
                                ]
                            },
                            {
                                name: 'vendors',
                                insertBefore: '#app-level-js',
                                files: [
                                    'vendors/sparklines/jquery.sparkline.min.js',
                                    'vendors/bower_components/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js',
                                    'vendors/bower_components/simpleWeather/jquery.simpleWeather.min.js'
                                ]
                            }
                        ])
                    }
                }
            })

            //------------------------------
            // CONNECTIONS.ADD
            //------------------------------
            .state ('connections.edit', {
                url: '/edit/:id',
                templateUrl: 'views/connections.edit.html',
                controller: 'connections.edit.ctrl as vm'
            })

            //------------------------------
            // PANEL
            //------------------------------
            .state ('panel', {
                url: '/panel/:connectionId',
                templateUrl: 'views/panel.html',
                controller: 'panel.ctrl as vm'
            })
            .state ('panel.list', {
                url: '/list',
                templateUrl: 'views/panel.list.html',
                controller: 'panel.list.ctrl as vm'
            })
            .state ('panel.edit', {
                url: '/edit/:id',
                templateUrl: 'views/panel.edit.html',
                controller: 'panel.edit.ctrl as vm'
            });

});
