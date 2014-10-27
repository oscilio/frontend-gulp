// This file will conditionally load angular-mocks
// - but is only concatenated in development/test
// - and will only be enabled when ng_mocks == true in config.json
// see this blog for more info: http://www.base2.io/2013/10/29/conditionally-mock-http-backend/

angular.module('apimocks', ['ngMockE2E'])
    .service('resourceFactory', function () {
      var resourceFactory = {};

      resourceFactory.user = function (data) {
        return _.extend({
          id: 1,
          email: 'foo@foo.com',
          name: 'Foo Bar',
          username: 'foo',
          nickname: 'foobar',
          uid: 'foo@foo.com',
          provider: "email",
          image: "https://lh6.googleusercontent.com/-QE-jtro9Brs/AAAAAAAAAAI/AAAAAAAAAAw/vJ0Msp_Ob1o/photo.jpg?sz=50",
          created_at: null,
          updated_at: null
        }, data);
      };

      return resourceFactory;
    })

    .factory('responsesFactory', function (resourceFactory) {
      return {
        loginValid: function (data) {
          return [200, {
            "data": {
              id: 2,
              username: data.username,
              email: data.email,
              name: null,
              nickname: null,
              image: null,
              provider: "email",
              uid: data.email
            }
          }];
        },
        loginInvalid: function (data) {
          return [401, {"errors": ["Invalid login credentials. Please try again."]}]
        },
        loginNeedConfirmation: function (data) {
          return [401, {
            "success": false,
            "errors": ["A confirmation email was sent to your account at " + data.email + ". You must follow the instructions in the email before your account can be activated"]
          }]
        },
        tokenValid: function (data, hdr) {
          return [200, {
            success: true,
            data: {
              email: (hdr.uid && /@/.test(hdr.uid)) ? hdr.uid : 'someuser@gmail.com',
              id: 1,
              image: "https://lh6.googleusercontent.com/-QE-jtro9Brs/AAAAAAAAAAI/AAAAAAAAAAw/vJ0Msp_Ob1o/photo.jpg?sz=50",
              name: "Email Oscillator",
              nickname: null,
              provider: (hdr.uid && /@/.test(hdr.uid)) ? "email" : "google_oauth2",
              uid: hdr.uid || "101629501302231591688",
              username: data.username
            }
          }, {"Access-Token": hdr['access-token']}];
        },
        tokenInvalid: function () {
          return [401, {
            success: false, errors: ['Invalid login credentials']
          }];
        },
        signupValid: function (data) {
          return [200, {
            success: true,
            data: {
              id: 4,
              email: data.email,
              username: data.username,
              image: null,
              name: null,
              nickname: null,
              provider: "email",
              uid: data.email,
              created_at: "2014-10-22T07:03:15.304Z",
              updated_at: "2014-10-22T07:03:15.304Z"
            }
          }];
        },
        signupInvalid: function (data, errors) {
          //TODO: devise is returning 403 in some cases, 422?
          return [403, {
            status: "error",
            errors: errors,
            data: {
              id: null,
              email: data.email,
              username: data.username,
              image: null,
              name: null,
              nickname: null,
              provider: "email",
              uid: data.email,
              created_at: null,
              updated_at: null
            }
          }];
        },
        usersGET: function (data) {
          var users = _.map([{
            id: 1,
            email: 'foo@foo.com',
            name: 'Foo Bar',
            username: 'foo',
            nickname: 'foobar',
            uid: 'foo@foo.com'
          },{
            id: 2,
            email: 'bar@bar.com',
            name: 'Bar Baz',
            username: 'bar',
            nickname: 'barbaz',
            uid: 'bar@bar.com'
          },{
            id: 3,
            email: 'baz@baz.com',
            name: 'Baz Qux',
            username: 'baz',
            nickname: 'bazqux',
            uid: 'baz@baz.com'
          }], function(u) { return resourceFactory.user(u) });

          console.log(users);
          return [200, users];
        }
      }
    })

    .factory('responses', function (responsesFactory) {
      return {
        login: function (method, url, data, headers) {
          if (data.password == 'password') {
            return responsesFactory.loginValid(data);
            //TODO: mocks for unconfirmed users
          } else {
            return responsesFactory.loginInvalid(data);
          }
        },
        signup: function (method, url, data, headers) {
          if (data.password != data.password_confirmation) {
            //TODO: mock password confirmation error?
            return responsesFactory.signupInvalid(data, {password: ['errors']});
          } else if (data.username == 'dupe@dupe.com') {
            return responsesFactory.signupInvalid(data, {email: ['This email address is already in use']});
          } else {
            return responsesFactory.signupValid(data);
          }
        },
        validateToken: function (method, url, data, headers) {
          //TODO: conditions to return invalid header? only uid, client, access-token in req headers
          return responsesFactory.tokenValid(data, headers);
        },
        usersGET: function (method, url, data, headers) {
          return responsesFactory.usersGET(data);
        }
      };
    })

    .service('res', function (responses) {
      // based on the compose pattern, returns a function that transforms arguments
      this.with = function (resType) {
        var self = this;
        var transformFn = function (method, url, data, headers) {
          return [method, url, JSON.parse(data || '{}'), headers];
        };
        return function (method, url, data, headers) {
          return responses[resType].apply(this, transformFn.apply(this, arguments));
        }
      }
    })

    .run(function ($httpBackend, res) {
      var apiUrl = '<%= api_protocol %>://<%= api_url %>',
          authUrl = apiUrl + '/auth',
          apiBaseUrl = apiUrl + '/api/v1',
          oauthProvider = 'google_oauth2';
      $httpBackend.whenPOST(authUrl).respond(res.with('signup'));
      $httpBackend.whenPOST(authUrl + '/sign_in').respond(res.with('login'));
      $httpBackend.whenGET(authUrl + '/validate_token').respond(res.with('validateToken')); //TODO: docs say POST, but i saw GET

      //TODO: implement mocks for these requests
      $httpBackend.whenPUT(authUrl).passThrough();
      $httpBackend.whenDELETE(authUrl).passThrough();
      $httpBackend.whenDELETE(authUrl + '/sign_out').passThrough();
      $httpBackend.whenPOST(authUrl + '/password').passThrough();
      $httpBackend.whenPUT(authUrl + '/password').passThrough();
      $httpBackend.whenGET(authUrl + '/password/edit').passThrough();
      $httpBackend.whenGET(authUrl + '/' + oauthProvider).passThrough();
      $httpBackend.whenGET(authUrl + '/' + oauthProvider + '/callback').passThrough();
      $httpBackend.whenPOST(authUrl + '/' + oauthProvider + '/callback').passThrough();

      $httpBackend.whenGET(apiBaseUrl + '/users.json').respond(res.with('usersGET'));

      // For everything else, don't mock
      var all_api_routes = /<%= api_url %>.*/;
      $httpBackend.whenGET(all_api_routes).passThrough();
      $httpBackend.whenPOST(all_api_routes).passThrough();
    });

<%
if (typeof ng_mocks != 'undefined' && ng_mocks) { %>
  // only load the module when running with ng_mocks configured
  angular.module('app').requires.push('apimocks');
<%
}
%>
