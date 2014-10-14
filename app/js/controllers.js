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

    .controller("ExploreCtrl", function ($scope, $location) {
      $scope.sounds = [
        {
          id: '1',
          user: {
            username: 'dcunit3d'
          },
          title: 'New 808 Drumkit Config',
          post: 'Sick new #drumkit using the classic $Roland808, cant fake that sound #electrofunk',
          soundbyteUrl: '/sounds/crystalmethod.mp3',
          configFiles: true
        },
        {
          id: '2',
          user: {
            username: 'Edit'
          },
          title: 'Nu Glitch Sound',
          post: 'Just posted this $Massive #nuGlitch byte, check it out @kraddy',
          soundbyteUrl: '/sounds/artsyremix.mp3',
          configFiles: true
        },
        {
          id: '3',
          user: {
            username: 'kraddy'
          },
          title: '2014 Tour Byte',
          post: 'Check out our #NewSound from the @GlitchMob show in #NYC!',
          soundbyteUrl: '/sounds/androidporn.mp3',
          configFiles: false
        },
        {
          id: '4',
          user: {
            username: 'ooah'
          },
          title: 'New Bass Kick',
          //http://www.powerdrumkit.com/download.htm
          post: 'Sick new #Bass #Kick using the $MTPowerDrumKit2 #Free #VST',
          soundbyteUrl: '/sounds/hacksaw.mp3',
          configFiles: true
        },
        {
          id: '5',
          user: {
            username: 'djshadow'
          },
          title: 'New Gravediggin Mix Preview Byte',
          post: "Y'all won't believe the record I just dug up from the #graveyard #gravediggin $vinyl",
          soundbyteUrl: '/sounds/djshadow.mp3',
          configFiles: false
        },
        {
          id: '6',
          user: {
            username: 'egyptianlover'
          },
          title: "Guess who's back y'all?",
          post: "Check out a #NewByte of my upcoming album, #PlatinumPyramids.  And yes -- still 100% true to da $808!",
          soundbyteUrl: '/sounds/egyptegypt.mp3',
          configFiles: false
        },
        {
          id: '7',
          user: {
            username: 'urbansage'
          },
          title: "Words of Wisdom",
          post: "Give this #byte a listen, part of a new track I got a new track coming on Friday!",
          soundbyteUrl: '/sounds/imtechnique.mp3',
          configFiles: true
        }
      ];
    })

    .controller("NavbarCtrl", function ($scope, $location, $modal, $auth) {

      $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
      };

      //TODO: replace $scope.currentUser and $scope.loggedIn
      $scope.currentUser = null;
      $scope.loggedIn = false;

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
          $auth.submitRegistration(signup)
              .then(function(res) {
                $scope.signupAlerts = [];
                alert('great success');
              })
              .catch(function(res) {
                console.log(res);
                if (res.status == 403) {
                  $scope.signupAlerts = _.flatten(
                    _.map(res.data.errors, function (v, k) {
                      return _.map(v, function (msg) {
                        return { type: "error", msg: k + " " + msg };
                      });
                    }));
                }
                console.log($scope.signupAlerts);
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
              .then(function(res) {
                $scope.currentUser = 'fdsa@fdsa.com';
                $scope.loggedIn = true;
                $scope.loginAlerts = [];
                console.log(res);
              })
              .catch(function(res) {
                $scope.currentUser = null;
                $scope.loggedIn = false;
                $scope.loginAlerts = _.map(res.errors, function(e) {
                  return {type: 'error', msg: e};
                });
                $scope.openLoginModal();
              });
        });
      };
    })

    .controller("SignupModalCtrl", function ($scope, $modalInstance, signup) {
      //TODO: fix white at bottom of modal bc of form

      $scope.ok = function () {
        //TODO: client-side validation
        $modalInstance.close(signup);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    })

    .controller("LoginModalCtrl", function ($scope, $modalInstance, creds, Users) {
      //TODO: fix white at bottom of modal bc of form

      //TODO: consolidate and use same controller for modal & page?
      $scope.ok = function () {
        //TODO: client-side validation
        $modalInstance.close(creds);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    })

    .controller('UsersCtrl', function ($scope, Users) {
      $scope.users = Users.query();
    });
