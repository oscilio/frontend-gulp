function EnvService (CFG) {
  var EnvService = {};

  EnvService.apiUrl = '//' + CFG.apiUrl + '/';
  return EnvService;
}

angular.module('app')
    .service('EnvService', EnvService);

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
