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

  //onPrepare: function() { },

  params: {
    login: {
      email: 'user123@example.com',
      password: 'password'
    }
  }
};
