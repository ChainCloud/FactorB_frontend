
angular.module('factorb.controllers').controller('controllers.ProcessController',
    [
        '$scope',
        '$rootScope',
        '$window',
        '$location',
        '$timeout',
        'ngDialog',
        '$cookies',
        '$q',

        'Upload',

        'services.Api',
        'services.Helpers',

        function($scope,$rootScope,$window,$location,$timeout,ngDialog,$cookies,$q,Upload,api,helpers)
        {
               $scope.reset = function () {
                    $scope.showSpinner = false;

                    $scope.state = 'Обрабатывается...';
                    $scope.id = '';
                    $scope.sig = '';
               };

               $scope.onGoToMain = function(){
                    $window.scrollTo(0, 0);
                    $window.location = '#/main';
               };

               $scope.load = function(){
                    console.log('Getting task: ' + $scope.id + ' with sig: ' + $scope.sig);
                     
               };

               /// START:
               $scope.reset();

               // get id/sig
               var params = $location.search();
               $scope.id = params.id;
               $scope.sig = params.sig;
               if(!$scope.sig || !$scope.id){
                    console.log('Bad params');
                    return;
               }

               $scope.load();
          }
     ]
);
