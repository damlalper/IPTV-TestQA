/**
 * Cypress Smoke Tests
 * Critical path testing for OTT/IPTV application
 */

describe('Smoke Tests', () => {

  beforeEach(() => {
    // Clear cookies and local storage before each test
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('should load the application homepage', () => {
    cy.visit('/');

    // Verify page loads
    cy.title().should('include', 'OTT');

    // Verify main navigation is visible
    cy.get('nav').should('be.visible');

    // Verify login button exists
    cy.contains('button', 'Login').should('be.visible');
  });

  it('should allow user to login', () => {
    cy.visit('/');

    // Click login button
    cy.contains('button', 'Login').click();

    // Fill in credentials
    cy.get('input[name="email"]').type(Cypress.env('TEST_USER_EMAIL') || 'testuser@example.com');
    cy.get('input[name="password"]').type(Cypress.env('TEST_USER_PASSWORD') || 'Test@1234');

    // Submit form
    cy.get('button[type="submit"]').click();

    // Verify redirect to home
    cy.url().should('include', '/home');

    // Verify user is logged in
    cy.get('[data-testid="user-profile"]').should('be.visible');
  });

  it('should display live TV channels after login', () => {
    // Login first
    cy.visit('/');
    cy.contains('button', 'Login').click();
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('Test@1234');
    cy.get('button[type="submit"]').click();

    // Navigate to Live TV
    cy.get('a[href="/livetv"]').click();

    // Verify URL
    cy.url().should('include', '/livetv');

    // Verify channel list loads
    cy.get('[data-testid="channel-list"]').should('be.visible');

    // Verify at least one channel is displayed
    cy.get('[data-testid="channel-item"]').should('have.length.greaterThan', 0);
  });

  it('should play a live TV channel', () => {
    // Login
    cy.visit('/');
    cy.contains('button', 'Login').click();
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('Test@1234');
    cy.get('button[type="submit"]').click();

    // Go to Live TV
    cy.get('a[href="/livetv"]').click();

    // Click on first channel
    cy.get('[data-testid="channel-item"]').first().click();

    // Verify video player is visible
    cy.get('video').should('be.visible');

    // Wait for video to start playing
    cy.get('video').should((video) => {
      const videoElement = video[0];
      expect(videoElement.paused).to.be.false;
      expect(videoElement.currentTime).to.be.greaterThan(0);
    });
  });

  it('should allow user to logout', () => {
    // Login first
    cy.visit('/');
    cy.contains('button', 'Login').click();
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('Test@1234');
    cy.get('button[type="submit"]').click();

    // Logout
    cy.get('[data-testid="user-profile"]').click();
    cy.contains('button', 'Logout').click();

    // Verify redirected to login
    cy.url().should('include', '/login');

    // Verify user profile no longer visible
    cy.get('[data-testid="user-profile"]').should('not.exist');
  });

  it('should handle invalid login credentials', () => {
    cy.visit('/');
    cy.contains('button', 'Login').click();

    // Enter invalid credentials
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Verify error message
    cy.get('[data-testid="error-message"]').should('be.visible');
    cy.get('[data-testid="error-message"]').should('contain', 'Invalid');

    // User should remain on login page
    cy.url().should('include', '/login');
  });

  it('should search for content', () => {
    // Login
    cy.visit('/');
    cy.contains('button', 'Login').click();
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('Test@1234');
    cy.get('button[type="submit"]').click();

    // Perform search
    cy.get('[data-testid="search-input"]').type('sports{enter}');

    // Verify search results appear
    cy.get('[data-testid="search-results"]').should('be.visible');
  });

  it('should load VOD catalog', () => {
    // Login
    cy.visit('/');
    cy.contains('button', 'Login').click();
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('Test@1234');
    cy.get('button[type="submit"]').click();

    // Navigate to VOD
    cy.get('a[href="/vod"]').click();

    // Verify VOD catalog loads
    cy.url().should('include', '/vod');
    cy.get('[data-testid="vod-catalog"]').should('be.visible');

    // Verify videos are displayed
    cy.get('[data-testid="video-item"]').should('have.length.greaterThan', 0);
  });

});
