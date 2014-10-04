app.factory('RegistrationService', function($http) {
  'use strict';

  return {
    signup: function(params, success, error) {
      return $http.post(apiUrl + '/api/v1/users.json', { user: params }, { method: 'post' })
          .success(success)
          .error(error);
    }
  };
});

app.factory('AuthenticationService', function($http, Session) {
  'use strict';

  //TODO: replace currentUser
  return {
    login: function (credentials, success, error) {
      return $http.post(apiUrl + '/api/v1/login.json', {
        user: credentials
      }).success(function(res) {
        if (res.user) {
          Session.create(null, res.user.id, res.user.email, res.user.username);
        }
        success(res);
      }).error(function(res) {
        // TODO: destroy session if auth failure?
        Session.destroy();
        error(res);
      });
    },
    logout: function(success, error) {
      return $http.post(apiUrl + '/api/v1/logout.json', {
      }).success(function(res) {
        Session.destroy();
        success(res);
      }).error(function(res) {
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

});

//app.factory('ApiInitService');

app.factory('httpInterceptor', function($q, $window, $location) {

  return function(promise) {
    var success = function(response) {
      return response;
    };

    var error = function(response) {
      if (response.status === 401) {
        $location.url('/login');
      }

      return $q.reject(response);
    };

    return promise.then(success, error);
  };

});


app.service('Session', function () {
  'use strict';

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
});

app.factory('Users', function($resource) {
  return $resource(apiUrl + '/api/v1/users', { format: 'json' });
});
