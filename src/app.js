'use strict';

angular.module('ngOAuth2Utils', ['ngStorage', 'ngRoute'])
    .constant('oauthConfig', {
        getAccessTokenUrl: '',
        base64BasicKey: '',
        revokeTokenUrl: '',
        loginPath: '/login',
        loginSuccessPath: '',
        interceptorIgnorePattern: / /,
        loginErrorMessage: '',
        loginFunction: null,
        logoutSuccessMessage: '',
        storageType: 'session',
        useRouting: true
    })

    .config(function ($routeProvider, oauthConfig) {
        if (oauthConfig.useRouting) {
            $routeProvider
                .when('/login', {
                    controller: 'LoginCtrl',
                    template: '<login-form></login-form>'
                })
                .when('/logout', {
                    controller: 'LogoutCtrl',
                    template: '<logout-message></logout-message>'
                });
        }
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
        $rootScope.$on('$routeChangeStart', function () {
            if (!$tokenService.isValidToken()) {
                $rootScope.$evalAsync(function () {
                    $location.path('/login');
                });
            }
        });
    });