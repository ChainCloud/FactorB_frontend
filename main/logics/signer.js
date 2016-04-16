
angular.module('chaincloud.controllers').controller('controllers.LandingController',
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

                    $scope.isRegistered = false;

                    $scope.isRecovered = false;
                    $scope.isVerified = false;

                    $scope.agreeTOS = false;
               };

               // 1 REGISTER
               ///////////////////////////////////////////////////
               $scope.onRegister = function(email,password){
                    // 1 - call remote API
                    $scope.showSpinner = true;
                    $scope.errMsg = '';

                    api.register(email,password,function(err,statusCode,data){
                         // 2 - process response
                         $scope.showSpinner = false;
                         $scope.onRegisterComplete(err,statusCode,data);
                    });
               };

               $scope.onRegisterComplete = function(err,statusCode,data){
                    if(err || (statusCode!==200)){
                         // TODO: show dlg
                         $scope.errMsg = 'Error. Feel free to write us: support@chain.cloud';
                         return;
                    }

                    if(data==='Already exists'){
                         $scope.errMsg = 'Error: User already exists';
                         return;
                    }

                    if(typeof(data.statusCode)!=='undefined' && (data.statusCode===1)){
                         console.log('New user is registered');
                         $scope.isRegistered = true;
                         return;
                    }
               };

               // 2 VERIFY 
               ///////////////////////////////////////////////////
               $scope.isFromVerify = function(){
                    var match = $location.path().match(/validation/);
                    return (match && match.length>=1);
               };

               $scope.verify = function(){
                    // 1 - call remote API
                    $scope.showSpinner = true;
                    $scope.errMsg = '';

                    var params = $location.search();
                    var sig = params.sig;
                    var id = params.id;

                    if(!sig || !id){
                         $scope.showSpinner = false;
                         $scope.errMsg = 'Error: no sig/id';
                         return;
                    }

                    console.log('Verifying your registration...');
                    $scope.isVerified = false;
                    api.verify(sig,id,function(err,statusCode,data){
                         // 2 - process response
                         $scope.showSpinner = false;
                         $scope.onVerifyComplete(err,statusCode,data);
                    });
               };

               $scope.onVerifyComplete = function(err,statusCode,data){
                    console.log('Verify returned: ' + err);
                    console.log('Status code: ' + statusCode);
                    console.log('Data: ',data);

                    if(err || (statusCode!==200)){
                         // TODO: show dlg
                         $scope.errMsg = 'Error. Feel free to write us: support@chain.cloud';
                         return;
                    }

                    if(typeof(data)!=='undefined'){
                         // Super!
                         $scope.isVerified = true;

                         $cookies.Token = data.token;
                         $cookies.ShortId = data.shortId;
                         return;
                    }
               };

               // 3 LOGIN 
               ///////////////////////////////////////////////////
               $scope.onLogin = function(email,password){
                    // 1 - call remote API
                    $scope.showSpinner = true;
                    $scope.errMsg = '';

                    api.login(email,password,function(err,statusCode,data){
                         // 2 - process response
                         $scope.showSpinner = false;
                         $scope.onLoginComplete(err,statusCode,data);
                    });
               };

               $scope.onLoginComplete = function(err,statusCode,data){
                    if(!err && statusCode===200){
                         console.log('Login succeeded');

                         // 2 - add token to cookies
                         $cookies.Token = data.token;
                         $cookies.ShortId = data.shortId;

                         // 3 - move next
                         $scope.gotoMain();
                    }else{
                         console.log('Can not login...',statusCode); 
                         console.log(data);

                         // TODO: show dlg
                         $scope.errMsg = 'Error: bad password';
                    }
               };

               /////////////////////////////////////////
               //////// START HERE:
               $scope.gotoMain = function(){
                    $window.location = '#/main';
               };

               $scope.reset();

               // check if from 'on_verified' path (see 'setup.js for routes)
               if($scope.isFromVerify()){
                    $scope.verify();
                    return;
               }
        }
    ]
);

