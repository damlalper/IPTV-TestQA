const { test, expect } = require('@playwright/test');

/**
 * Authentication Tests - Login Functionality
 * Test Suite: RT-101 to RT-104
 */

test.describe('User Authentication - Login', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to application before each test
    await page.goto('/');
  });

  test('RT-101: Valid user login @smoke @regression', async ({ page }) => {
    // Test Case: User logs in with valid credentials

    // Navigate to login page
    await page.click('button:has-text("Login")');

    // Enter valid credentials
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Test@1234');

    // Submit login form
    await page.click('button[type="submit"]');

    // Verify successful login
    await expect(page).toHaveURL(/.*home/);
    await expect(page.locator('[data-testid="user-profile"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-name"]')).toContainText('Test User');
  });

  test('RT-102: Invalid credentials login @regression', async ({ page }) => {
    // Test Case: User attempts login with invalid credentials

    await page.click('button:has-text("Login")');

    // Enter invalid credentials
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');

    // Submit login form
    await page.click('button[type="submit"]');

    // Verify error message
    const errorMessage = page.locator('[data-testid="error-message"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/Invalid email or password/i);

    // Verify user remains on login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('RT-103: Session persistence @regression', async ({ page, context }) => {
    // Test Case: User session persists across page refresh

    // Login first
    await page.click('button:has-text("Login")');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Test@1234');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*home/);

    // Refresh page
    await page.reload();

    // Verify user still logged in
    await expect(page.locator('[data-testid="user-profile"]')).toBeVisible();

    // Verify session token exists
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(cookie => cookie.name === 'session');
    expect(sessionCookie).toBeDefined();
  });

  test('RT-104: Logout clears session @smoke @regression', async ({ page, context }) => {
    // Test Case: Logout successfully clears user session

    // Login first
    await page.click('button:has-text("Login")');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Test@1234');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*home/);

    // Logout
    await page.click('[data-testid="user-profile"]');
    await page.click('button:has-text("Logout")');

    // Verify redirected to login page
    await expect(page).toHaveURL(/.*login/);

    // Verify session cleared
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(cookie => cookie.name === 'session');
    expect(sessionCookie).toBeUndefined();

    // Try to access protected route
    await page.goto('/home');
    await expect(page).toHaveURL(/.*login/);
  });

  test('Empty credentials validation @regression', async ({ page }) => {
    // Test Case: Verify validation for empty fields

    await page.click('button:has-text("Login")');

    // Try to submit without entering credentials
    await page.click('button[type="submit"]');

    // Verify validation messages
    const emailError = page.locator('[data-testid="email-error"]');
    const passwordError = page.locator('[data-testid="password-error"]');

    await expect(emailError).toBeVisible();
    await expect(passwordError).toBeVisible();
  });

  test('Password visibility toggle @regression', async ({ page }) => {
    // Test Case: Toggle password visibility

    await page.click('button:has-text("Login")');
    await page.fill('input[name="password"]', 'Test@1234');

    // Password should be hidden by default
    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle button
    await page.click('[data-testid="toggle-password"]');

    // Password should now be visible
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('Remember me functionality @regression', async ({ page, context }) => {
    // Test Case: Remember me checkbox functionality

    await page.click('button:has-text("Login")');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Test@1234');

    // Check "Remember me"
    await page.check('input[name="remember"]');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*home/);

    // Close and reopen browser
    await context.close();

    // In a real scenario, cookies should persist
    // This is a simplified check
    const cookies = await context.cookies();
    const rememberCookie = cookies.find(cookie => cookie.name === 'remember');

    // This test would need actual implementation based on app behavior
    console.log('Remember me cookie check:', rememberCookie);
  });
});
