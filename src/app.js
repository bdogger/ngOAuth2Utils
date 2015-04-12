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
                })
                .when('/access-denied', {
                    template: '<access-denied-message></access-denied-message>'
                })
                .when('/malformed-url', {
                    template: '<malformed-url-message></malformed-url-message>'
                })
                .when('/error', {
                    template: '<error-message></error-message>'
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
        $rootScope.$on('$routeChangeStart', function (event) {
            if (!$tokenService.isValidToken()) {
                event.preventDefault();
                $location.path(oauthConfig.loginPath);
            }
        });
    });