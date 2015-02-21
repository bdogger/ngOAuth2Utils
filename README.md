#ngOAuth2Utils - Set of angular utilities for interacting with OAuth2 backends#

---
##What does this module do?##
When you add this module to your angular project (and configure it), it provides the services necessary to have an oauth authentication scheme.
At this point login and logout controllers and views will have to be added independent of this project in order to keep the services flexible.
Once configured, you can use the services to secure your application against unauthenticated users also use it for communicating with an Ouath2 authentication server and for adding an Authorization token to every request.

##Installation##
To install this component into your project

Set of Angular Services to interact with an Oauth2 backend using the password grant type

    bower install ngoauth2utils

Or, to save it into your bower dependencies

    bower install ngoauth2utils --save

##General Usage##
Add ngOauth2Utils to your project
    
    angular.module('yourAngularModule',  ['ngOAuth2Utils'])

Configure the ouathConstants in a config block:

    angular.module('yourAngularModule',  ['ngOAuth2Utils'])
        .config(function(oauthConfig) {
           oauthConfig.getAccessTokenUrl: 'http://www.mysite.com/ouath/token',
           oauthConfig.base64BasicKey: '123123asdfasdf=asdfasdf',
           revokeTokenUrl: 'http://www.mysite.com/token',
           interceptorIgnorePattern: /oauth\/token/,
           loginPath: '/login',
           storageType: 'session'
        });

##Configuration Values##
**getAccessTokenUrl** the URL to use for retrieving a token, a GET request will be made

**base64BasicKey:** the base64 version of your client:secret key

**revokeTokenUrl:** the url to revoke a token, a DELETE request will be made

**interceptorIgnorePattern:** if the URL matches this pattern, then the authorization header will not be added to the request

**loginPath:** the angular route to display the login form

**storageType** the type of storage to use, either 'local' for localStorage, or 'session' for sessionStorage.  Session being the default, and more secure option


##To use $authenticationService##
The $authenticationService has methods for getting an access token, refreshing a token, and logging out.

##$tokenService##
Is really just a wrapper for $localStorage from the ngstorage component.  The $authenticationService and $httpInterceptorService rely on the $tokenService
 
##More Details##
Please view the tests for examples of all services



    
