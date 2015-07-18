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
        forgotPasswordURL: null,
        logoutSuccessMessage: '',
        storageType: 'session',
        useRouting: true,
        unsecuredPaths: []
    })

    .config(function ($routeProvider, oauthConfig) {
        if (oauthConfig.useRouting) {
            $routeProvider
                .when('/login', {
                    controller: 'LoginCtrl',
                    templateUrl: 'oauth2Templates/login.html'
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
        else if (!$authenticationService.allowAnonymous($location.path()) && !$tokenService.isValidToken()) {
            $location.path(oauthConfig.loginPath);
        }
        $rootScope.$on('$routeChangeStart', function (event, next) {

            if (!$authenticationService.allowAnonymous(next.originalPath) && !$tokenService.isValidToken()) {
                $rootScope.$evalAsync(function () {
                    $location.path('/login');
                });
            }

        });
    });