angular.module('app',
    ['ngRoute',
      'ngCookies',
      'ngResource',
      'restangular',
      'ui.bootstrap',
      'ui.router',
      'ng-token-auth',
      'app.auth',
      'ui.gravatar',
      'angulartics',
      'angulartics.google.analytics'])

    .config(function ($stateProvider, $locationProvider, $urlRouterProvider, gravatarServiceProvider) {

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

      function authRoute($auth) {
        return $auth.validateUser();
      }

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

        //TODO: redirect unauthenticated routes to the home state, then open the login modal

        // authenticated routes
        // TODO: /pulses - your newsfeeds
        // TODO: /pulses/:id - a newsfeed
        // TODO: /followers
        // TODO: /following
        // TODO: /top/tags
        // TODO: /top/instruments
        // TODO: /top/artist
        // TODO: /top/genres
        // TODO: /users/:id

          .state('users', {
            url: "/users",
            templateUrl: "users/index.html",
            controller: "UsersCtrl",
            resolve: {
              auth: authRoute
            }
          });

      gravatarServiceProvider.defaults = {
        size: 100,
        default: 'retro'
      };
    })

    .constant('ENV', {
      apiUrl: '<%= api_protocol %>://<%= api_url %>'
    })

    .config(function($authProvider, ENV) {
      $authProvider.configure({
        apiUrl: ENV.apiUrl,
        validateOnPageLoad: true,
        authProviderPaths: {
          google_oauth2: '/auth/google_oauth2'
        }
      });
    })

    .constant('USER_ROLES', {
      all: '*',
      admin: 'admin',
      guest: 'guest'
    })

    .run(function ($rootScope, $location) {

    });