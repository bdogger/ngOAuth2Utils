'use strict';

describe('Controller: LogoutCtrl', function () {

    beforeEach(module('ngOAuth2Utils'));

    var LogoutCtrl,
        scope,
        $authenticationService,
        storageService,
        $timeout,
        storage,
        oauthConfig,
        $tokenService;

    beforeEach(inject(function ($controller, $rootScope, $q, _$tokenService_, _$timeout_, _oauthConfig_) {
        scope = $rootScope.$new();
        oauthConfig = _oauthConfig_;
        oauthConfig.logoutSuccessMessage = 'logoutSuccess';
        $authenticationService = jasmine.createSpyObj('$authenticationService', ['logout']);
        storageService = jasmine.createSpyObj('storageService', ['getStorage']);
        storage = jasmine.createSpyObj('storage', ['$reset']);
        $tokenService = _$tokenService_;

        $authenticationService.logout.andReturn($q.when({
            data: {
                logoutSuccess: 'true'
            }
        }));

        storageService.getStorage.andReturn(storage);
        storage.$reset.andReturn({});

        $timeout = _$timeout_;

        LogoutCtrl = $controller('LogoutCtrl', {
            $scope: scope,
            $authenticationService: $authenticationService,
            storageService: storageService,
            oauthConfig: oauthConfig
        });
    }));

    it('should call the authentication service to logout', function () {
        $timeout.flush();
        expect($tokenService.isValidToken()).toBeFalsy();
        expect(scope.logoutSuccess).toBeTruthy();
        expect(storageService.getStorage).toHaveBeenCalled();
        expect(storage.$reset).toHaveBeenCalled();
    });
});
