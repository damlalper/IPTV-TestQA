const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',

    // Viewport settings
    viewportWidth: 1920,
    viewportHeight: 1080,

    // Timeouts
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,
    responseTimeout: 30000,

    // Video and screenshot settings
    video: true,
    videoCompression: 32,
    screenshotOnRunFailure: true,

    // Test retry
    retries: {
      runMode: 2,
      openMode: 0,
    },

    // Spec pattern
    specPattern: 'automation/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',

    // Support file
    supportFile: 'automation/cypress/support/e2e.js',

    // Setup
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });

      return config;
    },

    // Environment variables
    env: {
      TEST_USER_EMAIL: 'testuser@example.com',
      TEST_USER_PASSWORD: 'Test@1234',
    },

    // Experimental features
    experimentalStudio: true,
  },

  // Component testing configuration (if needed)
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});
