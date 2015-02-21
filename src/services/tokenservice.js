'use strict';

angular.module('ngOAuth2Utils')
    .factory('$tokenService', function $tokenService(storageService) {
        return {
            getToken: function () {
                return storageService.getStorage().token;
            },
            setToken: function (token) {
                storageService.getStorage().token = token;
            },
            setExpiresIn: function (seconds) {
                storageService.getStorage().expiresIn = new Date(new Date().valueOf() + (seconds * 1000));
            },
            isValidToken: function () {
                if (this.getToken() == null || storageService.getStorage().expiresIn == null ||
                    storageService.getStorage().expiresIn.valueOf() < new Date().valueOf()) {
                    return false;
                }
                return true;
            },
            isValidAndExpiredToken: function () {
                if (this.getToken() != null && this.getRefreshToken() != null &&
                    storageService.getStorage().expiresIn != null && new Date().valueOf() < storageService.getStorage().expiresIn.valueOf()) {
                    return true;
                }
                return false;
            },
            setRefreshToken: function (refreshToken) {
                storageService.getStorage().refreshToken = refreshToken;
            },
            getRefreshToken: function () {
                return storageService.getStorage().refreshToken;
            },
            reset: function () {
                this.setToken(null);
                this.setRefreshToken(null);
                storageService.getStorage().expiresIn = null;
            }
        };
    });