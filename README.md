#ngOAuth2Utils - Set of angular utilities for interacting with OAuth2 backends#

---

##Installation##

To install this component into your project

Set of Angular Services to interact with an Oauth2 backend using the password grant type

    bower install ngoauth2utils

#General Usage#
Add an oauth2config constant with the following values:
    
    angular.module('yourAngularModule',  ['ngOAuth2Utils'])
        .constant('oauth2Config', {
            base64BasicKey: '123123asdfasdf=asdfasdf',  //base64 version of clientid:secret
            getAccessTokenUrl: 'http://localhost/oauth/token',  //The GET url to get a new token
            revokeTokenUrl: 'http://localhost/token', //The DELETE url to revoke a token
        });
        
##To use $httpInterceptorService##
    angular.module('yourAngularModule', ['ngOAuth2Utils'])
        .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('$httpInterceptorService');
    }]);
    
This will check for 400 and 401 unauthenticated response errors and will change the location path to 'login' if unauthenticated
    
This will check all outgoing requests, except to /oauth/token, and will add an access token if one is available

##To use $authenticationService##
The $authenticationService has methods for getting an access token, refreshing a token, and logging out.

##$tokenService##
Is really just a wrapper for $localStorage from the ngstorage component.  The $authenticationService and $httpInterceptorService rely on the $tokenService
 
##More Details##
Please view the tests for examples of all services



    
