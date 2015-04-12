'use strict';

describe('Service: storageService', function () {

    // load the service's module
    beforeEach(module('ngOAuth2Utils'));

    // instantiate service
    var storageService, $sessionStorage, $localStorage, oauthConfig;
    beforeEach(inject(function (_$sessionStorage_, _$localStorage_, _oauthConfig_, _storageService_) {
        $sessionStorage = _$sessionStorage_;
        $localStorage = _$localStorage_;
        oauthConfig = _oauthConfig_;
        storageService = _storageService_;
    }));

    it('expects getStorage() to return $sessionStorage as default', function () {
       expect(storageService.getStorage()).toBe($sessionStorage);
    });

    it('expects getStorage() to return $sessionStorage when storageType is set to "session"', function () {
        oauthConfig.storageType = 'session';
        expect(storageService.getStorage()).toBe($sessionStorage);
    });

    it('expects getStorage() to return $sessionStorage when storageType is set to "local"', function () {
        oauthConfig.storageType = 'local';
        expect(storageService.getStorage()).toBe($localStorage);
    });

});
