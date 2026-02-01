# Setup Guide - OTT / IPTV QA Test Project

## Quick Start Guide

This guide will help you set up and run the OTT/IPTV QA Test Suite on your local machine.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** v9 or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **VS Code** (recommended) ([Download](https://code.visualstudio.com/))

### Verify Installation

```bash
node --version   # Should show v18.x or higher
npm --version    # Should show 9.x or higher
git --version    # Should show git version 2.x or higher
```

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/IPTV-TestQA.git
cd IPTV-TestQA
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- Playwright (test automation framework)
- Cypress (alternative test framework)
- ESLint (code linting)
- Prettier (code formatting)
- Other testing utilities

### 3. Install Browser Binaries

Playwright requires browser binaries to run tests:

```bash
npx playwright install
```

This installs Chromium, Firefox, and WebKit browsers.

For a specific browser only:
```bash
npx playwright install chromium
```

### 4. Set Up Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` and configure your settings:

```env
BASE_URL=http://localhost:3000
TEST_USER_EMAIL=testuser@example.com
TEST_USER_PASSWORD=Test@1234
```

---

## Project Structure Overview

```
IPTV-TestQA/
├── .github/
│   └── workflows/              # CI/CD workflows
├── automation/
│   ├── playwright/
│   │   ├── pages/              # Page Object Models
│   │   └── tests/              # Test specifications
│   └── cypress/                # Cypress tests (optional)
├── bug-reports/                # Bug tracking
├── docs/                       # Documentation
│   ├── PRD.md
│   ├── Test_Plan.md
│   ├── QA_Strategy.md
│   └── Release_Report.md
├── performance-tests/          # Performance testing
├── network-tests/              # Network simulation tests
├── test-cases/
│   ├── manual/                 # Manual test cases
│   └── regression/             # Regression test suite
├── .env.example                # Environment template
├── .gitignore
├── CONTRIBUTING.md
├── package.json
├── playwright.config.js
├── README.md
└── SETUP_GUIDE.md             # This file
```

---

## Running Tests

### Playwright Tests

#### Run All Tests
```bash
npm test
# or
npm run test:playwright
```

#### Run Tests with UI
```bash
npm run test:playwright:ui
```

#### Run Tests in Headed Mode (see browser)
```bash
npm run test:playwright:headed
```

#### Run Specific Test File
```bash
npx playwright test tests/auth/login.spec.js
```

#### Run Tests by Tag
```bash
# Smoke tests only
npm run test:smoke

# Regression tests only
npm run test:regression
```

#### Run Tests by Module
```bash
npm run test:regression:auth
npm run test:regression:livetv
npm run test:regression:vod
npm run test:regression:search
```

#### Cross-Browser Testing
```bash
npm run test:regression:crossbrowser
```

#### Debug Mode
```bash
npm run test:playwright:debug
```

### View Test Reports

After test execution, view HTML reports:

```bash
npm run report
```

This opens the Playwright HTML report in your browser.

---

## Cypress Tests (Optional)

### Open Cypress Test Runner
```bash
npm run test:cypress:open
```

### Run Cypress Tests Headless
```bash
npm run test:cypress
```

---

## Code Quality

### Linting

Check code quality:
```bash
npm run lint
```

Fix linting issues automatically:
```bash
npm run lint -- --fix
```

### Formatting

Format code with Prettier:
```bash
npm run format
```

---

## Performance Testing

### Lighthouse Performance Audit

```bash
npm run test:lighthouse
```

Results saved to: `performance-tests/lighthouse-report.html`

### k6 Load Testing

Install k6 first: [k6 Installation](https://k6.io/docs/getting-started/installation/)

```bash
npm run test:k6
```

---

## Network Testing

Run tests under different network conditions:

```bash
npm run test:network
```

---

## Writing Your First Test

### 1. Create a Test File

Create `automation/playwright/tests/example/my-first-test.spec.js`:

```javascript
const { test, expect } = require('@playwright/test');

test.describe('My First Test Suite', () => {

  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/OTT IPTV/);
  });

});
```

### 2. Run Your Test

```bash
npx playwright test tests/example/my-first-test.spec.js
```

### 3. View Results

```bash
npm run report
```

---

## Common Issues and Solutions

### Issue: "Playwright browsers not installed"

**Solution:**
```bash
npx playwright install
```

### Issue: "Port 3000 already in use"

**Solution:**
Update `BASE_URL` in `.env` to a different port or stop the conflicting process.

### Issue: "Tests timing out"

**Solution:**
Increase timeout in `playwright.config.js`:
```javascript
timeout: 60 * 1000, // 60 seconds
```

### Issue: "Cannot find module"

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Tests flaky or failing randomly"

**Solution:**
- Use proper wait strategies
- Increase action timeout
- Check for race conditions
- Use `test.describe.configure({ retries: 2 })`

---

## Best Practices

### 1. Use Page Object Model

Create page objects for reusable components:

```javascript
// pages/HomePage.js
class HomePage {
  constructor(page) {
    this.page = page;
    this.loginButton = page.locator('button:has-text("Login")');
  }

  async goto() {
    await this.page.goto('/');
  }
}
```

### 2. Use Test Tags

Tag tests for better organization:

```javascript
test('login test @smoke @regression', async ({ page }) => {
  // test code
});
```

Run tagged tests:
```bash
npx playwright test --grep @smoke
```

### 3. Use Test Fixtures

Create reusable test data:

```javascript
test.beforeEach(async ({ page }) => {
  // Login before each test
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');
});
```

### 4. Use Proper Assertions

```javascript
// Good
await expect(page.locator('#username')).toBeVisible();

// Not as good
const isVisible = await page.locator('#username').isVisible();
expect(isVisible).toBe(true);
```

---

## CI/CD Integration

Tests automatically run on:
- Every push to `main` or `develop` branches
- Every pull request
- Scheduled daily runs (2 AM UTC)

View results in GitHub Actions tab.

---

## Documentation

Read the documentation for detailed information:

- [Product Requirements Document](docs/PRD.md)
- [Test Plan](docs/Test_Plan.md)
- [QA Strategy](docs/QA_Strategy.md)
- [Contributing Guidelines](CONTRIBUTING.md)

---

## VS Code Setup (Recommended)

### Install Extensions

1. **Playwright Test for VSCode** - Test runner integration
2. **ESLint** - Code linting
3. **Prettier** - Code formatting
4. **GitLens** - Git integration

### Recommended Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript"],
  "playwright.reuseBrowser": true
}
```

---

## Getting Help

### Resources

- [Playwright Documentation](https://playwright.dev/)
- [Cypress Documentation](https://www.cypress.io/)
- [Project README](README.md)

### Troubleshooting

1. Check existing issues in GitHub
2. Review documentation
3. Run tests in debug mode
4. Check browser console for errors

### Contact

For questions or issues:
- Open an issue on GitHub
- Contact: Damla Alper (QA Engineer)

---

## Next Steps

1. ✅ Complete setup (you're here!)
2. 📖 Read the [Test Plan](docs/Test_Plan.md)
3. 🧪 Run your first test
4. 📝 Review [test cases](test-cases/manual/Test_Cases_Template.md)
5. 🤖 Write automated tests
6. 🐛 Report bugs using [template](bug-reports/Bug_Report_Template.md)
7. 🚀 Contribute! See [CONTRIBUTING.md](CONTRIBUTING.md)

---

**Happy Testing! 🎉**
