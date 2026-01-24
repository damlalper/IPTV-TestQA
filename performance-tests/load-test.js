/**
 * k6 Load Testing Script
 * Tests concurrent user load on OTT/IPTV application
 *
 * Run with: k6 run load-test.js
 *
 * Installation: https://k6.io/docs/getting-started/installation/
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const loginDuration = new Trend('login_duration');
const videoLoadDuration = new Trend('video_load_duration');
const apiCalls = new Counter('api_calls');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up to 50 users over 2 minutes
    { duration: '5m', target: 50 },   // Stay at 50 users for 5 minutes
    { duration: '2m', target: 100 },  // Ramp up to 100 users over 2 minutes
    { duration: '5m', target: 100 },  // Stay at 100 users for 5 minutes
    { duration: '2m', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete below 2s
    http_req_failed: ['rate<0.1'],      // Error rate must be below 10%
    errors: ['rate<0.1'],               // Custom error rate below 10%
    login_duration: ['p(95)<3000'],     // Login must complete below 3s for 95% of requests
    video_load_duration: ['p(95)<2000'], // Video load below 2s for 95% of requests
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const API_URL = __ENV.API_BASE_URL || 'http://localhost:4000/api';

// Test data
const TEST_USER = {
  email: __ENV.TEST_USER_EMAIL || 'testuser@example.com',
  password: __ENV.TEST_USER_PASSWORD || 'Test@1234'
};

/**
 * Main test scenario
 */
export default function () {
  // 1. Load home page
  let res = http.get(`${BASE_URL}/`);
  check(res, {
    'homepage loaded': (r) => r.status === 200,
    'homepage load time OK': (r) => r.timings.duration < 3000,
  }) || errorRate.add(1);

  sleep(1);

  // 2. Login
  const loginStart = Date.now();
  res = http.post(`${API_URL}/auth/login`, JSON.stringify(TEST_USER), {
    headers: { 'Content-Type': 'application/json' },
  });

  const loginSuccess = check(res, {
    'login successful': (r) => r.status === 200,
    'login returns token': (r) => r.json('token') !== undefined,
  });

  if (!loginSuccess) {
    errorRate.add(1);
    return; // Stop test if login fails
  }

  const loginTime = Date.now() - loginStart;
  loginDuration.add(loginTime);

  const token = res.json('token');
  apiCalls.add(1);

  sleep(2);

  // 3. Load channel list
  res = http.get(`${API_URL}/channels`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  check(res, {
    'channels loaded': (r) => r.status === 200,
    'channels returned': (r) => r.json('channels').length > 0,
  }) || errorRate.add(1);

  apiCalls.add(1);
  sleep(1);

  // 4. Load a specific channel stream
  const videoLoadStart = Date.now();
  const channelId = res.json('channels.0.id') || '101';

  res = http.get(`${API_URL}/channels/${channelId}/stream`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  check(res, {
    'stream URL received': (r) => r.status === 200,
    'stream URL valid': (r) => r.json('streamUrl') !== undefined,
  }) || errorRate.add(1);

  const videoLoadTime = Date.now() - videoLoadStart;
  videoLoadDuration.add(videoLoadTime);
  apiCalls.add(1);

  sleep(3);

  // 5. Search for content
  res = http.get(`${API_URL}/search?q=sports`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  check(res, {
    'search completed': (r) => r.status === 200,
  }) || errorRate.add(1);

  apiCalls.add(1);
  sleep(2);

  // 6. Load VOD catalog
  res = http.get(`${API_URL}/vod`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  check(res, {
    'VOD catalog loaded': (r) => r.status === 200,
  }) || errorRate.add(1);

  apiCalls.add(1);
  sleep(1);

  // 7. Load user favorites
  res = http.get(`${API_URL}/user/favorites`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  check(res, {
    'favorites loaded': (r) => r.status === 200,
  }) || errorRate.add(1);

  apiCalls.add(1);
  sleep(2);

  // 8. Logout
  res = http.post(`${API_URL}/auth/logout`, null, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  check(res, {
    'logout successful': (r) => r.status === 200,
  }) || errorRate.add(1);

  apiCalls.add(1);
  sleep(1);
}

/**
 * Setup function - runs once before test
 */
export function setup() {
  console.log(`Starting load test against: ${BASE_URL}`);
  console.log('Test configuration:');
  console.log('- Ramp up to 50 users over 2 minutes');
  console.log('- Maintain 50 users for 5 minutes');
  console.log('- Ramp up to 100 users over 2 minutes');
  console.log('- Maintain 100 users for 5 minutes');
  console.log('- Ramp down over 2 minutes');
}

/**
 * Teardown function - runs once after test
 */
export function teardown(data) {
  console.log('Load test completed');
}

/**
 * Custom summary handler
 */
export function handleSummary(data) {
  return {
    'performance-tests/load-test-results.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function textSummary(data, options) {
  const { indent = '', enableColors = false } = options;
  let summary = `
${indent}Load Test Summary
${indent}================

${indent}Scenarios:
${indent}  - Duration: ${data.state.testRunDurationMs / 1000}s
${indent}  - VUs: ${data.metrics.vus.values.max} max

${indent}HTTP Performance:
${indent}  - Requests: ${data.metrics.http_reqs.values.count}
${indent}  - Failed: ${data.metrics.http_req_failed.values.rate * 100}%
${indent}  - Duration (avg): ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms
${indent}  - Duration (p95): ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
${indent}  - Duration (p99): ${data.metrics.http_req_duration.values['p(99)'].toFixed(2)}ms

${indent}Custom Metrics:
${indent}  - Login duration (p95): ${data.metrics.login_duration?.values['p(95)']?.toFixed(2) || 'N/A'}ms
${indent}  - Video load (p95): ${data.metrics.video_load_duration?.values['p(95)']?.toFixed(2) || 'N/A'}ms
${indent}  - Error rate: ${(data.metrics.errors?.values.rate * 100 || 0).toFixed(2)}%
${indent}  - API calls: ${data.metrics.api_calls?.values.count || 0}

${indent}Thresholds:
`;

  for (const [name, threshold] of Object.entries(data.thresholds || {})) {
    const status = threshold.ok ? '✓' : '✗';
    summary += `${indent}  ${status} ${name}\n`;
  }

  return summary;
}
