'use strict';

angular.module('ngOAuth2Utils')
    .directive('requireAuthenticated', function ($tokenService) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                scope.$watch(function () {
                    return $tokenService.isValidToken();
                }, function () {
                    if ($tokenService.isValidToken()) {
                        element.removeClass('hidden');
                    } else {
                        element.addClass('hidden');
                    }
                });
            }
        };
    });