'use strict';

angular.module('ngOAuth2Utils')
    .controller('LogoutCtrl', function ($scope, $authenticationService, $tokenService, storageService, oauthConfig) {
        $authenticationService.logout()
            .then(function (response) {
                $scope.logoutSuccess = response.data[oauthConfig.logoutSuccessMessage];
            });
        storageService.getStorage().$reset({});
        $tokenService.reset();
    });