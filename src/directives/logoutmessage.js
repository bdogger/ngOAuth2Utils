'use strict';

angular.module('ngOAuth2Utils')
    .directive('logoutMessage', function () {
        return {
            restrict: 'E',
            template: '<div class="alert alert-success" id="logout-message">You have successfully logged out.</div>'
        };
    });