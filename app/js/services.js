angular.module('app')
    .service('EnvService', function (CFG) {
      var EnvService = {};

      EnvService.apiUrl = '//' + CFG.apiUrl;
      return EnvService;
    })

    .factory('Users', function ($resource, EnvService) {
      return $resource(EnvService.apiUrl + '/api/v1/users', {format: 'json'});
    });
