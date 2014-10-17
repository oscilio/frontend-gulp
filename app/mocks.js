// This file will conditionally load angular-mocks,
// - But only when running tests in karma/protractor
// - This file's only concatenated in development.
// see this blog for more info: http://www.base2.io/2013/10/29/conditionally-mock-http-backend/
angular.module('e2e-mocks', ['ngMockE2E'])
    .run(function($httpBackend) {
      var apiUrl = '<%= api_protocol %>://<%= api_url %>';

      $httpBackend.whenPOST(apiUrl + '/auth/sign_in').respond(200, {username: 'foobarbazqux'});

      // For everything else, don't mock
      $httpBackend.whenGET(/^\w+.*/).passThrough();
      $httpBackend.whenPOST(/^\w+.*/).passThrough();
    });

<% if(typeof ng_mocks != 'undefined' && ng_mocks) { %>
  // only load the module when running with api_mocks configured
  angular.module('app').requires.push('e2e-mocks');
<% } %>
