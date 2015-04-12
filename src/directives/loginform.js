'use strict';

angular.module('ngOAuth2Utils')
    .directive('loginForm', function () {
        return {
            restrict: 'E',
            controller: 'LoginCtrl',
            templateUrl: 'oauth2Templates/loginform.html'
        };
    });