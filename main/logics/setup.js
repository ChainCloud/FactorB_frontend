// не испоьзуется !!!

angular.module('chaincloud.controllers',[]);
angular.module('chaincloud.services',[]);
angular.module('chaincloud.transformers',[]);

//['angular-underscore']);

angular.module('chaincloud',
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

        'chaincloud.controllers',
        'chaincloud.services',
        'chaincloud.transformers'
    ]
);

angular.module('chaincloud').config(function($stateProvider,$httpProvider,$parseProvider,$locationProvider,$urlRouterProvider) {
    // angular-ui-router stuff:
    $urlRouterProvider.otherwise("/login");

    $stateProvider
          .state('registration', {
               url: '/registration',
               views: {
                    '': {
                         templateUrl: 'signer/registration.html',
                         // same as above!!!
                         controller: 'controllers.LandingController'
                    },
               }
          })
          // Use received 'verification' email and clicked on 'Verify' button
          .state('validation', {
               url: '/validation',
               views: {
                    '': {
                         templateUrl: 'signer/validation.html',
                         // same as above!!!
                         controller: 'controllers.LandingController'
                    },
               }
          })
          .state('login', {
               url: '/login',
               views: {
                    '': {
                         templateUrl: 'signer/login.html',
                         // same as above!!!
                         controller: 'controllers.LandingController'
                    }
               }
          })
          .state('agreement', {
               url: '/agreement',
               views: {
                    '': {
                         templateUrl: 'signer/agreement.html',
                         // same as above!!!
                         controller: 'controllers.LandingController'
                    }
               }
          })

          /*
          // user forgot his password and wants to 'Reset it'
          .state('recover', {
               url: '/recover',
               views: {
                    '': {
                         templateUrl: 'signer/recover.html',
                         controller: 'controllers.RecoverController'
                    },
               }
          })
          // User received 'reset your password' email and clicked on 'OK' button
          .state('on_recover', {
               url: '/on_recover',
               views: {
                    '': {
                         templateUrl: 'signer/on_recover.html',
                         // same as above!!!
                         controller: 'controllers.RecoverController'
                    },
               }
          })
          */

          // when user is logged in -> show him main 'Admin page'
          .state('main', {
               url: '/main',
               views: {
                    '': {
                         templateUrl: 'signer/main.html',
                         controller: 'controllers.MainController'
                    }
               }
          })
          // user clicked on a document
          .state('docs', {
               url: '/doc/:hash',
               views: {
                    '': {
                         templateUrl: 'signer/doc.html',
                         controller: 'controllers.DocController'
                    },
               }
          });

    // Add Bearer Token 
    $httpProvider.interceptors.push('authInterceptor');
});

angular.module('chaincloud').run(function($rootScope,$location,$window) {

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

