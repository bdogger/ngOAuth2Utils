'use strict';

describe('Service: $tokenService', function () {

    // load the service's module
    beforeEach(module('ngOAuth2Utils'));

    // instantiate service
    var $tokenService, $localStorage;

    beforeEach(inject(function (_$tokenService_, _$localStorage_, oauthConfig) {
        oauthConfig.base64BasicKey = '123Key';
        oauthConfig.getAccessTokenUrl = 'http://localhost/oauth/token';
        oauthConfig.revokeTokenUrl = 'http://localhost/token';

        $tokenService = _$tokenService_;
        $localStorage = _$localStorage_;
    }));

    it('expects setToken() to set the token', function () {
        var token = '123';
        $tokenService.setToken(token);
        expect($localStorage.token).toBe(token);
    });

    it('expects getToken() to return the token', function () {
        var token = '123';
        $localStorage.token = token;
        expect($tokenService.getToken()).toEqual(token);
    });

    it('expects setExpiration() to set the expiration in milliseconds from now', function () {
        $tokenService.setExpiresIn(3600);
        var savedValue = $localStorage.expiresIn;
        expect(savedValue.valueOf()).toBeGreaterThan(new Date().valueOf());
        expect(savedValue.valueOf()).toBeLessThan(new Date(new Date().valueOf() + (3601 * 1000)).valueOf());
    });

    it('expects isValidToken() to be false when token is null', function () {
        $localStorage.token = null;
        expect($tokenService.isValidToken()).toBeFalsy();
    });

    it('expects isValidToken() to be false when token is expired', function () {
        $localStorage.token = '123';
        $localStorage.expiresIn = 0;
        expect($tokenService.isValidToken()).toBeFalsy();
    });

    it('expects isValidToken() to be true when the token is valid and not expired', function () {
        $localStorage.token = '123';
        $localStorage.expiresIn = new Date(new Date().valueOf() + 50000);
        expect($tokenService.isValidToken()).toBeTruthy();
    });

    it('expects setRefreshToken() to set the refreshToken', function () {
        var refreshToken = 'asdfasd';
        $tokenService.setRefreshToken(refreshToken);
        expect($localStorage.refreshToken = refreshToken);
    });

    it('expects getRefreshToken() to return the refreshToken', function () {
        var refreshToken = 'asdfasd';
        $localStorage.refreshToken = refreshToken;
        expect($tokenService.getRefreshToken()).toBe(refreshToken);
    });

    it('expects reset() to reset all information', function () {
        $tokenService.setToken(1);
        $tokenService.setRefreshToken(1);
        $tokenService.setExpiresIn(1);

        $tokenService.reset();

        expect($tokenService.getToken()).toBeNull();
        expect($tokenService.getRefreshToken()).toBeNull();
        expect($localStorage.expiresIn).toBeNull();
    });

    it('expects isValidAndExpiredToken() to return false when there is no token', function () {
        $tokenService.setToken(null);

        expect($tokenService.isValidAndExpiredToken()).toBeFalsy();
    });

    it('expects isValidAndExpiredToken() to return false when there is no refreshToken', function () {
        $tokenService.setToken('123');
        $tokenService.setRefreshToken(null);

        expect($tokenService.isValidAndExpiredToken()).toBeFalsy();
    });

    it('expects isValidAndExpiredToken() to return false when there is no expiresIn', function () {
        $tokenService.setToken('123');
        $tokenService.setRefreshToken('123');
        $localStorage.expiresIn = null;

        expect($tokenService.isValidAndExpiredToken()).toBeFalsy();
    });

    it('expects isValidAndExpiredToken() to return false when there is no expiresIn', function () {
        $tokenService.setToken('123');
        $tokenService.setRefreshToken('123');
        $tokenService.setExpiresIn(60);

        expect($tokenService.isValidAndExpiredToken()).toBeTruthy();
    });

});