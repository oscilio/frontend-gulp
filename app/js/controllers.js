angular.module('app')
    .controller('HomeCtrl', function ($scope, $location) {
      $scope.title = "Home";
      $scope.message = "Try mousing over elements to see a directive at work";

      var onLogoutSuccess = function (response) {
        alert(response.message);
        $location.path('/login');
      };

      $scope.logout = function () {
        //TODO: replace
      };
    })

    .controller("ExploreCtrl", function ($scope, $location, Sounds) {
      $scope.sounds = Sounds.queryTopSounds();
    })

    .controller("NavbarCtrl", function ($scope, $location, $modal, $auth) {
      //TODO: replace loggedIn with function based on currentUser
      $scope.currentUser = $scope.currentUser || null;
      $scope.loggedIn = $scope.loggedIn || null;

      function loginSuccess (ev, user) {
        $scope.currentUser = user.email;
        $scope.loggedIn = true;
      }

      function loginError (ev, reason) {
        $scope.currentUser = null;
        $scope.currentUser = false;
      }

      $scope.$on('auth:login-success', loginSuccess);
      $scope.$on('auth:login-error', loginError);
      $scope.$on('auth:validation-success', loginSuccess);
      $scope.$on('auth:validation-error', loginError);

      $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
      };

      //TODO: refactor to SignupBtnCtrl, but $scope.signup is not passed when i do this
      $scope.signup = {username: '', email: '', password: '', passwordConfirmation: ''};
      $scope.signupAlerts = [];

      $scope.openSignupModal = function () {

        var modalInstance = $modal.open({
          templateUrl: 'modals/signup-modal.html',
          controller: 'SignupModalCtrl',
          resolve: {
            signup: function () {
              return $scope.signup;
            }
          }
        });

        modalInstance.result.then(function (signup) {
          $scope.signupAlerts = [];
          $auth.submitRegistration({
            email: signup.email,
            username: signup.username,
            password: signup.password,
            password_confirmation: signup.passwordConfirmation
          })
              .then(function (res) {
                $scope.signupAlerts = [];
              })
              .catch(function (res) {
                console.log(res);
                if (res.status == 401 || res.status == 403) {
                  $scope.signupAlerts = _.flatten(
                      _.map(res.data.errors, function (v, k) {
                        return _.map(v, function (msg) {
                          return {type: "error", msg: k + " " + msg};
                        });
                      }));
                }
                $scope.openSignupModal();
              });
        }, function (message) {
          //TODO: cancel function
        });

      };

      $scope.creds = {email: '', password: '', remember_me: false};
      $scope.loginAlerts = [];
      $scope.openLoginModal = function () {

        var modalInstance = $modal.open({
          templateUrl: 'modals/login-modal.html',
          controller: 'LoginModalCtrl',
          resolve: {
            creds: function () {
              return $scope.creds;
            }
          }
        });

        modalInstance.result.then(function (creds) {
          $scope.loginAlerts = [];
          $auth.submitLogin(creds)
              .then(function (res) {
                $scope.loginAlerts = [];
                console.log(res);
              })
              .catch(function (res) {
                console.log(res);
                $scope.loginAlerts = _.map(res.errors, function (e) {
                  return {type: 'error', msg: e};
                });
                $scope.openLoginModal();
              });
        });
      };
    })

    .controller("SignupModalCtrl", function ($scope, $modalInstance, $auth, signup) {
      $scope.ok = function () {
        $modalInstance.close(signup);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

      $scope.authWith = function (provider) {
        $auth.authenticate(provider)
            .then(function (res) {
              $modalInstance.dismiss('cancel');
            })
            .catch(function (res) {
              console.log(res);
            });
      };
    })

    .controller("LoginModalCtrl", function ($scope, $modalInstance, $auth, creds) {
      $scope.ok = function () {
        $modalInstance.close(creds);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

      $scope.authWith = function (provider) {
        $auth.authenticate(provider)
            .then(function (res) {
              $modalInstance.dismiss('cancel');
            })
            .catch(function (res) {
              console.log(res);
            });
      };
    })

    .controller('UsersCtrl', function ($scope, Users) {
      $scope.users = Users.query();
    });
