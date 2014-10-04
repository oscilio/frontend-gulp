app.controller('HomeCtrl', function($scope, $location, AuthenticationService) {
  $scope.title = "Home";
  $scope.message = "Try mousing over elements to see a directive at work";

  var onLogoutSuccess = function(response) {
    alert(response.message);
    $location.path('/login');
  };

  $scope.logout = function() {
    AuthenticationService.logout().success(onLogoutSuccess);
  };
});

app.controller("ExploreCtrl", function($scope, $location, AuthenticationService) {
  $scope.sounds = [
    {
      id: '1',
      user: {
        username: 'dcunit3d'
      },
      title: 'New 808 Drumkit Config',
      post: 'Sick new #drumkit using the classic $Roland808, cant fake that sound #electrofunk',
      soundbyteUrl: ''
    },
    {
      id: '2',
      user: {
        username: 'Edit'
      },
      title: 'Nu Glitch Sound',
      post: 'Just posted this $Massive #nuGlitch byte, check it out @kraddy',
      soundbyteUrl: ''
    },
    {
      id: '3',
      user: {
        username: 'kraddy'
      },
      title: '2014 Tour Byte',
      post: 'Check out our #NewSound from the @GlitchMob show in #NYC!',
      soundbyteUrl: ''
    },
    {
      id: '4',
      user: {
        username: 'ooah'
      },
      title: 'New Bass Kick',
      //http://www.powerdrumkit.com/download.htm
      post: 'Sick new #Bass #Kick using the $MTPowerDrumKit2 #Free #VST',
      soundbyteUrl: ''
    }
  ];


});

app.controller("NavbarCtrl", function($scope, $location, $modal, AuthenticationService, Session, RegistrationService) {

  $scope.isActive = function(viewLocation) {
    return viewLocation === $location.path();
  };

  //TODO: bind to remove function? (currentUser & loggedIn)
  if ($scope.currentUser === undefined) {
    //TODO: get the rest of the session attributes
    $scope.currentUser = Session.email;
  }
  $scope.loggedIn = AuthenticationService.isAuthenticated();

  //TODO: refactor to SignupBtnCtrl, but $scope.signup is not passed when i do this
  $scope.signup = { username: '', email: '', password: '', passwordConfirmation: '' };
  $scope.signupAlerts = [];

  $scope.openSignupModal = function() {

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
      RegistrationService.signup(signup,
          function(res) {
            //TODO: show alert somewhere .. or another modal?
            alert('great success');
          },
          function(res) {
            //TODO: gotta be a better way to handle these errors
            $scope.signupAlerts = _.flatten(
                _.map(res.errors, function(v,k) {
                  return _.map(v, function(msg) {
                    return { type: "error",
                      msg: k + " " + msg };
                  });
                }));

            $scope.openSignupModal();
            //TODO: signup error callback:
          });
    }, function (message) {
      //TODO: cancel function
    });

  };

  //TODO: refactor to LoginBtnCtrl, but $scope.creds is not passed when i do this
  $scope.creds  = { email: '', password: '' , remember_me: false};
  $scope.loginAlerts = [];
  $scope.openLoginModal = function() {

    var modalInstance = $modal.open({
      templateUrl: 'modals/login-modal.html',
      controller: 'LoginModalCtrl',
      resolve: {
        creds: function() {
          return $scope.creds;
        }
      }
    });

    modalInstance.result.then(function (creds) {
      $scope.loginAlerts = [];
      AuthenticationService.login(creds,
          function(res) {
            $scope.currentUser = Session.email;
            $scope.loggedIn = AuthenticationService.isAuthenticated();
          },
          function(res) {
            $scope.loginAlerts.push({ type: "error", msg: res.error });
            $scope.openLoginModal();
          });
    });
  };
});

app.controller("SignupModalCtrl", function($scope, $modalInstance, signup, RegistrationService) {
  //TODO: fix white at bottom of modal bc of form

  $scope.ok = function() {
    //TODO: client-side validation
    $modalInstance.close(signup);
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});

app.controller("LoginCtrl", function($scope, $modalInstance, creds, AuthenticationService, Users) {

});

app.controller("LoginModalCtrl", function($scope, $modalInstance, creds, AuthenticationService, Users) {
  //TODO: fix white at bottom of modal bc of form

  //TODO: consolidate and use same controller for modal & page?
  $scope.ok = function() {
    //TODO: client-side validation
    $modalInstance.close(creds);
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});

app.controller('FooCtrl', function($scope, $location, AuthenticationService) {

});

app.controller('UsersCtrl', function($scope, Users) {
  $scope.users = Users.query();
});
