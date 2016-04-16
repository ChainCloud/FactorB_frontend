
angular.module('factorb.controllers').directive('validNumber', function() {
     return {
          require: '?ngModel',
          link: function(scope, element, attrs, ngModelCtrl) {
               if(!ngModelCtrl) {
                    return; 
               }

               ngModelCtrl.$parsers.push(function(val) {
                    if (angular.isUndefined(val)) {
                         var val = '';
                    }

                    var clean = val.replace( /[^0-9]+/g, '');
                    if (val !== clean) {
                         ngModelCtrl.$setViewValue(clean);
                         ngModelCtrl.$render();
                    }
                    return clean;
               });

               element.bind('keypress', function(event) {
                    if(event.keyCode === 32) {
                         event.preventDefault();
                    }
               });
          }
     };
});


angular.module('factorb.controllers').controller('controllers.MainController',
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
                    $scope.txLink = '';

                    $scope.hash = ''
               };

               $scope.isValidInn = function(inn){
                    if(!inn){
                         return false;
                    }
                    if(inn.length==8 || inn.length==10){
                         return true;
                    }
                    return false;
               };

               $scope.onAdd = function(files){
                    // TODO: 1 - validate params

                    // 2 - call API 
                    $scope.calcHash();

                    var fkName = $scope.fkName;

                    console.log('Adding doc to blockchain!: ' + $scope.hash);
                    api.addDoc($scope.hash,fkName,function(err,status,data){
                         // TODO: check return
                         console.log('RET ERR: ', err);
                         console.log('RET STATUS: ',status);
                         console.log('RET DATA: ',data);

                         if(typeof(data.fkOut)=='undefined'){
                              console.log('OK');

                              var l = encodeURIComponent(data.link);
                              $window.location = '/#/success?link=' + l;
                         }else{
                              console.log('Not OK: ' + data.fkOut);
                              $window.location = '/#/failure';
                         }
                    });
               };

               $scope.calcHash = function(){
                    var inn1 = $scope.inn1;
                    var inn2 = $scope.inn2;
                    var date = $scope.date;
                    var amount = $scope.amount; 

                    var fullStr = '' + inn1 + inn2 + date + amount;
                    $scope.hash = SHA256.hash(fullStr);
               };

               $scope.onChange = function(){
                    // recalculate hash if user input has changed
                    $scope.calcHash();
               };

               /////////////////////////////////////////
               //////// START HERE:
               $scope.reset();

               console.log('MAIN controller loading...');
       }
     ]
);
