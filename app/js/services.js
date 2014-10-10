function EnvService (CFG) {
  var EnvService = {};

  EnvService.apiUrl = '//' + CFG.apiUrl + '/'
  EnvService.fbaseUrl = 'https://' + CFG.firebaseApp + '.firebaseio.com';

  return EnvService;
}

angular.module('app').service('EnvService', EnvService);

// wait wtf, FB simple login is deprecated as of 10/3/14? wtf?

//function AuthService($q, $firebase,

//function AuthService ($q, $firebase, $firebaseSimpleLogin, EnvService, Restangular) {
//
//  //TODO: setup an onAuth callback?
//  //TODO: setup oauth
//  var AuthService = {},
//      furl = EnvService.fbaseUrl,
//      fref = new Firebase(EnvService.fbaseUrl),
//      fbaseSimpleLogin = $firebaseSimpleLogin(fref),
//      usersUrl = furl + '/users',
//      usersRef = $firebase(new Firebase(usersUrl));
//
//  AuthService.getCurrentUser = function () {
//    var deferred = $q.defer();
//
//    fbaseSimpleLogin.$getCurrentUser().then(deferred.resolve, deferred.reject);
//    deferred.promise.then(function (currentUser) {
//      if (currentUser) {
//        Restangular.setDefaultHeaders({"Authorization": currentUser.firebaseAuthToken});
//      }
//    });
//
//    return deferred.promise;
//  };
//
//  AuthService.get = function () {
//    var deferred = $q.defer();
//
//    AuthService.getCurrentUser().then(function (currentUser) {
//      deferred.resolve(currentUser ? $firebase(new Firebase(usersUrl + '/' + currentUser.id)) : null);
//    }, deferred.reject);
//
//    return deferred.promise;
//  };
//
//  AuthService.getRef = function () {
//    var deferred = $q.defer();
//
//    AuthService.getCurrentUser().then(function (user) {
//      deferred.resolve(user ? usersRef.$child(user.id) : null);
//    }, deferred.reject);
//
//    return deferred.promise;
//  };
//
//  AuthService.create = function (user) {
//    var deferred = $q.defer();
//
//    fbaseSimpleLogin.$createUser(user.email, user.password).then(function (user) {
//      var userRef = $firebase(new Firebase(usersUrl + '/' + user.id));
//      userRef.email = user.email;
//      userRef.$save().then(deferred.resolve, deferred.reject);
//    }, deferred.reject);
//
//    return deferred.promise;
//  };
//
//  AuthService.remove = function () {
//
//  };
//
//  AuthService.reset = function (email) {
//    var deferred = $q.defer();
//
//    fbaseSimpleLogin.$sendPasswordResetEmail(email);
//
//    // firebaseSimpleLogin.$resetPassword has not yet been implemented in angularfire. We're going it alone.
//    var auth = new FirebaseSimpleLogin(firebase, function (err, user) {
//      console.log('err, user', err, user);
//    });
//    auth.sendPasswordResetEmail(email, function (err, success) {
//      if (err) {
//        deferred.reject(err);
//      } else {
//        deferred.resolve(success);
//      }
//    });
//
//    return deferred.promise;
//
//  },
//
//
//  return {
//
//
//
//    logIn: function (user) {
//      var deferred = $q.defer();
//
//      user.rememberMe = true; // Override default session length (browser session) to be 30 days.
//      firebaseSimpleLogin.$login('password', user).then(deferred.resolve, deferred.reject);
//
//      return deferred.promise;
//    },
//
//    logOut: function () {
//      var deferred = $q.defer();
//
//      deferred.resolve(firebaseSimpleLogin.$logout());
//
//      return deferred.promise;
//    },
//
//    change: firebaseSimpleLogin.$changePassword
//
//  }
//
//}

//angular.module('app').service('AuthService', AuthService);

//function userService($q, $firebase, $firebaseSimpleLogin, environmentService, Restangular) {
//
//
//  var env = environmentService.get(),
//      firebase = new Firebase(env.firebase),
//      firebaseSimpleLogin = $firebaseSimpleLogin(firebase),
//      usersRef = $firebase(new Firebase(env.firebase + '/users')),
//      getCurrentUser = function () {
//        var deferred = $q.defer();
//
//        firebaseSimpleLogin.$getCurrentUser().then(deferred.resolve, deferred.reject);
//
//        deferred.promise.then(function (currentUser) {
//          if (currentUser) {
//            Restangular.setDefaultHeaders({"Authorization": currentUser.firebaseAuthToken});
//          }
//        });
//
//        return deferred.promise;
//      };
//
//};


angular.module('app').factory('RegistrationService', function ($http, CFG) {
  return {
    signup: function (params, success, error) {
      return $http.post(CFG.apiUrl + '/api/v1/users.json', {user: params}, {method: 'post'})
          .success(success)
          .error(error);
    }
  };
})

    .factory('AuthenticationService', function ($http, Session, CFG) {
      //TODO: replace currentUser
      return {
        login: function (credentials, success, error) {
          return $http.post(CFG.apiUrl + '/api/v1/login.json', {
            user: credentials
          }).success(function (res) {
            if (res.user) {
              Session.create(null, res.user.id, res.user.email, res.user.username);
            }
            success(res);
          }).error(function (res) {
            // TODO: destroy session if auth failure?
            Session.destroy();
            error(res);
          });
        },
        logout: function (success, error) {
          return $http.post(CFG.apiUrl + '/api/v1/logout.json', {}).success(function (res) {
            Session.destroy();
            success(res);
          }).error(function (res) {
            //TODO: destroy session on logout error?
            Session.destroy();
            error(res);
          });
        },
        isAuthenticated: function () {
          console.log(Session);
          return !!Session.userId;
        },
        isAuthorized: function (authorizedRoles) {
          if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
          }
          return (this.isAuthenticated() &&
          authorizedRoles.indexOf(Session.userRole) !== -1);
        }
      };

    })

    .factory('httpInterceptor', function ($q, $window, $location) {

      return function (promise) {
        var success = function (response) {
          return response;
        };

        var error = function (response) {
          if (response.status === 401) {
            $location.url('/login');
          }

          return $q.reject(response);
        };

        return promise.then(success, error);
      };

    })

    .service('Session', function () {

      this.create = function (sessionId, userId, email, username) {
        // TODO: sessionId
        // TODO: users' roles
        this.id = userId;
        this.userId = userId;
        this.email = email;
        this.username = username;
        //this.userRole = userRole;
      };

      this.destroy = function () {
        this.id = null;
        this.userId = null;
        this.email = null;
        this.username = null;
      };
      return this;
    })

    .factory('Users', function ($resource, CFG) {
      return $resource(CFG.apiUrl + '/api/v1/users', {format: 'json'});
    });
