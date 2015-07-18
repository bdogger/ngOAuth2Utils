'use strict';

describe('Service: $authenticationService', function () {

    // load the service's module
    beforeEach(module('ngOAuth2Utils'));

    // instantiate service
    var $authenticationService, $httpBackend, $tokenService, oauthConfig;

    beforeEach(inject(function (_$httpBackend_, _$authenticationService_, _$tokenService_, _oauthConfig_) {
        oauthConfig = _oauthConfig_;
        oauthConfig.base64BasicKey = '123Key';
        oauthConfig.getAccessTokenUrl = 'http://localhost/oauth/token';
        oauthConfig.revokeTokenUrl = 'http://localhost/token';

        $httpBackend = _$httpBackend_;
        $authenticationService = _$authenticationService_;
        $tokenService = _$tokenService_;
    }));

    it('expects login() to call the authentication url with valid credentials', function () {
        $httpBackend.expectPOST(
            'http://localhost/oauth/token',
            {
                'grant_type': 'password',
                'password': 'password',
                'username': 'user'
            },
            {
                Authorization: 'Basic 123Key',
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            })
            .respond({
                'access_token': '123',
                'refresh_token': '456',
                'expires_in': 40,
                'token_type': 'bearer'
            });

        $authenticationService.login('user', 'password');

        $httpBackend.flush();

        expect($tokenService.getToken()).toEqual('123');
        expect($tokenService.isValidToken()).toBeTruthy();
    });

    it('expects login() to call the authentication url with invalid credentials', function () {
        $httpBackend.expectGET(
            'http://localhost/oauth/token?grant_type=password&password=password&username=user',
            {
                'Authorization': 'Basic 123Key'
            })
            .respond(400, {'error_description': 'Invalid Credentials'});

        $authenticationService.login('user', 'password');

        expect($tokenService.isValidToken()).toBeFalsy();
    });

    it('expects refresh() to refresh the token', function () {
        $tokenService.setRefreshToken('123');
        $httpBackend.expectPOST(
            'http://localhost/oauth/token',
            {'grant_type': 'refresh_token', 'refresh_token': '123'},
            {
                'Authorization': 'Basic 123Key',
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            }
        )
            .respond({
                'access_token': '123',
                'refresh_token': '456',
                'expires_in': 40,
                'token_type': 'bearer'
            });

        $authenticationService.refresh();

        $httpBackend.flush();

        expect($tokenService.getToken()).toEqual('123');
        expect($tokenService.isValidToken()).toBeTruthy();
    });

    it('expects logout() to revoke the token', function () {
        $tokenService.setToken('123');

        $httpBackend.expectDELETE(
            'http://localhost/token',
            {
                'Authorization': 'Bearer 123',
                'Accept': 'application/json, text/plain, */*'
            }
        )
            .respond({
                'logoutSuccess': 'true'
            });

        $authenticationService.logout();

        $httpBackend.flush();

        expect($tokenService.isValidToken()).toBeFalsy();
    });

    it('expects allowAnonymous() to return true for forgotPasswordURL', function () {
        oauthConfig.forgotPasswordURL = '/forgot-password';

        expect($authenticationService.allowAnonymous('/forgot-password')).toBeTruthy();
    });

    it('expects allowAnonymous() to return true for unsecured paths', function () {
        oauthConfig.unsecuredPaths.push('/foobar');

        expect($authenticationService.allowAnonymous('/foobar')).toBeTruthy();
    });

    it('expects allowAnonymous() to ignore additional path variables', function () {
        oauthConfig.unsecuredPaths.push('/foobar');

        expect($authenticationService.allowAnonymous('/foobar/123/123')).toBeTruthy();
    });

    it('expects allowAnonymous() to ignore additional parameters', function () {
        oauthConfig.unsecuredPaths.push('/foobar');

        expect($authenticationService.allowAnonymous('/foobar?foo=bar')).toBeTruthy();
    });

    it('expects allowAnonymous() to return false for all other urls', function () {
        expect($authenticationService.allowAnonymous('/secured-only')).toBeFalsy();
    });
});