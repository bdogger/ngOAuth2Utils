'use strict';

angular.module('ngOAuth2Utils')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/forgot-password', {})
            .when('/unsecured', {})
            .when('/secured', {});
    });

describe('Config: Run Block', function () {

    beforeEach(module('ngOAuth2Utils'));

    var $location, $tokenService, $rootScope, $authenticationService;

    beforeEach(inject(function (_$location_, _$tokenService_, _$rootScope_, _$authenticationService_) {
        $rootScope = _$rootScope_;
        $authenticationService = _$authenticationService_;

        $tokenService = _$tokenService_;
        $location = _$location_;
    }));

    it('should redirect to login when not authenticated and secured path is called', function () {
        spyOn($authenticationService, 'allowAnonymous').andReturn(false);
        spyOn($tokenService, 'isValidToken').andReturn(false);

        $location.path('/secured');

        $rootScope.$broadcast('$routeChangeStart', {originalPath: '/secured'});
        $rootScope.$digest();

        expect($location.path()).toBe('/login');
        expect($authenticationService.allowAnonymous).toHaveBeenCalledWith('/secured');
        expect($tokenService.isValidToken).toHaveBeenCalled();
    });

    it('should redirect to target path when it is an unsecured path', function () {
        spyOn($authenticationService, 'allowAnonymous').andReturn(true);

        $location.path('/unsecured');

        $rootScope.$broadcast('$routeChangeStart', {originalPath: '/unsecured'});
        $rootScope.$digest();

        expect($location.path()).toBe('/unsecured');
        expect($authenticationService.allowAnonymous).toHaveBeenCalledWith('/unsecured');
    });

    it('should redirect to target path when it is a secured path and valid token', function () {
        spyOn($authenticationService, 'allowAnonymous').andReturn(false);
        spyOn($tokenService, 'isValidToken').andReturn(true);

        $location.path('/secured');

        $rootScope.$broadcast('$routeChangeStart', {originalPath: '/secured'});
        $rootScope.$digest();

        expect($location.path()).toBe('/secured');
        expect($authenticationService.allowAnonymous).toHaveBeenCalledWith('/secured');
        expect($tokenService.isValidToken).toHaveBeenCalled();
    });

});