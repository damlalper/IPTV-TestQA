# Quick Reference Guide

Quick commands and references for the OTT/IPTV QA Test Project.

---

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Install dependencies
npm install

# 2. Install browsers
npx playwright install

# 3. Copy environment file
cp .env.example .env

# 4. Run smoke tests
npm run test:smoke

# 5. View report
npm run report
```

---

## 📝 Common Commands

### Testing

```bash
# Run all tests
npm test

# Run smoke tests
npm run test:smoke

# Run regression tests
npm run test:regression

# Run with UI mode
npm run test:playwright:ui

# Run in headed mode (see browser)
npm run test:playwright:headed

# Debug mode
npm run test:playwright:debug
```

### Module-Specific Tests

```bash
npm run test:regression:auth        # Authentication tests
npm run test:regression:livetv      # Live TV tests
npm run test:regression:vod         # VOD tests
npm run test:regression:search      # Search tests
```

### Cross-Browser Tests

```bash
npm run test:regression:crossbrowser
```

### Reports

```bash
npm run report                      # View HTML report
```

### Code Quality

```bash
npm run lint                        # Check code quality
npm run lint -- --fix               # Auto-fix issues
npm run format                      # Format code
```

---

## 📂 File Locations

```
📁 Documentation
├── docs/PRD.md                     # Product Requirements
├── docs/Test_Plan.md               # Test Plan
├── docs/QA_Strategy.md             # QA Strategy
└── docs/Release_Report.md          # Release Template

📁 Test Cases
├── test-cases/manual/              # Manual test cases
└── test-cases/regression/          # Regression suite

📁 Automation
├── automation/playwright/tests/    # Test files
└── automation/playwright/pages/    # Page Objects

📁 Bug Reports
└── bug-reports/                    # Bug templates & reports

📁 Configuration
├── package.json                    # Dependencies & scripts
├── playwright.config.js            # Playwright config
└── .env                           # Environment variables
```

---

## 🎯 Test Tags

Use tags to run specific test groups:

```bash
# Run by tag
npx playwright test --grep @smoke
npx playwright test --grep @regression
npx playwright test --grep @critical
npx playwright test --grep @performance
```

### Available Tags
- `@smoke` - Critical path tests
- `@regression` - Regression tests
- `@critical` - Critical priority
- `@performance` - Performance tests
- `@stability` - Stability tests
- `@accessibility` - Accessibility tests

---

## 🔧 Configuration

### Environment Variables (.env)

```env
BASE_URL=http://localhost:3000
TEST_USER_EMAIL=testuser@example.com
TEST_USER_PASSWORD=Test@1234
```

### Playwright Config

Key settings in `playwright.config.js`:
- `timeout: 30000` - Test timeout (30s)
- `retries: 2` - Retry failed tests twice (CI)
- `workers: 4` - Parallel workers
- `projects: [...]` - Browser configurations

---

## 🐛 Debugging

### Debug Single Test

```bash
npx playwright test tests/auth/login.spec.js --debug
```

### Debug Specific Test

```bash
npx playwright test --grep "should login successfully" --debug
```

### Headed Mode

```bash
npm run test:playwright:headed
```

### Slow Motion

```bash
npx playwright test --headed --slow-mo=1000
```

---

## 📊 Test Structure

### Test File Template

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Feature Name', () => {

  test.beforeEach(async ({ page }) => {
    // Setup
    await page.goto('/');
  });

  test('should do something @smoke @regression', async ({ page }) => {
    // Test code
    await expect(page).toHaveTitle(/Expected Title/);
  });

});
```

### Page Object Template

```javascript
class PageName {
  constructor(page) {
    this.page = page;
    this.element = page.locator('selector');
  }

  async action() {
    await this.element.click();
  }
}

module.exports = { PageName };
```

---

## 🎨 Test Case Format

```markdown
### TC-XXX: Test Case Title
- **Feature:** Module Name
- **Priority:** Critical/High/Medium/Low
- **Test Type:** Functional/Regression/Smoke

**Test Steps:**
1. Step one
2. Step two

**Expected Result:**
What should happen

**Status:** Pass/Fail/Blocked
```

---

## 🐞 Bug Report Format

```markdown
**Bug ID:** BUG-XXX
**Severity:** Critical/High/Medium/Low
**Priority:** P0/P1/P2/P3

**Steps to Reproduce:**
1. Step one
2. Step two

**Expected:** What should happen
**Actual:** What actually happens
```

---

## 📈 Performance Targets

| Metric | Target |
|--------|--------|
| Video Startup | < 2 seconds |
| Channel Zap | < 1 second |
| Page Load | < 3 seconds |
| Buffering Rate | < 5% |

---

## 🌐 Supported Browsers

- ✅ Chrome (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Edge (latest 2 versions)
- ✅ Safari (latest 2 versions)

---

## 🔗 Useful Links

### Documentation
- [README](README.md)
- [Setup Guide](SETUP_GUIDE.md)
- [Contributing](CONTRIBUTING.md)
- [Project Summary](PROJECT_SUMMARY.md)

### External Resources
- [Playwright Docs](https://playwright.dev/)
- [Cypress Docs](https://www.cypress.io/)
- [Node.js Docs](https://nodejs.org/)

---

## 💡 Tips & Tricks

### 1. Run Tests in Parallel

```bash
npx playwright test --workers=4
```

### 2. Run Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
```

### 3. Update Snapshots

```bash
npx playwright test --update-snapshots
```

### 4. Generate Test Code

```bash
npx playwright codegen https://example.com
```

### 5. View Trace

```bash
npx playwright show-trace test-results/trace.zip
```

---

## 🚨 Troubleshooting

### Tests Failing?

1. Check browser installation: `npx playwright install`
2. Update dependencies: `npm install`
3. Check `.env` configuration
4. Run in debug mode: `npm run test:playwright:debug`

### Slow Tests?

1. Increase timeout in config
2. Use parallel execution
3. Check network connection
4. Optimize waits and assertions

### Flaky Tests?

1. Add proper wait conditions
2. Use stable selectors (data-testid)
3. Implement retry logic
4. Check for race conditions

---

## 📞 Getting Help

1. Check [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. Review [Playwright Docs](https://playwright.dev/)
3. Check project issues on GitHub
4. Contact: Damla Alper (QA Engineer)

---

## ✅ Daily Workflow

### Morning
```bash
git pull                    # Get latest changes
npm install                 # Update dependencies
npm run test:smoke          # Quick health check
```

### Development
```bash
# Write tests
npm run test:playwright:ui  # Test with UI
npm run lint                # Check code quality
```

### Before Commit
```bash
npm run lint                # Lint code
npm test                    # Run all tests
git add .                   # Stage changes
git commit -m "message"     # Commit
git push                    # Push changes
```

---

## 🎓 Learning Path

1. ✅ Setup project (you're here!)
2. 📖 Read Test Plan
3. 🧪 Run existing tests
4. 📝 Review test cases
5. 🤖 Write first test
6. 🐛 Report first bug
7. 🚀 Contribute!

---

**Need more details? See [SETUP_GUIDE.md](SETUP_GUIDE.md)**
