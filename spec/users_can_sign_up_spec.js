
describe('users can sign up and login', function() {
  var login = browser.params.login;

  beforeEach(function() {
    browser.get('http://localhost:8000/');
  });

  it('should offer signup, signin and signout on the main page', function() {
    var navbar = element(by.css('nav.navbar'));

    navbar.element(by.buttonText('Sign Up')).click();

    var signup = element(by.css('#signup-modal'));
    signup.element(by.model('signup.email')).sendKeys(login.email);
    signup.element(by.model('signup.username')).sendKeys(login.username);
    signup.element(by.model('signup.password')).sendKeys(login.password);
    signup.element(by.model('signup.passwordConfirmation')).sendKeys(login.password);
    signup.element(by.buttonText('Sign Up')).click();

    navbar.element(by.buttonText('Log In')).click();

    var modal = element(by.css('#login-modal'));
    modal.element(by.model('creds.email')).sendKeys(login.email);
    modal.element(by.model('creds.password')).sendKeys(login.password);
    modal.element(by.buttonText('Log In')).click();

    expect(navbar.element(by.css('#user-profile-widget')).getText()).toMatch(login.email);

    // refresh & assert auth is persisted
    browser.get('http://localhost:8000/');
    var userProfileWidget = element(by.css('#user-profile-widget')),
        signoutButton = userProfileWidget.element(by.css('#user-profile-logout'));
    expect(userProfileWidget.getText()).toMatch(login.email);

    signoutButton.click();
    expect(element(by.css('nav.navbar')).getText()).toMatch("Sign Up");
  });

  it('should allow users to bypass the signup process by using google oauth', function() {

  });
});