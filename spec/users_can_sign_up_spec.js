
describe('users can sign up and login', function() {
  var login = browser.params.login;

  beforeEach(function() {
  });

  it('should offer registration and login via modals on the main page', function() {

    //console.log(browser.executeScript('console.log("fdsa");'));
    //console.log(browser.executeScript('console.log(angular);'))
    //browser.proxy.whenPOST('/auth/sign_in').respond(200);
    //browser.proxy.flush();

    //element(by.css('nav.navbar'))
    //    .element(by.buttonText('Sign Up'))
    //    .click();
    //
    //var signup = element(by.css('#signup-modal'));
    //signup.element(by.model('signup.email')).sendKeys(login.email);
    //signup.element(by.model('signup.username')).sendKeys(login.username);
    //signup.element(by.model('signup.password')).sendKeys(login.password);
    //signup.element(by.model('signup.passwordConfirmation')).sendKeys(login.password);
    ////signup.element(by.buttonText('Sign Up')).click();
    //signup.element(by.buttonText('Cancel')).click();

    //console.log(browser.proxy.whenPOST('/auth/sign_up'));
    //.respond(function(method, url) { return [200, {username:'foobarbaz'}]});

    element(by.css('nav.navbar'))
        .element(by.buttonText('Log In'))
        .click();

    var modal = element(by.css('#login-modal'));
    modal.element(by.model('creds.email')).sendKeys(login.email);
    modal.element(by.model('creds.password')).sendKeys(login.password);
    modal.element(by.buttonText('Log In')).click();

    //element(by.model('first')).sendKeys(1);
    //element(by.model('second')).sendKeys(2);
    //element(by.id('gobutton')).click();
    //expect(element(by.binding('latest')).getText()).
    //    toEqual('5'); // This is wrong!
  });

  it('should allow users to bypass the signup process by using google oauth', function() {

  });
});