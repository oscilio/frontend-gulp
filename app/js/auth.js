angular.module('app.auth', [])
    .run(function ($rootScope) {
      $rootScope.user = $rootScope.user || {};
      $rootScope.loggedIn = $rootScope.loggedIn || false;

      function setLoggedOut () {
        $rootScope.user = {};
        $rootScope.loggedIn = false;
      }

      function loginSuccess (ev, user) {
        $rootScope.user = user;
        $rootScope.loggedIn = true;
      }

      function loginError (ev, reason) {
        setLoggedOut();
      }

      function logoutSuccess (ev) {
        setLoggedOut();
      }

      function logoutError (ev, reason) {
        console.log([ev, reason]);
      }

      $rootScope.$on('auth:login-success', loginSuccess);
      $rootScope.$on('auth:login-error', loginError);
      $rootScope.$on('auth:validation-success', loginSuccess);
      $rootScope.$on('auth:validation-error', loginError);
      $rootScope.$on('auth:logout-success', logoutSuccess);
      $rootScope.$on('auth:logout-error', logoutError);
      $rootScope.$on('auth:session-expired', function () { console.log('session expired'); });
      $rootScope.$on('auth:invalid', function () { console.log('invalid'); });

      //auth:registration-email-success
      //auth:registration-email-error
      //auth:email-confirmation-success
      //auth:email-confirmation-error
      //auth:password-reset-request-success
      //auth:password-reset-request-error
      //auth:password-reset-confirm-success
      //auth:password-reset-confirm-error
      //auth:password-change-success
      //auth:password-change-error
      //auth:account-update-success
      //auth:account-update-error
      //auth:account-destroy-success
      //auth:account-destroy-error
    });
