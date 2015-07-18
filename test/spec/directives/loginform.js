'use strict';

describe('Directive: loginForm', function () {

    // load the directive's module
    beforeEach(module('ngOAuth2Utils'));
    beforeEach(module('oauth2Templates/loginform.html'));

    var element,
        oauthConfig,
        scope;

    beforeEach(inject(function ($rootScope, _oauthConfig_) {
        oauthConfig = _oauthConfig_;
        scope = $rootScope.$new();
    }));

    it('should display the login form', inject(function ($compile) {
        element = angular.element('<login-form></login-form>');
        element = $compile(element)(scope);
        scope.$digest();
        expect(element.find('#username')).toBeDefined();
        expect(element.find('#password')).toBeDefined();
        expect(element.find('button')).toBeDefined();
        expect(element.find('button').attr('disabled')).toBe('disabled');
    }));

    it('should not display the error message if not set', inject(function ($compile) {
        element = angular.element('<login-form></login-form>');
        element = $compile(element)(scope);
        scope.$digest();
        expect(element.find('#login-error').length).toBe(0);
    }));

    it('should display the error message if present', inject(function ($compile) {
        scope.loginError = 'Error Logging In';
        element = angular.element('<login-form></login-form>');
        element = $compile(element)(scope);
        scope.$digest();
        expect(element.find('#login-error').text()).toBe('Error Logging In');
    }));
});
