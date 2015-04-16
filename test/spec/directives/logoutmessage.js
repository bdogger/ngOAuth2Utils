'use strict';

describe('Directive: logoutMessage', function () {

    // load the directive's module
    beforeEach(module('ngOAuth2Utils'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should display the logout message', inject(function ($compile) {
        element = angular.element('<logout-message></logout-message>');
        element = $compile(element)(scope);
        expect(element.text()).toBe('You have successfully logged out.');
    }));
});
