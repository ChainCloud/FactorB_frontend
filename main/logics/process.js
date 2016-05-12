
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
        '$http',

        'Upload',

        'services.Api',
        'services.Helpers',

        function($scope,$rootScope,$window,$location,$timeout,ngDialog,$cookies,$q,$http,Upload,api,helpers)
        {
               $scope.reset = function () {
                    $scope.showSpinner = false;

                    $scope.state = 'Обрабатывается...';
                    $scope.id = '';
                    $scope.sig = '';
                    $scope.errorMsg = '';
               };

               $scope.onGoToMain = function(){
                    $window.scrollTo(0, 0);
                    $window.location = '#/main';
               };

               $scope.load = function(){
                    console.log('Getting task: ' + $scope.id + ' with sig: ' + $scope.sig);
                    
                    // 1 - call process
                    var url = helpers.getServerUrl() 
                         + '/tasks/' + $scope.id 
                         + '/process/v1'
                         + '?sig=' + $scope.sig;

                    $http({
                         method:"POST",
                         data: {},
                         url: url
                     })
                         .success(function (data, status, headers, config) {
                              $scope.isUploading = false;

                              console.log('Processing called and succeed');
                              console.log('DATA: ',data);

                              // 2 - check task status
                              $scope.getTaskStatus();
                         })
                         .error(function (data, status, headers, config) {
                              $scope.isUploading = false;

                              console.log('Can not process task');
                              $window.alert('Ошибка!'); 
                         });
               };

               $scope.getTaskStatus = function(){
                    console.log('Getting task status');
                    
                    var url = helpers.getServerUrl() 
                         + '/tasks/' + $scope.id 
                         + '/v1'
                         + '?sig=' + $scope.sig;

                    $http({
                         method:"GET",
                         url: url
                     })
                         .success(function (data, status, headers, config) {
                              $scope.isUploading = false;

                              // 3 - check return 
                              if(data && data.state==2){
                                   // complete!
                                   $scope.processStatus(data);
                              }else{
                                   // check again...
                                   $scope.getTaskStatusAgain();
                              }
                         })
                         .error(function (data, status, headers, config) {
                              $scope.isUploading = false;

                              console.log('Can not process task');
                              $window.alert('Ошибка - невозможно получить статус выполнения!'); 
                         });
               };

               $scope.getTaskStatusAgain = function(){
                    var tm = 3000;

                    $timeout(function() {
                         console.log('Getting task status again...');
                         $scope.getTaskStatus();
                    }, tm);
               };

               // After task is complete -> process data
               $scope.processStatus = function(data){
                    console.log('DATA: ',data);
                    if(data.state!=2){
                         return;
                    }

                    $scope.state = 'данные получены!';
                    $scope.data = data;
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
