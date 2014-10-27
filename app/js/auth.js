angular.module('app.auth', [])
    .run(function ($rootScope) {
      $rootScope.user = $rootScope.user || {};
      $rootScope.loggedIn = $rootScope.loggedIn || false;

      function loginSuccess (ev, user) {
        $rootScope.user = user;
        $rootScope.loggedIn = true;
      }

      function loginError (ev, reason) {
        $rootScope.user = {};
        $rootScope.loggedIn = false;
      }

      $rootScope.$on('auth:login-success', loginSuccess);
      $rootScope.$on('auth:login-error', loginError);
      $rootScope.$on('auth:validation-success', loginSuccess);
      $rootScope.$on('auth:validation-error', loginError);

      //auth:logout-success
      //auth:logout-error
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
