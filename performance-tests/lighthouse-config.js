/**
 * Lighthouse Performance Testing Configuration
 * Used for automated performance audits
 */

module.exports = {
  extends: 'lighthouse:default',

  settings: {
    // Performance budget thresholds
    budgets: [
      {
        resourceSizes: [
          {
            resourceType: 'script',
            budget: 300 // KB
          },
          {
            resourceType: 'image',
            budget: 500 // KB
          },
          {
            resourceType: 'total',
            budget: 1000 // KB
          }
        ],
        timings: [
          {
            metric: 'first-contentful-paint',
            budget: 1500 // ms
          },
          {
            metric: 'interactive',
            budget: 3000 // ms
          },
          {
            metric: 'speed-index',
            budget: 2500 // ms
          }
        ]
      }
    ],

    // Only run specific audits for OTT/IPTV focus
    onlyCategories: ['performance', 'accessibility'],

    // Screen emulation settings
    screenEmulation: {
      mobile: false,
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      disabled: false
    },

    // Throttling to simulate real-world conditions
    throttling: {
      rttMs: 40,
      throughputKbps: 10 * 1024, // 10 Mbps
      cpuSlowdownMultiplier: 1
    }
  },

  // Custom audit passes
  passes: [
    {
      passName: 'defaultPass',
      recordTrace: true,
      useThrottling: true,
      networkQuietThresholdMs: 5000
    }
  ],

  // Audit configuration
  audits: [
    'first-contentful-paint',
    'largest-contentful-paint',
    'first-meaningful-paint',
    'speed-index',
    'interactive',
    'total-blocking-time',
    'cumulative-layout-shift',
    'network-requests',
    'metrics'
  ]
};
