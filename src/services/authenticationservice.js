'use strict';

angular.module('ngOAuth2Utils')
    .factory('$authenticationService', function $authenticationService($http, $tokenService, oauthConfig) {

        function setTokenValues(response) {
            $tokenService.setToken(response.access_token); //jshint ignore:line
            $tokenService.setExpiresIn(response.expires_in);// jshint ignore:line
            $tokenService.setRefreshToken(response.refresh_token)// jshint ignore:line
        }

        return {
            login: function (username, password) {
                return $http({
                    method: 'GET',
                    url: oauthConfig.getAccessTokenUrl,
                    headers: {'Authorization': 'Basic ' + oauthConfig.base64BasicKey},
                    params: {
                        'grant_type': 'password',
                        'password': password,
                        'username': username
                    }
                })
                    .success(function (response) {
                        setTokenValues(response);
                    })
                    .error(function () {
                        $tokenService.reset();
                    });
            },
            refresh: function () {
                return $http({
                    method: 'GET',
                    url: oauthConfig.getAccessTokenUrl,
                    headers: {'Authorization': 'Basic ' + oauthConfig.base64BasicKey},
                    params: {
                        'refresh_token': $tokenService.getRefreshToken(),
                        'grant_type': 'refresh_token'
                    }
                })
                    .success(function (response) {
                        setTokenValues(response);
                    });
            },
            logout: function () {
                return $http({
                    method: 'DELETE',
                    url: oauthConfig.revokeTokenUrl,
                    headers: {'Authorization': 'Bearer ' + $tokenService.getToken()}
                })
                    .success(function () {
                        $tokenService.reset();
                    });
            }
        };
    });