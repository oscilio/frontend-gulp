// conf.js
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['**/*_spec.js'],
  multiCapabilities: [{
    browserName: 'chrome'
  }],
  jasmineNodeOpts: {
    showColors: true,
    includeStackTrace: true
  },

  params: {
    login: {
      email: 'user123@example.com',
      password: 'password'
    }
  },

  //mocks: {
  //  default: [
  //    'register.create'//,
  //    //'login.create'
  //  ]
  //},

  onPrepare: function() {
    //var HttpBackend = require('http-backend-proxy');
    //browser.proxy = new HttpBackend(browser, {buffer:true});
    browser.get('http://localhost:8000/');
    //browser.executeScript('angular.module(\'app\').requires.push(\'e2e-mocks\')');
    //browser.executeScript('angular.module(\'app\', [\'ngMockE2E\']);');

    ////load mocks
    //browser.mock = require('protractor-http-mock');
    //browser.mock.config = {
    //  rootDirectory: __dirname, // default value: process.cwd()
    //  protractorConfig: 'conf.js' // default value: 'protractor.config'
    //};
  }
};
