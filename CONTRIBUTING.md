# Contributing to OTT / IPTV QA Test Suite

Thank you for your interest in contributing to this QA testing project!

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/IPTV-TestQA.git
   cd IPTV-TestQA
   ```

3. **Install dependencies**
   ```bash
   npm install
   npx playwright install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## Project Structure

Understand the project layout before contributing:

- `docs/` - Documentation (PRD, Test Plans, QA Strategy)
- `test-cases/` - Manual and regression test cases
- `automation/` - Automated test scripts (Playwright, Cypress)
- `bug-reports/` - Bug tracking and reports
- `performance-tests/` - Performance testing scripts
- `network-tests/` - Network simulation tests

## How to Contribute

### Adding Test Cases

1. Create test cases following the template in `test-cases/manual/Test_Cases_Template.md`
2. Use clear, descriptive test case IDs (e.g., TC-101, TC-202)
3. Include all required fields: steps, expected results, priority
4. Add to appropriate category (Auth, Live TV, VOD, etc.)

### Writing Automated Tests

1. Follow the existing test structure in `automation/playwright/tests/`
2. Use descriptive test names with tags: `@smoke`, `@regression`
3. Follow the Page Object Model pattern
4. Add appropriate assertions and error handling
5. Run tests locally before submitting

```bash
# Run specific test
npm run test:playwright -- tests/auth/login.spec.js

# Run with UI
npm run test:playwright:ui
```

### Reporting Bugs

1. Use the bug report template in `bug-reports/Bug_Report_Template.md`
2. Provide clear reproduction steps
3. Include screenshots or video recordings
4. Specify environment details (browser, OS, version)
5. Assign appropriate severity and priority

### Updating Documentation

1. Keep documentation up-to-date with code changes
2. Use clear, professional language
3. Include examples where helpful
4. Update version numbers and dates

## Code Standards

### Test Code

- Use meaningful variable and function names
- Add comments for complex logic
- Keep tests independent and isolated
- Use `test.describe()` to group related tests
- Clean up test data after execution

### Commit Messages

Follow conventional commit format:

```
type(scope): brief description

Detailed explanation if needed

Examples:
feat(auth): add password reset test cases
fix(livetv): correct channel switching test timing
docs(readme): update installation instructions
test(vod): add subtitle toggle automation
```

Types:
- `feat`: New feature or test
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `refactor`: Code refactoring
- `chore`: Maintenance tasks

## Pull Request Process

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clear, focused commits
   - Follow project conventions
   - Add or update tests as needed

3. **Test your changes**
   ```bash
   npm run lint
   npm test
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**
   - Provide clear description of changes
   - Reference related issues
   - Include test results if applicable

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated if needed
- [ ] Commit messages are clear
- [ ] PR description explains changes
- [ ] No sensitive data included

## Testing Guidelines

### Writing Good Tests

1. **Clear and Focused**
   - One test should verify one thing
   - Test name describes what is being tested
   - Use descriptive assertions

2. **Independent**
   - Tests should not depend on each other
   - Each test should set up its own data
   - Clean up after test execution

3. **Maintainable**
   - Use Page Object Model
   - Avoid hardcoded values
   - Use test data files or fixtures

4. **Reliable**
   - No random failures (flakiness)
   - Proper waits and assertions
   - Handle timing issues correctly

### Test Organization

```
automation/playwright/tests/
├── auth/
│   ├── login.spec.js
│   └── logout.spec.js
├── livetv/
│   ├── channel-playback.spec.js
│   └── channel-list.spec.js
├── vod/
│   ├── playback.spec.js
│   └── resume.spec.js
└── helpers/
    ├── test-data.js
    └── utils.js
```

## Performance Testing

When adding performance tests:

1. Define clear performance targets
2. Run tests multiple times for consistency
3. Document test methodology
4. Include both average and percentile metrics

## Network Testing

For network resilience tests:

1. Use predefined network profiles
2. Test both degradation and recovery
3. Verify graceful fallback behavior
4. Document expected behavior per profile

## Review Process

All contributions go through review:

1. **Automated Checks**
   - Linting passes
   - Tests pass
   - No security vulnerabilities

2. **Code Review**
   - At least one approving review required
   - Address all feedback
   - Maintain professional communication

3. **QA Review**
   - Test coverage adequate
   - Test quality meets standards
   - Documentation complete

## Community Guidelines

- Be respectful and professional
- Provide constructive feedback
- Help others learn and grow
- Follow the code of conduct

## Questions?

If you have questions:

- Check existing documentation
- Review closed issues and PRs
- Open a discussion issue
- Ask in project communication channels

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

---

**Thank you for contributing to better OTT/IPTV testing practices!**
