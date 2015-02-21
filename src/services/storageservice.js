'use strict';

angular.module('ngOAuth2Utils')
    .factory('storageService', function storageService($sessionStorage, $localStorage, oauthConfig) {
        return {
            'getStorage': function () {
                return oauthConfig.storageType === 'local' ? $localStorage : $sessionStorage;
            }
        };
    });