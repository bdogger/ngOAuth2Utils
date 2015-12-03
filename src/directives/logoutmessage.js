'use strict';

angular.module('ngOAuth2Utils')
    .directive('logoutMessage', function () {
        return {
            restrict: 'E',
            templateUrl: 'oauth2Templates/logout.html'
        };
    });