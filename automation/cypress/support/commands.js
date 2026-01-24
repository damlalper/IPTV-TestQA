/**
 * Custom Cypress Commands
 * Reusable commands for OTT/IPTV testing
 */

/**
 * Custom command to login
 * Usage: cy.login(email, password)
 */
Cypress.Commands.add('login', (email, password) => {
  email = email || Cypress.env('TEST_USER_EMAIL');
  password = password || Cypress.env('TEST_USER_PASSWORD');

  cy.visit('/');
  cy.contains('button', 'Login').click();
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/home');
});

/**
 * Custom command to logout
 * Usage: cy.logout()
 */
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="user-profile"]').click();
  cy.contains('button', 'Logout').click();
  cy.url().should('include', '/login');
});

/**
 * Custom command to navigate to Live TV
 * Usage: cy.goToLiveTV()
 */
Cypress.Commands.add('goToLiveTV', () => {
  cy.get('a[href="/livetv"]').click();
  cy.url().should('include', '/livetv');
  cy.get('[data-testid="channel-list"]').should('be.visible');
});

/**
 * Custom command to navigate to VOD
 * Usage: cy.goToVOD()
 */
Cypress.Commands.add('goToVOD', () => {
  cy.get('a[href="/vod"]').click();
  cy.url().should('include', '/vod');
  cy.get('[data-testid="vod-catalog"]').should('be.visible');
});

/**
 * Custom command to play a channel
 * Usage: cy.playChannel(index)
 */
Cypress.Commands.add('playChannel', (index = 0) => {
  cy.get('[data-testid="channel-item"]').eq(index).click();
  cy.get('video').should('be.visible');

  // Wait for video to start playing
  cy.get('video').should((video) => {
    const videoElement = video[0];
    expect(videoElement.paused).to.be.false;
  });
});

/**
 * Custom command to search for content
 * Usage: cy.searchContent('sports')
 */
Cypress.Commands.add('searchContent', (query) => {
  cy.get('[data-testid="search-input"]').type(`${query}{enter}`);
  cy.get('[data-testid="search-results"]').should('be.visible');
});

/**
 * Custom command to add to favorites
 * Usage: cy.addToFavorites(itemIndex)
 */
Cypress.Commands.add('addToFavorites', (index = 0) => {
  cy.get('[data-testid="favorite-button"]').eq(index).click();
  cy.get('[data-testid="toast-notification"]').should('contain', 'Added to favorites');
});

/**
 * Custom command to wait for video to be playing
 * Usage: cy.waitForVideoPlaying()
 */
Cypress.Commands.add('waitForVideoPlaying', (timeout = 10000) => {
  cy.get('video', { timeout }).should((video) => {
    const videoElement = video[0];
    expect(videoElement.paused).to.be.false;
    expect(videoElement.currentTime).to.be.greaterThan(0);
  });
});

/**
 * Custom command to check video quality
 * Usage: cy.checkVideoQuality()
 */
Cypress.Commands.add('checkVideoQuality', () => {
  cy.get('video').then((video) => {
    const videoElement = video[0];
    const quality = {
      width: videoElement.videoWidth,
      height: videoElement.videoHeight,
      duration: videoElement.duration,
      currentTime: videoElement.currentTime
    };

    cy.log('Video Quality:', quality);
    return quality;
  });
});

/**
 * Custom command to simulate network throttling
 * Note: This requires Chrome DevTools Protocol
 * Usage: cy.throttleNetwork('Slow 3G')
 */
Cypress.Commands.add('throttleNetwork', (profile) => {
  const profiles = {
    'Slow 3G': {
      offline: false,
      downloadThroughput: (1 * 1024 * 1024) / 8,
      uploadThroughput: (0.5 * 1024 * 1024) / 8,
      latency: 200
    },
    'Fast 4G': {
      offline: false,
      downloadThroughput: (10 * 1024 * 1024) / 8,
      uploadThroughput: (5 * 1024 * 1024) / 8,
      latency: 50
    }
  };

  if (Cypress.browser.name === 'chrome') {
    cy.wrap(
      Cypress.automation('remote:debugger:protocol', {
        command: 'Network.emulateNetworkConditions',
        params: profiles[profile]
      })
    );
  }
});

/**
 * Custom assertion to check if element is in viewport
 * Usage: cy.get('element').should('be.inViewport')
 */
Cypress.Commands.add('isInViewport', { prevSubject: true }, (subject) => {
  const rect = subject[0].getBoundingClientRect();

  expect(rect.top).to.be.at.least(0);
  expect(rect.left).to.be.at.least(0);
  expect(rect.bottom).to.be.at.most(Cypress.config('viewportHeight'));
  expect(rect.right).to.be.at.most(Cypress.config('viewportWidth'));

  return subject;
});
