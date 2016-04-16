// не испоьзуется !!!

angular.module('factorb.controllers',[]);
angular.module('factorb.services',[]);
angular.module('factorb.transformers',[]);

//['angular-underscore']);

angular.module('factorb',
    [
        //'ui.bootstrap',
        'ui.utils',

        //'ngRoute',     // angular-route
        'ui.router',     // angular-ui-router instead

        'ngAnimate',
        'ngDialog',
        'ngCookies',

        'chart.js',
        'ngFileUpload',

        'factorb.controllers',
        'factorb.services',
        'factorb.transformers'
    ]
);

angular.module('factorb').config(function($stateProvider,$httpProvider,$parseProvider,$locationProvider,$urlRouterProvider) {
    // angular-ui-router stuff:
    $urlRouterProvider.otherwise("/main");

    $stateProvider
          // when user is logged in -> show him main 'Admin page'
          .state('main', {
               url: '/main',
               views: {
                    '': {
                         templateUrl: 'main/main.html',
                         controller: 'controllers.MainController'
                    }
               }
          })
          .state('success', {
               url: '/success',
               views: {
                    '': {
                         templateUrl: 'main/success.html',
                         controller: 'controllers.DocController'
                    },
               }
          })
          .state('failure', {
               url: '/failure',
               views: {
                    '': {
                         templateUrl: 'main/failure.html',
                         controller: 'controllers.DocController'
                    },
               }
          });

    // Add Bearer Token 
    //$httpProvider.interceptors.push('authInterceptor');
});

angular.module('factorb').run(function($rootScope,$location,$window) {

    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    // whenever route changes -> handle it
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        /*
        if((next.templateUrl==="admin.html" || next.templateUrl==="promo.html") && (!$window.sessionStorage.token)){
            $location.path('/auth');
        }

        if((next.templateUrl==="auth.html") && ($window.sessionStorage.token)){
            $location.path('/admin');
        }
        */

    });

});

