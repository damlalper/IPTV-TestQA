const { test, expect, chromium } = require('@playwright/test');

/**
 * Network Resilience Testing
 * Tests application behavior under various network conditions
 */

// Network profiles simulating real-world conditions
const NETWORK_PROFILES = {
  'Fast 4G': {
    downloadThroughput: 10 * 1024 * 1024 / 8,  // 10 Mbps in bytes/s
    uploadThroughput: 5 * 1024 * 1024 / 8,     // 5 Mbps
    latency: 50,                                // 50ms
  },
  'Slow 4G': {
    downloadThroughput: 3 * 1024 * 1024 / 8,   // 3 Mbps
    uploadThroughput: 1.5 * 1024 * 1024 / 8,   // 1.5 Mbps
    latency: 100,                               // 100ms
  },
  'Slow 3G': {
    downloadThroughput: 1 * 1024 * 1024 / 8,   // 1 Mbps
    uploadThroughput: 0.5 * 1024 * 1024 / 8,   // 0.5 Mbps
    latency: 200,                               // 200ms
  },
  'Offline': {
    offline: true,
  },
};

test.describe('Network Resilience Tests @network', () => {

  test('RT-801: Video playback on Slow 3G @regression', async ({ browser }) => {
    const context = await browser.newContext();

    // Apply Slow 3G network conditions
    const cdpSession = await context.newCDPSession(await context.newPage());
    await cdpSession.send('Network.enable');
    await cdpSession.send('Network.emulateNetworkConditions', NETWORK_PROFILES['Slow 3G']);

    const page = context.pages()[0];

    // Login
    await page.goto('/');
    await page.click('button:has-text("Login")');
    await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL || 'testuser@example.com');
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD || 'Test@1234');
    await page.click('button[type="submit"]');

    // Navigate to Live TV
    await page.click('a[href="/livetv"]');

    // Start video playback
    const startTime = Date.now();
    await page.click('[data-testid="channel-item"]:first-child');

    // Wait for video to start (may take longer on slow connection)
    await page.waitForFunction(() => {
      const video = document.querySelector('video');
      return video && video.currentTime > 0 && !video.paused;
    }, { timeout: 10000 });

    const startupTime = Date.now() - startTime;
    console.log(`Video startup on Slow 3G: ${startupTime}ms`);

    // Monitor buffering for 30 seconds
    let bufferingCount = 0;
    const monitorDuration = 30000;
    const checkInterval = 1000;
    const monitorStart = Date.now();

    while (Date.now() - monitorStart < monitorDuration) {
      const isBuffering = await page.evaluate(() => {
        const video = document.querySelector('video');
        return video && video.readyState < 3 && !video.paused;
      });

      if (isBuffering) bufferingCount++;
      await page.waitForTimeout(checkInterval);
    }

    const bufferingRate = (bufferingCount / (monitorDuration / checkInterval)) * 100;
    console.log(`Buffering rate on Slow 3G: ${bufferingRate.toFixed(2)}%`);

    // Check if adaptive bitrate adjusted quality
    const videoQuality = await page.evaluate(() => {
      const video = document.querySelector('video');
      if (video) {
        return {
          width: video.videoWidth,
          height: video.videoHeight,
          bitrate: video.currentSrc
        };
      }
      return null;
    });

    console.log('Video quality on Slow 3G:', videoQuality);

    // On slow network, buffering should still be manageable (< 15%)
    expect(bufferingRate).toBeLessThan(15);

    await context.close();
  });

  test('RT-802: Connection loss and recovery @regression', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Login and start playback
    await page.goto('/');
    await page.click('button:has-text("Login")');
    await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL || 'testuser@example.com');
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD || 'Test@1234');
    await page.click('button[type="submit"]');
    await page.click('a[href="/livetv"]');
    await page.click('[data-testid="channel-item"]:first-child');

    // Wait for stable playback
    await page.waitForTimeout(3000);

    // Get CDP session for network control
    const cdpSession = await context.newCDPSession(page);
    await cdpSession.send('Network.enable');

    // Simulate connection loss
    console.log('Simulating connection loss...');
    await cdpSession.send('Network.emulateNetworkConditions', NETWORK_PROFILES['Offline']);

    await page.waitForTimeout(2000);

    // Check if error message appears
    const errorVisible = await page.locator('[data-testid="network-error"]').isVisible()
      .catch(() => false);

    console.log(`Network error displayed: ${errorVisible}`);

    // Check if video stopped
    const videoPaused = await page.evaluate(() => {
      const video = document.querySelector('video');
      return video ? video.paused : true;
    });

    console.log(`Video paused on disconnect: ${videoPaused}`);

    // Restore connection
    console.log('Restoring connection...');
    await cdpSession.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: -1,
      uploadThroughput: -1,
      latency: 0
    });

    // Wait for recovery
    await page.waitForTimeout(3000);

    // Check if video resumes
    const videoResumed = await page.waitForFunction(() => {
      const video = document.querySelector('video');
      return video && !video.paused && video.currentTime > 0;
    }, { timeout: 10000 })
      .then(() => true)
      .catch(() => false);

    console.log(`Video resumed after reconnect: ${videoResumed}`);

    // Should show error during disconnect and auto-resume on reconnect
    expect(videoPaused).toBe(true);
    expect(videoResumed).toBe(true);

    await context.close();
  });

  test('RT-803: High latency handling @regression', async ({ browser }) => {
    const context = await browser.newContext();
    const cdpSession = await context.newCDPSession(await context.newPage());

    // Apply high latency (300ms)
    await cdpSession.send('Network.enable');
    await cdpSession.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 5 * 1024 * 1024 / 8,  // 5 Mbps
      uploadThroughput: 2 * 1024 * 1024 / 8,    // 2 Mbps
      latency: 300,                              // 300ms latency
    });

    const page = context.pages()[0];

    // Measure page interaction responsiveness
    await page.goto('/');

    const clickStart = Date.now();
    await page.click('button:has-text("Login")');
    const clickDuration = Date.now() - clickStart;

    console.log(`Button click response with 300ms latency: ${clickDuration}ms`);

    // Fill form and measure
    const fillStart = Date.now();
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Test@1234');
    const fillDuration = Date.now() - fillStart;

    console.log(`Form fill time with high latency: ${fillDuration}ms`);

    // Submit and measure
    const submitStart = Date.now();
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*home/, { timeout: 15000 });
    const submitDuration = Date.now() - submitStart;

    console.log(`Form submit time with high latency: ${submitDuration}ms`);

    // UI should remain responsive despite high latency
    expect(clickDuration).toBeLessThan(500);

    await context.close();
  });

  test('Network bandwidth fluctuation during playback', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const cdpSession = await context.newCDPSession(page);

    await cdpSession.send('Network.enable');

    // Login and start playback
    await page.goto('/');
    await page.click('button:has-text("Login")');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Test@1234');
    await page.click('button[type="submit"]');
    await page.click('a[href="/livetv"]');
    await page.click('[data-testid="channel-item"]:first-child');

    await page.waitForTimeout(3000);

    const qualityChanges = [];

    // Fluctuate bandwidth over 60 seconds
    const profiles = ['Fast 4G', 'Slow 4G', 'Slow 3G', 'Slow 4G', 'Fast 4G'];

    for (const profileName of profiles) {
      console.log(`Switching to ${profileName}...`);
      await cdpSession.send('Network.emulateNetworkConditions', NETWORK_PROFILES[profileName]);

      await page.waitForTimeout(12000); // 12 seconds per profile

      // Check current video quality
      const quality = await page.evaluate(() => {
        const video = document.querySelector('video');
        return video ? {
          width: video.videoWidth,
          height: video.videoHeight,
        } : null;
      });

      qualityChanges.push({
        profile: profileName,
        quality: quality
      });

      console.log(`Quality on ${profileName}:`, quality);
    }

    // Check if video is still playing
    const stillPlaying = await page.evaluate(() => {
      const video = document.querySelector('video');
      return video && !video.paused && video.currentTime > 0;
    });

    console.log('Video still playing after bandwidth changes:', stillPlaying);
    console.log('Quality changes:', qualityChanges);

    expect(stillPlaying).toBe(true);

    await context.close();
  });

  test('Packet loss simulation', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const cdpSession = await context.newCDPSession(page);

    await cdpSession.send('Network.enable');

    // Simulate 5% packet loss with moderate bandwidth
    await cdpSession.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 5 * 1024 * 1024 / 8,
      uploadThroughput: 2 * 1024 * 1024 / 8,
      latency: 100,
      // Note: Playwright doesn't directly support packet loss,
      // but we can simulate degraded conditions
    });

    // Login and play video
    await page.goto('/');
    await page.click('button:has-text("Login")');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Test@1234');
    await page.click('button[type="submit"]');
    await page.click('a[href="/livetv"]');
    await page.click('[data-testid="channel-item"]:first-child');

    // Monitor for stalls/errors over 30 seconds
    let errorCount = 0;
    const duration = 30000;
    const interval = 2000;
    const start = Date.now();

    while (Date.now() - start < duration) {
      const hasError = await page.evaluate(() => {
        const video = document.querySelector('video');
        return video ? video.error !== null : false;
      });

      if (hasError) errorCount++;

      await page.waitForTimeout(interval);
    }

    console.log(`Errors during packet loss simulation: ${errorCount}`);

    // Should handle some degradation gracefully
    expect(errorCount).toBeLessThan(5);

    await context.close();
  });

  test('Download speed measurement', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Monitor network requests
    const downloadedBytes = [];
    const startTime = Date.now();

    page.on('response', async (response) => {
      const url = response.url();

      // Track video segment downloads
      if (url.includes('.m3u8') || url.includes('.ts') || url.includes('.mp4')) {
        const headers = response.headers();
        const contentLength = headers['content-length'];

        if (contentLength) {
          downloadedBytes.push({
            time: Date.now() - startTime,
            bytes: parseInt(contentLength),
            url: url
          });
        }
      }
    });

    // Login and play video
    await page.goto('/');
    await page.click('button:has-text("Login")');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Test@1234');
    await page.click('button[type="submit"]');
    await page.click('a[href="/livetv"]');
    await page.click('[data-testid="channel-item"]:first-child');

    // Monitor for 30 seconds
    await page.waitForTimeout(30000);

    // Calculate download speed
    const totalBytes = downloadedBytes.reduce((sum, item) => sum + item.bytes, 0);
    const totalTime = 30; // seconds
    const speedMbps = (totalBytes * 8) / (totalTime * 1024 * 1024);

    console.log(`Total downloaded: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Average speed: ${speedMbps.toFixed(2)} Mbps`);
    console.log(`Segments downloaded: ${downloadedBytes.length}`);

    await context.close();
  });

});
