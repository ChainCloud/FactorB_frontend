// This service is used as a HTTP/HTTPS interceptor to inject Auth header
angular.module('factorb.services').factory('authInterceptor',[
    '$q',
    '$cookies',

     function ($q, $cookies) {
        return {
            request: function (config) {
                config.headers = config.headers || {};

                if(typeof($cookies.Token)!=='undefined') {
                     config.headers.Authorization = 'Bearer ' + $cookies.Token;
                }

                return config;
            },

            response: function (response) {
                return response || $q.when(response);
            }
        };
    }
    ]
);

// these methods require no authentication
angular.module('factorb.services').factory('services.Api',[
    '$q',
    '$http',
    '$cookies',
    'services.Helpers',

    function ($q, $http, $cookies, helpers ){
        return {
            addDoc: function(hash,fkName,cb){
                var serverUrl = helpers.getServerUrl();
                var shortId = $cookies.ShortId;
                var url = serverUrl + '/docs/v1';

                var dataIn = {
                    hash: hash,
                    fkName: fkName
                };

                $http({
                    method:"POST",
                    data: dataIn,
                    url: url
                })
                    .success(function (data, status, headers, config) {
                        cb(null,status,data);
                    })
                    .error(function (data, status, headers, config) {
                         cb(new Error("Can not add new document"),status,data);
                    });
            },
        };
    }
]);

