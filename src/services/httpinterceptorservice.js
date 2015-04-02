'use strict';

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
                if (rejection.status === 401 ||
                    (rejection.status === 400 // jshint ignore:line
                    && rejection.config.data// jshint ignore:line
                    && rejection.config.data.grant_type// jshint ignore:line
                    && rejection.config.data.grant_type === 'refresh_token')) {// jshint ignore:line
                    $tokenService.reset();
                    $location.path(oauthConfig.loginPath);
                }
                return $q.reject(rejection);
            }
        };
    });