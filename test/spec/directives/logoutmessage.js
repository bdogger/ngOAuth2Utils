'use strict';

describe('Directive: logoutMessage', function () {

    // load the directive's module
    beforeEach(module('ngOAuth2Utils'));
    beforeEach(module('oauth2Templates/logout.html'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should display the logout message', inject(function ($compile) {
        element = angular.element('<logout-message></logout-message>');
        element = $compile(element)(scope);
        scope.$digest();
        expect(element.text()).toContain('You have successfully logged out.');
    }));
});
