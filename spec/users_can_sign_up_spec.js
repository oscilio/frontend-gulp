
describe('users can sign up and login', function() {
  var login = browser.params.login;

  beforeEach(function() {
    browser.get('http://localhost:8000/');
  });

  it('should offer registration and login via modals on the main page', function() {
    element(by.css('nav.navbar'))
        .element(by.buttonText('Sign Up'))
        .click();

    var signup = element(by.css('#signup-modal'));
    signup.element(by.model('signup.email')).sendKeys(login.email);
    signup.element(by.model('signup.username')).sendKeys(login.username);
    signup.element(by.model('signup.password')).sendKeys(login.password);
    signup.element(by.model('signup.passwordConfirmation')).sendKeys(login.password);
    //signup.element(by.buttonText('Sign Up')).click();
    signup.element(by.buttonText('Cancel')).click();

    element(by.css('nav.navbar'))
        .element(by.buttonText('Log In'))
        .click();

    var modal = element(by.css('#login-modal'));
    modal.element(by.model('creds.email')).sendKeys(login.email);
    modal.element(by.model('creds.password')).sendKeys(login.password);
    modal.element(by.buttonText('Log In')).click();
  });

  it('should allow users to bypass the signup process by using google oauth', function() {

  });
});