/**
 * Cypress Support File
 * Custom commands and global configuration
 */

// Import commands
import './commands';

// Cypress configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // You can customize this to only ignore certain errors
  if (err.message.includes('ResizeObserver')) {
    return false;
  }
  return true;
});

// Before each test
beforeEach(() => {
  // Setup that runs before each test
  cy.log('Starting test...');
});

// After each test
afterEach(() => {
  // Cleanup that runs after each test
  cy.log('Test completed');
});
