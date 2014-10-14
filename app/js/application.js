angular.module('app',
    ['ngRoute',
      'ngCookies',
      'ngResource',
      'restangular',
      'ui.bootstrap',
      'ui.router',
      'ng-token-auth',
      'angulartics',
      'angulartics.google.analytics'])

    .config(function ($stateProvider,
                      $locationProvider,
                      $urlRouterProvider) {

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
            controller: "UsersIndexCtrl"
          });

    })

    .config(function($authProvider) {
      $authProvider.configure({
        apiUrl: 'http://api.example.com'
      });
    })

    .constant('CFG', {
      apiUrl: '<%= api_url %>'
    })

    .constant('USER_ROLES', {
      all: '*',
      admin: 'admin',
      guest: 'guest'
    })

    .run(function ($rootScope, $location) {

    });
