'use strict';

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