'use strict';

angular.module('ngOAuth2Utils')
    .directive('loginForm', function () {
        return {
            restrict: 'E',
            templateUrl: 'oauth2Templates/loginform.html'
        };
    });