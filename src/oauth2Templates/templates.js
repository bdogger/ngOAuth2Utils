angular.module('ngOAuth2Utils').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('oauth2Templates/login.html',
    "<login-form></login-form>\n" +
    "<div ng-if=\"forgotPasswordURL\">\n" +
    "    <a id=\"forgot-password-link\" class=\"btn btn-warning\" href=\"{{forgotPasswordURL}}\"><span class=\"fa fa-question-circle\"></span> Forgot/Lost Password</a>\n" +
    "    <br />\n" +
    "</div>\n"
  );


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
