'use strict';

describe('Service: $tokenService', function () {

    // load the service's module
    beforeEach(module('ngOAuth2Utils'));

    // instantiate service
    var $tokenService, storageService;

    beforeEach(inject(function (_$tokenService_, _storageService_, oauthConfig) {
        oauthConfig.base64BasicKey = '123Key';
        oauthConfig.getAccessTokenUrl = 'http://localhost/oauth/token';
        oauthConfig.revokeTokenUrl = 'http://localhost/token';
        oauthConfig.storageType = 'session';

        $tokenService = _$tokenService_;
        storageService = _storageService_;
    }));

    it('expects setToken() to set the token', function () {
        var token = '123';
        $tokenService.setToken(token);
        expect(storageService.getStorage().token).toBe(token);
    });

    it('expects getToken() to return the token', function () {
        var token = '123';
        storageService.getStorage().token = token;
        expect($tokenService.getToken()).toEqual(token);
    });

    it('expects setExpiration() to set the expiration in milliseconds from now', function () {
        $tokenService.setExpiresIn(3600);
        var savedValue = storageService.getStorage().expiresIn;
        expect(savedValue.valueOf()).toBeGreaterThan(new Date().valueOf());
        expect(savedValue.valueOf()).toBeLessThan(new Date(new Date().valueOf() + (3601 * 1000)).valueOf());
    });

    it('expects isValidToken() to be false when token is null', function () {
        storageService.getStorage().token = null;
        expect($tokenService.isValidToken()).toBeFalsy();
    });

    it('expects isValidToken() to be false when token is expired', function () {
        storageService.getStorage().token = '123';
        storageService.getStorage().expiresIn = 0;
        expect($tokenService.isValidToken()).toBeFalsy();
    });

    it('expects isValidToken() to be true when the token is valid and not expired', function () {
        storageService.getStorage().token = '123';
        storageService.getStorage().expiresIn = new Date(new Date().valueOf() + 50000);
        expect($tokenService.isValidToken()).toBeTruthy();
    });

    it('expects setRefreshToken() to set the refreshToken', function () {
        var refreshToken = 'asdfasd';
        $tokenService.setRefreshToken(refreshToken);
        expect(storageService.getStorage().refreshToken = refreshToken);
    });

    it('expects getRefreshToken() to return the refreshToken', function () {
        var refreshToken = 'asdfasd';
        storageService.getStorage().refreshToken = refreshToken;
        expect($tokenService.getRefreshToken()).toBe(refreshToken);
    });

    it('expects reset() to reset all information', function () {
        $tokenService.setToken(1);
        $tokenService.setRefreshToken(1);
        $tokenService.setExpiresIn(1);

        $tokenService.reset();

        expect($tokenService.getToken()).toBeNull();
        expect($tokenService.getRefreshToken()).toBeNull();
        expect(storageService.getStorage().expiresIn).toBeNull();
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
        storageService.getStorage().expiresIn = null;

        expect($tokenService.isValidAndExpiredToken()).toBeFalsy();
    });

    it('expects isValidAndExpiredToken() to return false when there is no expiresIn', function () {
        $tokenService.setToken('123');
        $tokenService.setRefreshToken('123');
        $tokenService.setExpiresIn(60);

        expect($tokenService.isValidAndExpiredToken()).toBeTruthy();
    });

});