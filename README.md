#ngOAuth2Utils - Set of angular utilities for interacting with OAuth2 backends#

---
##What does this module do?##
When you add this module to your angular project (and configure it), it provides full authentication to your application using the Oauth2 password grant_type.
Once configured, you can use the require-authenticated and require unauthenticated directives to secure your UI.  Configuring a watch on $tokenService.isValidToken() provides the ability to run app-specific logic when logged out or logged in.

##Installation##
To install this component into your project

Set of Angular Services to interact with an Oauth2 backend using the password grant type

    bower install ngoauth2utils

Or, to save it into your bower dependencies

    bower install ngoauth2utils --save
    
##A note about base64BasicKey##
Including this in your code does mean that the user will have access to it.  However, it is part of the spec, and some oauth2 backends will not function if it not included.  So long as the client is configured to only have password and refresh grant types, then the client cannot be used to access other users information.

##General Usage##
Add ngOauth2Utils to your project
    
    angular.module('yourAngularModule',  ['ngOAuth2Utils'])

Configure the ouathConstants in a config block:

    angular.module('yourAngularModule',  ['ngOAuth2Utils'])
        .config(function(oauthConfig) {
           oauthConfig.getAccessTokenUrl = 'http://www.mysite.com/ouath/token';
           oauthConfig.base64BasicKey = '123123asdfasdf=asdfasdf';
           oauthConfig.revokeTokenUrl = 'http://www.mysite.com/token';
           oauthConfig.interceptorIgnorePattern = /oauth\/token/;           
           oauthConfig.storageType = 'session';
           oauthConfig.loginSuccessPath = '/successful-login-path';
           oauthConfig.loginErrorMessage = 'error_description';
           oauthConfig.logoutSuccessMessage = 'logoutSuccess';           
           oauthConfig.useRouting = true;           
           oauthConfig.forgotPasswordURL = 'http://localhost/#/forgot-password';
           oauthConfig.unsecuredPaths.push('/forgot-password');
           oauthConfig.unsecuredPaths.push('/unsecured');
        });

##Configuration Values##
**getAccessTokenUrl** the URL to use for retrieving a token, a GET request will be made

**base64BasicKey:** the base64 version of your client:secret key

**revokeTokenUrl:** the url to revoke a token, a DELETE request will be made

**interceptorIgnorePattern:** if the URL matches this pattern, then the authorization header will not be added to the request

**loginPath:** the angular route to display the login form

**storageType** the type of storage to use, either 'local' for localStorage, or 'session' for sessionStorage.  Session being the default, and more secure option

**loginSuccessPath** the path to display if a user has successfully logged in

**loginErrorMessage** the value in the response that contains the login error message

**logoutSuccessMessage** the value in the response that contains the successful logout message

**userRouting** true or false, true by default -if true, then a login and logout paths and forms will be created for you

**loginFunction** a function to be ran when successfully logged in

**forgotPasswordURL** provide this value if you have a special form for requesting a password reset

**unsecuredPaths** an array of paths that will not require authentication to view

##Usage##
If userRouting is true, then it is assumed you are using routes and ng-view, then the app will configure a login route for you and require unauthenticated users to authenticate using the provided login form.
The require-authenticated and require-unauthenticated directives are attribute directives and can be displayed to any element to either show or hide them based upon authenticated status. 
A loginFunction can be provided to be called after a successful login.  Or, a watch can be created to run upon successful token creation (login) or destruction (logout)
    
    $rootScope.$watch(function () {
      return $tokenService.isValidToken();
    }, function () {
      if ($tokenService.isValidToken()) {
        //successful login code
      } else {
        //logout code
      }
    });

##To use $authenticationService##
The $authenticationService has methods for getting an access token, refreshing a token, and logging out.

##$tokenService##
Is really just a wrapper for $localStorage from the ngstorage component.  The $authenticationService and $httpInterceptorService rely on the $tokenService
 
##More Details##
Please view the tests for examples of all services.

##TODO##
Add e2e tests for application - I have e2e tests created for the applications that use this module, but I need to setup a fake server to provide successful and unsuccessful statuses in order to bundle e2e tests with the module
 
Provide a logout success callback



    
