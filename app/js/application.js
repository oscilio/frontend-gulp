var app = angular.module("app",
    ['ngRoute',
      'ngCookies',
      'ngResource',
      'firebase',
      'ui.bootstrap',
      'ui.router',
      'angulartics',
      'angulartics.google.analytics'])

    .config(function($stateProvider,
                     $locationProvider,
                     $urlRouterProvider) {

      'use strict';

      // states: unauthenticated
      // home - / - prompt to signup
      // features - /features - overview of product
      // explore - /explore - top patches and trending vsts
      // blog - /blog - blog posts

      // states: authenticated
      // home - / - dashboard
      // profile - /:username
      // account - /account

      // TODO: enable pushstate (fix heroku lineman build pack)
      // $locationProvider.html5Mode(true);

      $urlRouterProvider.otherwise('/home');

      $stateProvider
          .state('home', {
            url: "/home",
            templateUrl: "home.html",
            controller: 'HomeCtrl'
          })

          .state('explore', {
            url: "/explore",
            templateUrl: "explore.html",
            controller: 'ExploreCtrl'
          })

          .state('error', {
            url: "/error",
            templateUrl: "error.html",
            controller: 'HomeCtrl'
          })

        //TODO: redirect unauthenticated routes to a login page,
        // - but when trying to redirect to unauthenticated /users to /login,
        //   - the users template still renders
        // - routing to /home for now

//            .state('login', {
//                url: 'login',
//                templateUrl: 'login.html',
//                controller: 'LoginCtrl'
//            })

        // authenticated routes
        // TODO: /pulses - your newsfeeds
        // TODO: /pulses/:id - a newsfeed
        // TODO: /followers
        // TODO: /following
        // TODO: /top/tags
        // TODO: /top/instruments
        // TODO: /top/artist
        // TODO: /top/genres
        // TODO: /top/instruments
        // TODO: /users/:id

          .state('users', {
            url: "/users",
            templateUrl: "users/index.html",
            controller: "UsersIndexCtrl"
          })

          .state('foo', {
            url: "/foo",
            templateUrl: "foo.html",
            controller: "FooCtrl"
          })

          .state('bar', {
            url: '/bar',
            templateUrl: 'foo/bar.html',
            controller: 'FooCtrl'
          })

          .state('baz', {
            url: '/baz',
            templateUrl: 'foo/baz.html',
            controller: 'FooCtrl'
          });

    })

    .config(function($locationProvider, $httpProvider){
      $httpProvider.responseInterceptors.push('httpInterceptor');

      // if (angular.element('meta[name=csrf-token]'))
      // {
      //   $httpProvider.defaults.headers.common['X-CSRF-Token'] = angular.element('meta[name=csrf-token]').attr('content');
      // }

      //TODO: fix http interceptor, success/error functions seem to be overriding other callbacks
      //   var interceptor = function($location, $rootScope, $q) {
      //     function success(response) {
      //       return response;
      //     }

      //     function error(response) {
      //       if (response.status === 401) {
      //         $rootScope.$broadcast('event:unauthorized');
      //         $location.path('/users/login');
      //         return response;
      //       }
      //       return $q.reject(response);
      //     }

      //     return function(promise) {
      //       return promise.then(success, error);
      //     };
      //   };
      //   $httpProvider.responseInterceptors.push(interceptor);
    })

    .constant('CONF', {
      apiUrl: '<%= api_url %>',
      firebaseApp: '<%= firebase_app %>'
    })

    .constant('AUTH_EVENTS', {
      loginSuccess: 'auth-login-success',
      loginFailed: 'auth-login-failed',
      logoutSuccess: 'auth-logout-success',
      sessionTimeout: 'auth-session-timeout',
      notAuthenticated: 'auth-not-authenticated',
      notAuthorized: 'auth-not-authorized'
    })

    .constant('USER_ROLES', {
      all: '*',
      admin: 'admin',
      guest: 'guest'
    })

    .run(function($rootScope, $location, AuthenticationService, Session, $cookies) {

      //==================
      // debugging
      //==================

      $rootScope.log = function(thing) {
        console.log(thing);
      };

      $rootScope.alert = function(thing) {
        alert(thing);
      };

      //==================
      // authentication
      //==================
      var routesThatDontRequireAuth = ['/login', '/home', '/about', '/explore', '/error'];

      // check if current location matches route
      var routeClean = function (route) {
        return _.find(routesThatDontRequireAuth,
            function (noAuthRoute) {
              return _.str.startsWith(route, noAuthRoute);
            });
      };

      $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
        // if route requires auth and user is not logged in
        if (!routeClean($location.url()) && !AuthenticationService.isAuthenticated()) {
          // redirect back to login
          ev.preventDefault();
          $location.path('/home');
        }

      });

    });
