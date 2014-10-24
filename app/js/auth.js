angular.module('app.auth', [])
    .run(function ($rootScope) {
      function loginSuccess (ev, user) {
        console.log(ev);
        console.log(user);
        console.log(user.email);
        console.log(user.username);
      }

      function loginError (ev, reason) {
        console.log(ev);
        console.log(reason);
        console.log(reason.errors[0]);
      }

      $rootScope.$on('auth:login-success', loginSuccess);
      $rootScope.$on('auth:login-error', loginError);

      //auth:validation-success
      //auth:validation-error
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
