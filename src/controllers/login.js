'use strict';

angular.module('ngOAuth2Utils')
    .controller('LoginCtrl', function ($scope, $location, $authenticationService, oauthConfig) {
        $scope.login = function (loginDetails) {
            $scope.loginError = null;
            $authenticationService.login(loginDetails.username, loginDetails.password).then(
                function () {
                    $location.path(oauthConfig.loginSuccessPath);
                    if (oauthConfig.loginFunction) {
                        oauthConfig.loginFunction();
                    }
                },
                function (response) {
                    $scope.loginError = response.data[oauthConfig.loginErrorMessage];// jshint ignore:line
                });
        };

        if(oauthConfig.forgotPasswordURL) {
            $scope.forgotPasswordURL = oauthConfig.forgotPasswordURL;
        }
    });