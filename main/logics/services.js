// This service is used as a HTTP/HTTPS interceptor to inject Auth header
angular.module('chaincloud.services').factory('authInterceptor',[
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
angular.module('chaincloud.services').factory('services.Api',[
    '$q',
    '$http',
    '$cookies',
    'services.Helpers',

    function ($q, $http, $cookies, helpers ){
        return {
            register: function(email,password,cb){
                var serverUrl = helpers.getServerUrl();
                var url = serverUrl + '/users/v1';

                $http({
                    method:"POST",
                    data: {
                         email:email,
                         pass:password
                    },

                    url: url
                })
                    .success(function (data, status, headers, config) {
                        cb(null,status,data);
                    })
                    .error(function (data, status, headers, config) {
                         cb(new Error("Can not register"),status,data);
                    });
            },

            verify: function(sig,id,cb){
                var serverUrl = helpers.getServerUrl();
                var url = serverUrl + '/users/' + id + '/validation/v1?sig=' + sig;

                $http({
                    method:"POST",
                    data: {
                    },

                    url: url
                })
                    .success(function (data, status, headers, config) {
                        cb(null,status,data);
                    })
                    .error(function (data, status, headers, config) {
                         cb(new Error("Can not verify"),status,data);
                    });
            },

            login: function(login,password,cb){
                var serverUrl = helpers.getServerUrl();
                var url = serverUrl + '/users/' + login + '/login/v1';

                $http({
                    method:"POST",
                    data: {pass:password},
                    url: url
                })
                    .success(function (data, status, headers, config) {
                        cb(null,status,data);
                    })
                    .error(function (data, status, headers, config) {
                         cb(new Error("Can not login"),status,data);
                    });
            },

            resetPassword: function(login,cb){
                var serverUrl = helpers.getServerUrl();
                var url = serverUrl + '/users/' + login + '/reset_password_request/v1';

                $http({
                    method:"POST",
                    data: {},
                    url: url
                })
                    .success(function (data, status, headers, config) {
                        cb(null,status,data);
                    })
                    .error(function (data, status, headers, config) {
                         cb(new Error("Can not reset the password"),status,data);
                    });
            },

            setNewPassword: function(shortId,newPassword,sig,cb){
                var serverUrl = helpers.getServerUrl();
                var url = serverUrl + '/users/' + shortId + '/password/v1/?sig=' + sig + '&new_val=' + newPassword;

                $http({
                    method:"PUT",
                    data: {},
                    url: url
                })
                    .success(function (data, status, headers, config) {
                        cb(null,status,data);
                    })
                    .error(function (data, status, headers, config) {
                         cb(new Error("Can not set new password"),status,data);
                    });
            },

            addDocument: function(fileName,fileSize,fileDate,hash,cb){
                var serverUrl = helpers.getServerUrl();
                var shortId = $cookies.ShortId;
                var url = serverUrl + '/auth/users/' + shortId + '/docs/v1';

                var dataIn = {
                    hash: '' + hash,
                    docName: fileName,
                    docDate: fileDate,
                    docSize: fileSize,
                    // BTC Testnet3
                    blockchainType: 2 
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

            getAllDocs: function(cb){
                var serverUrl = helpers.getServerUrl();
                var shortId = $cookies.ShortId;
                var url = serverUrl + '/auth/users/' + shortId + '/docs/v1';

                $http({
                    method:"GET",
                    url: url
                })
                    .success(function (data, status, headers, config) {
                        cb(null,status,data);
                    })
                    .error(function (data, status, headers, config) {
                         cb(new Error("Can not get all docs"),status,data);
                    });
            },

            getDoc: function(id,cb){
                var serverUrl = helpers.getServerUrl();
                var shortId = $cookies.ShortId;

                // ID is actually a SHA-256 document hash
                var url = serverUrl + '/auth/users/' + shortId + '/docs/' + id + '/v1';

                $http({
                    method:"GET",
                    url: url
                })
                    .success(function (data, status, headers, config) {
                        cb(null,status,data);
                    })
                    .error(function (data, status, headers, config) {
                         cb(new Error("Can not get doc info"),status,data);
                    });
            },

        };
    }
]);

