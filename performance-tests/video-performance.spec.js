const { test, expect } = require('@playwright/test');

/**
 * Video Performance Testing
 * Measures video startup time, buffering, and playback performance
 */

test.describe('Video Performance Tests @performance', () => {

  test('RT-701: Page load performance', async ({ page }) => {
    // Measure page load time
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    console.log(`Page load time: ${loadTime}ms`);

    // Assert page loads within 3 seconds
    expect(loadTime).toBeLessThan(3000);

    // Get performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const perfData = window.performance.timing;
      return {
        dns: perfData.domainLookupEnd - perfData.domainLookupStart,
        tcp: perfData.connectEnd - perfData.connectStart,
        request: perfData.responseStart - perfData.requestStart,
        response: perfData.responseEnd - perfData.responseStart,
        dom: perfData.domComplete - perfData.domLoading,
        loadComplete: perfData.loadEventEnd - perfData.navigationStart
      };
    });

    console.log('Performance Metrics:', performanceMetrics);

    // Verify First Contentful Paint
    const fcp = await page.evaluate(() => {
      const perfEntries = performance.getEntriesByType('paint');
      const fcpEntry = perfEntries.find(entry => entry.name === 'first-contentful-paint');
      return fcpEntry ? fcpEntry.startTime : null;
    });

    if (fcp) {
      console.log(`First Contentful Paint: ${fcp}ms`);
      expect(fcp).toBeLessThan(1500);
    }
  });

  test('RT-702: Video startup latency', async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.click('button:has-text("Login")');
    await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL || 'testuser@example.com');
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD || 'Test@1234');
    await page.click('button[type="submit"]');

    // Navigate to Live TV
    await page.click('a[href="/livetv"]');

    const startupTimes = [];

    // Test 10 different channels
    for (let i = 1; i <= 10; i++) {
      const startTime = performance.now();

      // Click channel
      await page.click(`[data-testid="channel-item"]:nth-child(${i})`);

      // Wait for video to start playing
      await page.waitForFunction(() => {
        const video = document.querySelector('video');
        return video && video.currentTime > 0 && !video.paused;
      }, { timeout: 5000 });

      const endTime = performance.now();
      const startupTime = endTime - startTime;

      startupTimes.push(startupTime);
      console.log(`Channel ${i} startup time: ${startupTime.toFixed(2)}ms`);

      // Small delay between tests
      await page.waitForTimeout(1000);
    }

    // Calculate statistics
    const avgStartupTime = startupTimes.reduce((a, b) => a + b, 0) / startupTimes.length;
    const sortedTimes = [...startupTimes].sort((a, b) => a - b);
    const p95Index = Math.floor(startupTimes.length * 0.95);
    const p95StartupTime = sortedTimes[p95Index];

    console.log(`\nVideo Startup Performance:`);
    console.log(`Average: ${avgStartupTime.toFixed(2)}ms`);
    console.log(`P95: ${p95StartupTime.toFixed(2)}ms`);
    console.log(`Min: ${Math.min(...startupTimes).toFixed(2)}ms`);
    console.log(`Max: ${Math.max(...startupTimes).toFixed(2)}ms`);

    // Assert performance targets
    expect(avgStartupTime).toBeLessThan(2000); // Average < 2s
    expect(p95StartupTime).toBeLessThan(3000); // P95 < 3s
  });

  test('RT-703: Channel zap performance', async ({ page }) => {
    // Login and navigate to Live TV
    await page.goto('/');
    await page.click('button:has-text("Login")');
    await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL || 'testuser@example.com');
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD || 'Test@1234');
    await page.click('button[type="submit"]');
    await page.click('a[href="/livetv"]');

    // Start with first channel
    await page.click('[data-testid="channel-item"]:first-child');
    await page.waitForTimeout(2000); // Let it stabilize

    const zapTimes = [];

    // Test channel switching 5 times
    for (let i = 2; i <= 6; i++) {
      const startTime = performance.now();

      // Switch to next channel
      await page.click(`[data-testid="channel-item"]:nth-child(${i})`);

      // Wait for new video to start
      await page.waitForFunction(() => {
        const video = document.querySelector('video');
        return video && video.currentTime > 0 && !video.paused;
      }, { timeout: 3000 });

      const endTime = performance.now();
      const zapTime = endTime - startTime;

      zapTimes.push(zapTime);
      console.log(`Zap ${i-1} time: ${zapTime.toFixed(2)}ms`);

      await page.waitForTimeout(1000);
    }

    // Calculate average
    const avgZapTime = zapTimes.reduce((a, b) => a + b, 0) / zapTimes.length;

    console.log(`\nChannel Zap Performance:`);
    console.log(`Average: ${avgZapTime.toFixed(2)}ms`);
    console.log(`Min: ${Math.min(...zapTimes).toFixed(2)}ms`);
    console.log(`Max: ${Math.max(...zapTimes).toFixed(2)}ms`);

    // Assert channel zap time < 1 second
    expect(avgZapTime).toBeLessThan(1000);
  });

  test('RT-704: Memory usage monitoring', async ({ page }) => {
    // Login and start video playback
    await page.goto('/');
    await page.click('button:has-text("Login")');
    await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL || 'testuser@example.com');
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD || 'Test@1234');
    await page.click('button[type="submit"]');
    await page.click('a[href="/livetv"]');
    await page.click('[data-testid="channel-item"]:first-child');

    const memorySnapshots = [];
    const duration = 5 * 60 * 1000; // 5 minutes
    const interval = 30 * 1000; // Check every 30 seconds
    const startTime = Date.now();

    while (Date.now() - startTime < duration) {
      // Get memory metrics if available (Chrome only)
      const memoryInfo = await page.evaluate(() => {
        if (performance.memory) {
          return {
            usedJSHeapSize: performance.memory.usedJSHeapSize / (1024 * 1024), // MB
            totalJSHeapSize: performance.memory.totalJSHeapSize / (1024 * 1024), // MB
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit / (1024 * 1024) // MB
          };
        }
        return null;
      });

      if (memoryInfo) {
        memorySnapshots.push({
          time: Date.now() - startTime,
          ...memoryInfo
        });
        console.log(`Memory at ${((Date.now() - startTime) / 1000).toFixed(0)}s: ${memoryInfo.usedJSHeapSize.toFixed(2)} MB`);
      }

      await page.waitForTimeout(interval);
    }

    // Analyze memory trend
    if (memorySnapshots.length > 0) {
      const firstSnapshot = memorySnapshots[0];
      const lastSnapshot = memorySnapshots[memorySnapshots.length - 1];
      const memoryIncrease = lastSnapshot.usedJSHeapSize - firstSnapshot.usedJSHeapSize;
      const memoryIncreasePercent = (memoryIncrease / firstSnapshot.usedJSHeapSize) * 100;

      console.log(`\nMemory Analysis:`);
      console.log(`Initial memory: ${firstSnapshot.usedJSHeapSize.toFixed(2)} MB`);
      console.log(`Final memory: ${lastSnapshot.usedJSHeapSize.toFixed(2)} MB`);
      console.log(`Increase: ${memoryIncrease.toFixed(2)} MB (${memoryIncreasePercent.toFixed(2)}%)`);

      // Memory should not increase more than 50%
      expect(memoryIncreasePercent).toBeLessThan(50);
    }
  });

  test('Buffering rate measurement', async ({ page }) => {
    // Login and start playback
    await page.goto('/');
    await page.click('button:has-text("Login")');
    await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL || 'testuser@example.com');
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD || 'Test@1234');
    await page.click('button[type="submit"]');
    await page.click('a[href="/livetv"]');
    await page.click('[data-testid="channel-item"]:first-child');

    // Monitor buffering for 2 minutes
    const monitorDuration = 2 * 60 * 1000;
    const checkInterval = 1000; // Check every second
    let bufferingCount = 0;
    let totalChecks = 0;

    const startTime = Date.now();

    while (Date.now() - startTime < monitorDuration) {
      const isBuffering = await page.evaluate(() => {
        const video = document.querySelector('video');
        if (!video) return false;

        // Check if video is waiting/buffering
        return video.readyState < 3 && !video.paused && !video.ended;
      });

      totalChecks++;
      if (isBuffering) {
        bufferingCount++;
        console.log(`Buffering detected at ${((Date.now() - startTime) / 1000).toFixed(0)}s`);
      }

      await page.waitForTimeout(checkInterval);
    }

    const bufferingRate = (bufferingCount / totalChecks) * 100;

    console.log(`\nBuffering Analysis:`);
    console.log(`Total checks: ${totalChecks}`);
    console.log(`Buffering events: ${bufferingCount}`);
    console.log(`Buffering rate: ${bufferingRate.toFixed(2)}%`);

    // Buffering rate should be < 5%
    expect(bufferingRate).toBeLessThan(5);
  });

  test('Resource loading performance', async ({ page }) => {
    await page.goto('/');

    // Get all resource timings
    const resourceTimings = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');

      return resources.map(resource => ({
        name: resource.name,
        type: resource.initiatorType,
        duration: resource.duration,
        size: resource.transferSize || 0
      }));
    });

    // Categorize resources
    const resourcesByType = resourceTimings.reduce((acc, resource) => {
      if (!acc[resource.type]) {
        acc[resource.type] = [];
      }
      acc[resource.type].push(resource);
      return acc;
    }, {});

    console.log('\nResource Loading Performance:');

    for (const [type, resources] of Object.entries(resourcesByType)) {
      const totalDuration = resources.reduce((sum, r) => sum + r.duration, 0);
      const totalSize = resources.reduce((sum, r) => sum + r.size, 0);
      const avgDuration = totalDuration / resources.length;

      console.log(`${type}:`);
      console.log(`  Count: ${resources.length}`);
      console.log(`  Total size: ${(totalSize / 1024).toFixed(2)} KB`);
      console.log(`  Avg duration: ${avgDuration.toFixed(2)}ms`);
    }
  });

});
