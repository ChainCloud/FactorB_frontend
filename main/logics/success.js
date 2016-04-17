
angular.module('factorb.controllers').controller('controllers.SuccessController',
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
                    $scope.setFocus = true;
                    $scope.showSpinner = false;
                    $scope.errMsg = '';
                    $scope.link = ''
               };

               /////////////////////////////////////////
               //////// START HERE:
               $scope.reset();

               console.log('SUCCESS controller loading...');

               $scope.gotoTx = function(){
                    $window.open($scope.link,'_blank');
               };

               var params = $location.search();
               $scope.link = params.link;
               $scope.hash = params.hash;

               console.log('Link: ' + $scope.link);
       }
     ]
);
