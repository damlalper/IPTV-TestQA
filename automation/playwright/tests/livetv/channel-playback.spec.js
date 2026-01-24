const { test, expect } = require('@playwright/test');

/**
 * Live TV Tests - Channel Playback
 * Test Suite: RT-201 to RT-205
 */

test.describe('Live TV - Channel Playback', () => {

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.click('button:has-text("Login")');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Test@1234');
    await page.click('button[type="submit"]');

    // Navigate to Live TV section
    await page.click('a[href="/livetv"]');
    await expect(page).toHaveURL(/.*livetv/);
  });

  test('RT-201: Channel list display @smoke @regression', async ({ page }) => {
    // Test Case: Display list of available live channels

    // Wait for channel list to load
    await page.waitForSelector('[data-testid="channel-list"]', { timeout: 5000 });

    // Verify channel list is visible
    const channelList = page.locator('[data-testid="channel-list"]');
    await expect(channelList).toBeVisible();

    // Verify channels are displayed
    const channels = page.locator('[data-testid="channel-item"]');
    const channelCount = await channels.count();
    expect(channelCount).toBeGreaterThan(0);

    // Verify each channel has thumbnail and title
    const firstChannel = channels.first();
    await expect(firstChannel.locator('[data-testid="channel-thumbnail"]')).toBeVisible();
    await expect(firstChannel.locator('[data-testid="channel-title"]')).toBeVisible();

    // Verify EPG data is shown
    await expect(firstChannel.locator('[data-testid="channel-epg"]')).toBeVisible();
  });

  test('RT-202: Play live channel @smoke @regression @critical', async ({ page }) => {
    // Test Case: User plays a live channel

    const startTime = Date.now();

    // Click on first channel
    await page.click('[data-testid="channel-item"]:first-child');

    // Wait for video player to appear
    await page.waitForSelector('video', { timeout: 5000 });

    // Verify video player is visible
    const videoPlayer = page.locator('video');
    await expect(videoPlayer).toBeVisible();

    // Wait for video to start playing
    await page.waitForFunction(() => {
      const video = document.querySelector('video');
      return video && video.currentTime > 0 && !video.paused;
    }, { timeout: 5000 });

    const endTime = Date.now();
    const startupTime = endTime - startTime;

    // Verify startup time is within acceptable range (< 2000ms)
    console.log(`Video startup time: ${startupTime}ms`);
    expect(startupTime).toBeLessThan(2000);

    // Verify video is playing
    const isPaused = await videoPlayer.evaluate(video => video.paused);
    expect(isPaused).toBe(false);
  });

  test('RT-203: Channel switching (zapping) @regression @performance', async ({ page }) => {
    // Test Case: User switches between channels quickly

    // Play first channel
    await page.click('[data-testid="channel-item"]:nth-child(1)');
    await page.waitForSelector('video', { timeout: 5000 });
    await page.waitForTimeout(2000); // Let video stabilize

    const zapTimes = [];

    // Switch between 3 channels
    for (let i = 2; i <= 4; i++) {
      const startTime = Date.now();

      // Switch to next channel
      await page.click(`[data-testid="channel-item"]:nth-child(${i})`);

      // Wait for new video to start
      await page.waitForFunction(() => {
        const video = document.querySelector('video');
        return video && video.currentTime > 0 && !video.paused;
      }, { timeout: 3000 });

      const endTime = Date.now();
      const zapTime = endTime - startTime;
      zapTimes.push(zapTime);

      console.log(`Channel zap ${i-1} time: ${zapTime}ms`);
      await page.waitForTimeout(1000); // Brief pause between zaps
    }

    // Calculate average zap time
    const avgZapTime = zapTimes.reduce((a, b) => a + b, 0) / zapTimes.length;
    console.log(`Average zap time: ${avgZapTime}ms`);

    // Verify average zap time is within acceptable range (< 1000ms)
    expect(avgZapTime).toBeLessThan(1000);
  });

  test('RT-204: Video controls @regression', async ({ page }) => {
    // Test Case: Video playback controls work correctly

    // Play a channel
    await page.click('[data-testid="channel-item"]:first-child');
    await page.waitForSelector('video', { timeout: 5000 });

    const videoPlayer = page.locator('video');

    // Test pause
    await page.click('[data-testid="play-pause-button"]');
    await page.waitForTimeout(500);
    let isPaused = await videoPlayer.evaluate(video => video.paused);
    expect(isPaused).toBe(true);

    // Test play
    await page.click('[data-testid="play-pause-button"]');
    await page.waitForTimeout(500);
    isPaused = await videoPlayer.evaluate(video => video.paused);
    expect(isPaused).toBe(false);

    // Test volume control
    const initialVolume = await videoPlayer.evaluate(video => video.volume);
    await page.click('[data-testid="volume-button"]');
    await page.fill('[data-testid="volume-slider"]', '0.5');
    const newVolume = await videoPlayer.evaluate(video => video.volume);
    expect(newVolume).toBeLessThan(initialVolume);

    // Test mute
    await page.click('[data-testid="mute-button"]');
    const isMuted = await videoPlayer.evaluate(video => video.muted);
    expect(isMuted).toBe(true);

    // Test fullscreen toggle
    await page.click('[data-testid="fullscreen-button"]');
    await page.waitForTimeout(500);
    const isFullscreen = await page.evaluate(() => !!document.fullscreenElement);
    expect(isFullscreen).toBe(true);
  });

  test('RT-205: Stream stability @regression @stability', async ({ page }) => {
    // Test Case: Verify stream stability over extended period

    // Play a channel
    await page.click('[data-testid="channel-item"]:first-child');
    await page.waitForSelector('video', { timeout: 5000 });

    const videoPlayer = page.locator('video');

    // Monitor playback for 5 minutes (reduced from 30 for test efficiency)
    const monitorDuration = 5 * 60 * 1000; // 5 minutes
    const checkInterval = 10 * 1000; // Check every 10 seconds
    const startTime = Date.now();

    let bufferingEvents = 0;
    let errorEvents = 0;

    while (Date.now() - startTime < monitorDuration) {
      await page.waitForTimeout(checkInterval);

      // Check if video is still playing
      const isPlaying = await videoPlayer.evaluate(video => !video.paused && video.currentTime > 0);

      if (!isPlaying) {
        bufferingEvents++;
        console.log(`Buffering event detected at ${Date.now() - startTime}ms`);
      }

      // Check for errors
      const hasError = await videoPlayer.evaluate(video => video.error !== null);
      if (hasError) {
        errorEvents++;
        console.log(`Error detected at ${Date.now() - startTime}ms`);
      }

      // Check audio/video sync (if API available)
      // This would require more sophisticated checking in real implementation
    }

    // Calculate buffering percentage
    const totalChecks = monitorDuration / checkInterval;
    const bufferingPercentage = (bufferingEvents / totalChecks) * 100;

    console.log(`Buffering events: ${bufferingEvents} (${bufferingPercentage.toFixed(2)}%)`);
    console.log(`Error events: ${errorEvents}`);

    // Verify stability (< 5% buffering, no errors)
    expect(bufferingPercentage).toBeLessThan(5);
    expect(errorEvents).toBe(0);
  });

  test('EPG information display @regression', async ({ page }) => {
    // Test Case: Electronic Program Guide data is accurate

    // Check EPG on channel list
    const firstChannel = page.locator('[data-testid="channel-item"]').first();
    const epgInfo = firstChannel.locator('[data-testid="channel-epg"]');

    await expect(epgInfo).toBeVisible();

    // EPG should contain program title and time
    const epgText = await epgInfo.textContent();
    expect(epgText).toBeTruthy();
    expect(epgText.length).toBeGreaterThan(0);

    // Open player
    await page.click('[data-testid="channel-item"]:first-child');
    await page.waitForSelector('video', { timeout: 5000 });

    // Verify EPG in player view
    const playerEpg = page.locator('[data-testid="player-epg"]');
    await expect(playerEpg).toBeVisible();
  });

  test('Channel navigation with keyboard @regression @accessibility', async ({ page }) => {
    // Test Case: Navigate channels using keyboard

    await page.focus('[data-testid="channel-list"]');

    // Press arrow down to select next channel
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(500);

    // Press Enter to play
    await page.keyboard.press('Enter');
    await page.waitForSelector('video', { timeout: 5000 });

    // Verify video is playing
    const videoPlayer = page.locator('video');
    await expect(videoPlayer).toBeVisible();
  });
});
