describe('\'app.router\' module', function () {
    'use strict';
    var routeProvider;

    beforeEach(function () {
        module('ngRoute', function ($routeProvider) {
            routeProvider = $routeProvider;
            spyOn(routeProvider, 'when').and.callThrough();
            spyOn(routeProvider, 'otherwise').and.callThrough();
        });
        module('app.router');
    });

    // This is necessary to trigger loading the modules above; use it to inject services once they are needed
    beforeEach(inject());

    it('defines a route for the welcome dialog', function () {
        expect(routeProvider.when).toHaveBeenCalledWith('/home', { templateUrl : 'assets/home/home.html' });
    });

    it('defines the default route redirecting to the welcome dialog', function () {
        expect(routeProvider.when).toHaveBeenCalledWith('/', { redirectTo : '/home' });
    });

    it('defines the default route redirecting to the welcome dialog', function () {
        expect(routeProvider.otherwise).toHaveBeenCalledWith({templateUrl: 'assets/page-not-found/page-not-found.html'});
    });
});
