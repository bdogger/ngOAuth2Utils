'use strict';

 (function(){

// Source: src/app.js
angular.module('ngOAuth2Utils', ['ngStorage', 'ngRoute'])
    .constant('oauthConfig', {
        getAccessTokenUrl: '',
        base64BasicKey: '',
        revokeTokenUrl: '',
        loginPath: '/login',
        loginSuccessPath: '',
        interceptorIgnorePattern: / /,
        loginErrorMessage: '',
        loginFunction: null,
        logoutSuccessMessage: '',
        storageType: 'session',
        useRouting: true
    })

    .config(function ($routeProvider, oauthConfig) {
        if (oauthConfig.useRouting) {
            $routeProvider
                .when('/login', {
                    controller: 'LoginCtrl',
                    template: '<login-form></login-form>'
                })
                .when('/logout', {
                    controller: 'LogoutCtrl',
                    template: '<logout-message></logout-message>'
                })
                .when('/access-denied', {
                    template: '<access-denied-message></access-denied-message>'
                })
                .when('/malformed-url', {
                    template: '<malformed-url-message></malformed-url-message>'
                })
                .when('/error', {
                    template: '<error-message></error-message>'
                });
        }
    })

    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('$httpInterceptorService');
    }])

    .run(function ($location, $tokenService, $authenticationService, $rootScope, oauthConfig) {
        if ($tokenService.isValidAndExpiredToken()) {
            $authenticationService.refresh();
        }
        else if (!$tokenService.isValidToken()) {
            $location.path(oauthConfig.loginPath);
        }
        $rootScope.$on('$routeChangeStart', function (event) {
            if (!$tokenService.isValidToken()) {
                event.preventDefault();
                $location.path(oauthConfig.loginPath);
            }
        });
    });
// Source: src/controllers/login.js
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
    });
// Source: src/controllers/logout.js
angular.module('ngOAuth2Utils')
    .controller('LogoutCtrl', function ($scope, $authenticationService, $tokenService, storageService, oauthConfig) {
        $authenticationService.logout()
            .then(function (response) {
                $scope.logoutSuccess = response.data[oauthConfig.logoutSuccessMessage];
            });
        storageService.getStorage().$reset({});
        $tokenService.reset();
    });
// Source: src/directives/loginform.js
angular.module('ngOAuth2Utils')
    .directive('loginForm', function () {
        return {
            restrict: 'E',
            controller: 'LoginCtrl',
            templateUrl: 'oauth2Templates/loginform.html'
        };
    });
// Source: src/directives/requireauthenticated.js
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
// Source: src/directives/requirerequireauthenticated.js.js
angular.module('ngOAuth2Utils')
    .directive('requireUnauthenticated', function ($tokenService) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                scope.$watch(function () {
                    return $tokenService.isValidToken();
                }, function () {
                    if (!$tokenService.isValidToken()) {
                        element.removeClass('hidden');
                    } else {
                        element.addClass('hidden');
                    }
                });
            }
        };
    });
// Source: src/oauth2Templates/templates.js
angular.module('ngOAuth2Utils').run(['$templateCache', function($templateCache) {
$templateCache.put('oauth2Templates/loginform.html',
    "<div>\n" +
    "    <div class=\"alert alert-danger login-error\" id=\"login-error\" ng-if=\"loginError\">{{loginError}}</div>\n" +
    "    <form name=\"loginForm\" novalidate ng-submit=\"login(loginDetails)\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <input name=\"username\" id=\"username\" class=\"form-control\" type=\"text\" placeholder=\"username\"\n" +
    "                   ng-model=\"loginDetails.username\"\n" +
    "                   required/>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input name=\"password\" id=\"password\" class=\"form-control\" type=\"password\" placeholder=\"password\"\n" +
    "                   ng-model=\"loginDetails.password\" required/>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <button type=\"submit\" class=\"btn btn-primary btn-block login-button\" ng-disabled=\"loginForm.$invalid\">\n" +
    "                Login <span class=\"glyphicon glyphicon-user\"></span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>"
  );

}]);

// Source: src/services/authenticationservice.js
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
                    method: 'POST',
                    url: oauthConfig.getAccessTokenUrl,
                    headers: {'Authorization': 'Basic ' + oauthConfig.base64BasicKey},
                    data: {
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
                    method: 'POST',
                    url: oauthConfig.getAccessTokenUrl,
                    headers: {'Authorization': 'Basic ' + oauthConfig.base64BasicKey},
                    data: {
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
// Source: src/services/httpinterceptorservice.js
angular.module('ngOAuth2Utils')
    .factory('$httpInterceptorService', function $httpInterceptorService($q, $location, $tokenService, oauthConfig) {
        return {
            'request': function (config) {
                if (!config.url.match(oauthConfig.interceptorIgnorePattern) && $tokenService.getToken() != null) {
                    config.headers.Authorization = 'Bearer ' + $tokenService.getToken();
                }
                return config;
            },
            'responseError': function (rejection) {
                if (rejection.status === 401 ||
                    (rejection.status === 400 // jshint ignore:line
                    && rejection.config.data// jshint ignore:line
                    && rejection.config.data.grant_type// jshint ignore:line
                    && rejection.config.data.grant_type === 'refresh_token')) {// jshint ignore:line
                    $tokenService.reset();
                    $location.path(oauthConfig.loginPath);
                }
                return $q.reject(rejection);
            }
        };
    });
// Source: src/services/storageservice.js
angular.module('ngOAuth2Utils')
    .factory('storageService', function storageService($sessionStorage, $localStorage, oauthConfig) {
        return {
            'getStorage': function () {
                return oauthConfig.storageType === 'local' ? $localStorage : $sessionStorage;
            }
        };
    });
// Source: src/services/tokenservice.js
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
})();