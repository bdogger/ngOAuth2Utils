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
        expect(loginRoute.template).toBe('<login-form></login-form>');
    });

    it('expects /logout to route to logout page', function () {
        var logoutRoute = $route.routes['/logout'];
        expect(logoutRoute.controller).toBe('LogoutCtrl');
        expect(logoutRoute.template).toBe('<logout-message></logout-message>');
    });

    it('expects /access-denied to route to access-denied page', function () {
        expect($route.routes['/access-denied'].template).toBe('<access-denied-message></access-denied-message>');
    });

    it('expects /malformed-url to route to malformed-url page', function () {
        expect($route.routes['/malformed-url'].template).toBe('<malformed-url-message></malformed-url-message>');
    });

    it('expects /error to route to error page', function () {
        expect($route.routes['/error'].template).toBe('<error-message></error-message>');
    });

});
