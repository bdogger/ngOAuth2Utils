'use strict';

describe('Config: $route', function () {

    // load the service's module
    beforeEach(module('ngOAuth2Utils'));

    // instantiate service
    var $route;
    beforeEach(inject(function (_$route_) {
        $route = _$route_;
    }));

    it('expects /login to route to login page', function () {
        var loginRoute = $route.routes['/login'];
        expect(loginRoute.controller).toBe('LoginCtrl');
        expect(loginRoute.templateUrl).toBe('oauth2Templates/login.html');
    });

    it('expects /logout to route to logout page', function () {
        var logoutRoute = $route.routes['/logout'];
        expect(logoutRoute.controller).toBe('LogoutCtrl');
        expect(logoutRoute.template).toBe('<logout-message></logout-message>');
    });

});
