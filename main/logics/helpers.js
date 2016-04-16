
angular.module('factorb.services').factory('services.Helpers',[
    '$q',
    '$window',
    '$cookies',
    '$location',

    function($q,$window,$cookies,$location){
        return {
            // Helper function to extract claims from a JWT. Does *not* verify the
            // validity of the token.
            // credits: https://github.com/firebase/angularFire/blob/master/angularFire.js#L370
            // polyfill window.atob() for IE8: https://github.com/davidchambers/Base64.js
            // or really fast Base64 by Fred Palmer: https://code.google.com/p/javascriptbase64/
            deconstructJWT: function(token) {
                var segments = token.split(".");
                if (!segments instanceof Array || segments.length !== 3) {
                    throw new Error("Invalid JWT");
                }
                var claims = segments[1];
                return JSON.parse(decodeURIComponent(window.atob(claims)));
            },

            getServerUrl: function(){
                 var serverUrl = 'http://52.31.141.39:8080'; 
                 return serverUrl;
            },

            processError:function(err,statusCode,txtToConsole){
                if(!err && (statusCode!==0)){
                     console.log(txtToConsole + ' succeeded');
                }else{
                     console.log('!FAILED ' + txtToConsole + ': ' + err);
                }

                // get token again! It can be expired!
                if(statusCode===401){
                     $cookies.Token = '';
                     $cookies.ShortId = '';

                     $window.location = '#/login';
                     return false;
                }

                if(err || (statusCode===0)){
                     // TODO:
                     //$scope.currentError = err;
                     return false;
                }

                // continue! no error
                return true;
           },

           generateRandStr:function(count){
                var getRandom = function(min, max) {
                     return Math.floor(Math.random() * (max - min) + min);
                };

               var out = '';
               //var randString = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
               var randString = "0123456789";
               for(var i=0; i<count; ++i){
                    out = out + randString.charAt(getRandom(0,randString.length-1));
               }

               return out;
           },

           blockchainTypeToStr: function(type){
               if(type===1){
                    return 'BTC Main Net';
               }
               if(type===2){
                    return 'BTC Test Net 3';
               }
               if(type===3){
                    return 'ETH Main';
               }
               if(type===4){
                    return 'ETH Test';
               }
               return '';
           },

        };
    }]
);

