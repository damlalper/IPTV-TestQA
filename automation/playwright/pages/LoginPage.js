/**
 * Page Object Model - Login Page
 * Encapsulates login page interactions and elements
 */

class LoginPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.loginButton = page.locator('button:has-text("Login")');
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.rememberMeCheckbox = page.locator('input[name="remember"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.emailError = page.locator('[data-testid="email-error"]');
    this.passwordError = page.locator('[data-testid="password-error"]');
    this.togglePasswordButton = page.locator('[data-testid="toggle-password"]');
    this.forgotPasswordLink = page.locator('a:has-text("Forgot Password")');
    this.signUpLink = page.locator('a:has-text("Sign Up")');
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await this.page.goto('/');
    await this.loginButton.click();
  }

  /**
   * Perform login with credentials
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {boolean} rememberMe - Whether to check "Remember Me"
   */
  async login(email, password, rememberMe = false) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    if (rememberMe) {
      await this.rememberMeCheckbox.check();
    }

    await this.submitButton.click();
  }

  /**
   * Complete login flow from home page
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {boolean} rememberMe - Whether to check "Remember Me"
   */
  async loginFromHome(email, password, rememberMe = false) {
    await this.goto();
    await this.login(email, password, rememberMe);
  }

  /**
   * Toggle password visibility
   */
  async togglePasswordVisibility() {
    await this.togglePasswordButton.click();
  }

  /**
   * Get error message text
   * @returns {Promise<string>} Error message text
   */
  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  /**
   * Check if error message is visible
   * @returns {Promise<boolean>}
   */
  async isErrorMessageVisible() {
    return await this.errorMessage.isVisible();
  }

  /**
   * Check if email validation error is visible
   * @returns {Promise<boolean>}
   */
  async isEmailErrorVisible() {
    return await this.emailError.isVisible();
  }

  /**
   * Check if password validation error is visible
   * @returns {Promise<boolean>}
   */
  async isPasswordErrorVisible() {
    return await this.passwordError.isVisible();
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  /**
   * Click sign up link
   */
  async clickSignUp() {
    await this.signUpLink.click();
  }

  /**
   * Clear email and password fields
   */
  async clearFields() {
    await this.emailInput.clear();
    await this.passwordInput.clear();
  }

  /**
   * Get password input type (to check if visible)
   * @returns {Promise<string>} Input type ("password" or "text")
   */
  async getPasswordInputType() {
    return await this.passwordInput.getAttribute('type');
  }

  /**
   * Wait for login page to be fully loaded
   */
  async waitForPageLoad() {
    await this.emailInput.waitFor({ state: 'visible' });
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.submitButton.waitFor({ state: 'visible' });
  }
}

module.exports = { LoginPage };
