
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
               };

               $scope.loadDocs = function(){
                    $scope.showSpinner = true;

                    api.getAllDocs(function(err,statusCode,data){
                         $scope.showSpinner = false;

                         if(!helpers.processError(null,statusCode,'Getting objects')){
                              $scope.errMsg = 'Error...';
                              return;
                         }

                         console.log('GET DOCS RESULT: ',data);
                         $scope.documents = data.docs.slice(0);
                    });
               };

               $scope.onVerify = function(files){
                    console.log('On Verify clicked');

                    $scope.errMsg = '';
                    $scope.txLink = '';

                    if(files && files.length) {
                         var file = files[0];

                         var fileReader = new $window.FileReader();

                         fileReader.onload = function(e) {
                              var data = fileReader.result;
                              var array = new Int8Array(data);
                              
                              // Calculate HASH
                              var hexString = SHA256.hash(array);

                              api.getDoc(hexString,function(err,status,data){
                                   $scope.onVerifyComplete(err,status,data);
                              });
                         };

                         fileReader.onerror = function () {
                              console.log('onerror');

                              $scope.errMsg = 'Can not Verify. Please contact support';
                              $scope.showSpinner = false;
                         };

                         $scope.showSpinner = true;
                         fileReader.readAsArrayBuffer(file);
                    }else{
                         $scope.errMsg = 'Bad filename';
                    }
               };

               $scope.onVerifyComplete = function(err,statusCode,data){
                    if(!helpers.processError(null,statusCode,'Verify document')){
                         $scope.errMsg = 'Error...';
                         return;
                    }
                   
                    $scope.showSpinner = false;

                    console.log('VERIFY STATUS: ' + statusCode);
                    console.log('VERIFY RESULT: ',data);

                    if(statusCode!==200){
                         $scope.errMsg = 'Document is NOT IN BLOCKCHAIN.';
                         return;
                    }

                    if(data.txHash){
                         // move to TX
                         $window.location = '#/doc/' + data.docHash;
                    }
               };

               $scope.onAdd = function(files){
                    $scope.errMsg = '';
                    $scope.txLink = '';

                    if(files && files.length) {
                         var file = files[0];

                         var fileReader = new $window.FileReader();

                         fileReader.onload = function(e) {
                              //console.log('onload');
                              //console.log(e);

                              var data = fileReader.result;
                              var array = new Int8Array(data);
                              
                              // Calculate HASH
                              var hexString = SHA256.hash(array);
                              var fileDate = '';  // TODO

                              api.addDocument(file.name,file.size,fileDate,hexString,function(err,status,data){
                                   $scope.onAddDocumentComplete(err,status,data);
                              });
                         };

                         fileReader.onerror = function () {
                              console.log('onerror');

                              $scope.errMsg = 'Can not Add Document to BlockChain. Please contact support';
                              $scope.showSpinner = false;
                         };

                         $scope.showSpinner = true;
                         fileReader.readAsArrayBuffer(file);
                    }else{
                         $scope.errMsg = 'Bad filename';
                    }
               };

               $scope.onAddDocumentComplete = function(err,status,data){
                    if(!helpers.processError(null,status,'Add document')){
                         $scope.errMsg = 'Error...';
                         return;
                    }
                   
                    $scope.showSpinner = false;

                    if(data.txHash && data.txHash.length){
                         $scope.errMsg = 'Sucess!';
                         $scope.txLink = data.infoLink;
                    }else{
                         $scope.errMsg = 'Error. Can not add document to transaction';
                    }

                    // reload list
                    $scope.loadDocs();
               };

               /////////////////////////////////////////
               //////// START HERE:
               $scope.reset();

               console.log('MAIN controller loading...');
       }
     ]
);
