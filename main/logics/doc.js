
angular.module('chaincloud.controllers').controller('controllers.DocController',
    [
        '$scope',
        '$rootScope',
        '$window',
        '$location',
        '$timeout',
        'ngDialog',
        '$cookies',
        '$q',

        'services.Api',
        'services.Helpers',

        function($scope,$rootScope,$window,$location,$timeout,ngDialog,$cookies,$q,api,helpers)
        {
               $scope.reset = function () {
                    $scope.setFocus = true;
                    $scope.showSpinner = false;
                    $scope.errMsg = '';
                    $scope.txLink = '';

                    // read from cookies
                    $scope.token = $cookies.Token;
                    $scope.shortId = $cookies.ShortId;

                    $scope.doc = {};
               };

               $scope.loadDoc = function(id){
                    console.log('Loading document with hash: ' + id);

                    $scope.showSpinner = true;
                    api.getDoc(id,function(err,statusCode,data){
                         $scope.showSpinner = false;

                         if(!helpers.processError(null,statusCode,'Getting objects')){
                              $scope.errMsg = 'Error...';
                              return;
                         }

                         console.log('GET DOC RESULT: ',data);
                         $scope.doc = data;
                    });
               };

               $scope.blockchainTypeToStr = function(type){
                    return helpers.blockchainTypeToStr(type);
               };

               /////////////////////////////////////////
               //////// START HERE:
               $scope.reset();

               if(typeof($scope.token)==='undefined' || typeof($scope.shortId)==='undefined' || ($scope.token===null) || ($scope.shortId===null)){
                    // move to login!
                    console.log('Moving back to login...');

                    $window.location = '#/login';
                    return;
               }

               // Get doc ID from params
               var match = $location.path().match(/\/doc\/(.*)/);
               var id = '';
               if(match && match.length>=1){
                    $scope.id = match[1];
               }

               console.log('DOC controller loading...');
               $scope.loadDoc($scope.id);
       }
     ]
);
