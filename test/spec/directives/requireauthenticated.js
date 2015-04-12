'use strict';

describe('Directive: requireAuthenticated', function () {

    // load the directive's module
    beforeEach(module('ngOAuth2Utils'));

    var element,
        $tokenService,
        scope;

    beforeEach(inject(function ($rootScope, _$tokenService_) {
        scope = $rootScope.$new();
        $tokenService = _$tokenService_;
    }));

    it('should not be displayed when unauthenticated', inject(function ($compile) {
        spyOn($tokenService, 'isValidToken').andReturn(false);
        element = angular.element('<div require-authenticated></div>');
        element = $compile(element)(scope);
        scope.$digest();
        expect(element.hasClass('hidden')).toBeTruthy();
        expect($tokenService.isValidToken).toHaveBeenCalled();
    }));

    it('should be displayed when authenticated', inject(function ($compile) {
        spyOn($tokenService, 'isValidToken').andReturn(true);
        element = angular.element('<div require-authenticated></div>');
        element = $compile(element)(scope);
        scope.$digest();
        expect(element.hasClass('hidden')).toBeFalsy();
        expect($tokenService.isValidToken).toHaveBeenCalled();
    }));
});
