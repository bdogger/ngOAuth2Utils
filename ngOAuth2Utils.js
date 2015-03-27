'use strict';

 (function(){

// Source: src/app.js
angular.module('ngOAuth2Utils', ['ngStorage'])
    .constant('oauthConfig', {
        getAccessTokenUrl: '',
        base64BasicKey: '',
        revokeTokenUrl: '',
        loginPath: '',
        interceptorIgnorePattern: / /,
        storageType: 'session'
    })

    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('$httpInterceptorService');
    }])

    .run(function ($location, $tokenService, $authenticationService, $rootScope, oauthConfig) {
        if ($tokenService.isValidAndExpiredToken()) {
            $authenticationService.refresh();
        }
        else if (!$tokenService.isValidToken()) {
            $location.path(oauthConfig.loginPath);
        }
        $rootScope.$on('$routeChangeStart', function (event) {
            if (!$tokenService.isValidToken()) {
                //prevent location change.
                event.preventDefault();
                $location.path(oauthConfig.loginPath);
            }
        });
    });
// Source: src/services/authenticationservice.js
angular.module('ngOAuth2Utils')
    .factory('$authenticationService', function $authenticationService($http, $tokenService, oauthConfig) {

        function setTokenValues(response) {
            $tokenService.setToken(response.access_token); //jshint ignore:line
            $tokenService.setExpiresIn(response.expires_in);// jshint ignore:line
            $tokenService.setRefreshToken(response.refresh_token)// jshint ignore:line
        }

        return {
            login: function (username, password) {
                return $http({
                    method: 'POST',
                    url: oauthConfig.getAccessTokenUrl,
                    headers: {'Authorization': 'Basic ' + oauthConfig.base64BasicKey},
                    data: {
                        'grant_type': 'password',
                        'password': password,
                        'username': username
                    }
                })
                    .success(function (response) {
                        setTokenValues(response);
                    })
                    .error(function () {
                        $tokenService.reset();
                    });
            },
            refresh: function () {
                return $http({
                    method: 'GET',
                    url: oauthConfig.getAccessTokenUrl,
                    headers: {'Authorization': 'Basic ' + oauthConfig.base64BasicKey},
                    params: {
                        'refresh_token': $tokenService.getRefreshToken(),
                        'grant_type': 'refresh_token'
                    }
                })
                    .success(function (response) {
                        setTokenValues(response);
                    });
            },
            logout: function () {
                return $http({
                    method: 'DELETE',
                    url: oauthConfig.revokeTokenUrl,
                    headers: {'Authorization': 'Bearer ' + $tokenService.getToken()}
                })
                    .success(function () {
                        $tokenService.reset();
                    });
            }
        };
    });
// Source: src/services/httpinterceptorservice.js
angular.module('ngOAuth2Utils')
    .factory('$httpInterceptorService', function $httpInterceptorService($q, $location, $tokenService, oauthConfig) {
        return {
            'request': function (config) {
                if (!config.url.match(oauthConfig.interceptorIgnorePattern) && $tokenService.getToken() != null) {
                    config.headers.Authorization = 'Bearer ' + $tokenService.getToken();
                }
                return config;
            },
            'responseError': function (rejection) {
                if (rejection.status === 401 || (rejection.status === 400
                    && rejection.config.params.grant_type === 'refresh_token')) {// jshint ignore:line
                    $tokenService.reset();
                    $location.path(oauthConfig.loginPath);
                }
                return $q.reject(rejection);
            }
        };
    });
// Source: src/services/storageservice.js
angular.module('ngOAuth2Utils')
    .factory('storageService', function storageService($sessionStorage, $localStorage, oauthConfig) {
        return {
            'getStorage': function () {
                return oauthConfig.storageType === 'local' ? $localStorage : $sessionStorage;
            }
        };
    });
// Source: src/services/tokenservice.js
angular.module('ngOAuth2Utils')
    .factory('$tokenService', function $tokenService(storageService) {
        return {
            getToken: function () {
                return storageService.getStorage().token;
            },
            setToken: function (token) {
                storageService.getStorage().token = token;
            },
            setExpiresIn: function (seconds) {
                storageService.getStorage().expiresIn = new Date(new Date().valueOf() + (seconds * 1000));
            },
            isValidToken: function () {
                if (this.getToken() == null || storageService.getStorage().expiresIn == null ||
                    storageService.getStorage().expiresIn.valueOf() < new Date().valueOf()) {
                    return false;
                }
                return true;
            },
            isValidAndExpiredToken: function () {
                if (this.getToken() != null && this.getRefreshToken() != null &&
                    storageService.getStorage().expiresIn != null && new Date().valueOf() < storageService.getStorage().expiresIn.valueOf()) {
                    return true;
                }
                return false;
            },
            setRefreshToken: function (refreshToken) {
                storageService.getStorage().refreshToken = refreshToken;
            },
            getRefreshToken: function () {
                return storageService.getStorage().refreshToken;
            },
            reset: function () {
                this.setToken(null);
                this.setRefreshToken(null);
                storageService.getStorage().expiresIn = null;
            }
        };
    });
})();