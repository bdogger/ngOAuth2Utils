'use strict';

describe('Service: $authenticationService', function () {

    // load the service's module
    beforeEach(module('ngOAuth2Utils'));

    // instantiate service
    var $authenticationService, $httpBackend, $tokenService;

    beforeEach(inject(function (_$httpBackend_, _$authenticationService_, _$tokenService_, oauthConfig) {
        oauthConfig.base64BasicKey = '123Key';
        oauthConfig.getAccessTokenUrl = 'http://localhost/oauth/token';
        oauthConfig.revokeTokenUrl = 'http://localhost/token';

        $httpBackend = _$httpBackend_;
        $authenticationService = _$authenticationService_;
        $tokenService = _$tokenService_;
    }));

    it('expects login() to call the authentication url with valid credentials', function () {
        $httpBackend.expectGET(
            'http://localhost/oauth/token?grant_type=password&password=password&username=user',
            {
                Authorization: 'Basic 123Key',
                Accept: 'application/json, text/plain, */*'
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
        $httpBackend.expectGET(
            'http://localhost/oauth/token?grant_type=refresh_token&refresh_token=123',
            {
                'Authorization': 'Basic 123Key',
                'Accept': 'application/json, text/plain, */*'
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

});