# Bug Report Template

## Bug Information

**Bug ID:** [AUTO-GENERATED or JIRA-XXX]
**Title:** [Brief, descriptive title]
**Reported By:** [Your Name]
**Date Reported:** [YYYY-MM-DD]
**Status:** [New / Confirmed / In Progress / Fixed / Retested / Closed / Reopened]

---

## Priority and Severity

**Severity:** [Critical / High / Medium / Low]
- **Critical:** Application crash, data loss, core functionality completely broken
- **High:** Major feature not working, significant UX degradation
- **Medium:** Minor feature issue, workaround available
- **Low:** Cosmetic issue, minimal impact

**Priority:** [P0 / P1 / P2 / P3]
- **P0:** Blocks release, must fix immediately
- **P1:** Should fix before release
- **P2:** Fix if time permits
- **P3:** Nice to have

---

## Environment Details

**Application Version:** [e.g., v1.2.3]
**Test Environment:** [Production / Staging / Development]
**Browser:** [Chrome 120 / Firefox 115 / Edge 110 / Safari 17]
**Operating System:** [Windows 11 / macOS Sonoma / Ubuntu 22.04]
**Screen Resolution:** [1920x1080 / 1366x768 / etc.]
**Network Condition:** [Normal / Slow 3G / 4G / etc.]
**Device Type:** [Desktop / Mobile / Tablet]

---

## Bug Description

### Summary
[Provide a clear, concise summary of the issue in 1-2 sentences]

### Detailed Description
[Explain the bug in detail. What happens? What is affected?]

---

## Steps to Reproduce

1. [First step - be specific]
2. [Second step - include data values if applicable]
3. [Third step - mention any preconditions]
4. [Continue with clear, numbered steps]
5. [Final step that triggers the bug]

**Test Data Used:**
- Username: testuser@example.com
- Video ID: 12345
- Channel: Channel Name

---

## Expected Result

[Describe what should happen according to requirements or normal behavior]

---

## Actual Result

[Describe what actually happens. Be specific about error messages, incorrect behavior, etc.]

---

## Visual Evidence

### Screenshots
[Attach screenshots showing the bug]

![Bug Screenshot 1](path/to/screenshot1.png)
![Bug Screenshot 2](path/to/screenshot2.png)

### Video Recording
[If applicable, attach video recording showing the bug reproduction]

Link: [URL to video recording]

### Console Errors
```
[Paste any console errors or logs here]
Example:
TypeError: Cannot read property 'play' of null
    at VideoPlayer.js:42
    at ...
```

---

## Additional Information

**Frequency:** [Always / Intermittent / Rare / Once]

**Reproducibility Rate:** [10/10 tries / 5/10 tries / etc.]

**Workaround Available:** [Yes / No]

**Workaround Steps:**
[If yes, describe the workaround]

**Related Issues:**
- Bug #123 (similar issue)
- Feature #456 (related to this area)

**Root Cause (if known):**
[If you have identified the root cause, describe it here]

**Suggested Fix (optional):**
[If you have suggestions for fixing, include them here]

---

## Browser-Specific Issues

**Affected Browsers:**
- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari

**Not Affected Browsers:**
- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari

---

## Impact Assessment

**User Impact:** [High / Medium / Low]

**Business Impact:**
[Describe how this affects the business, users, or product goals]

**Affected Features:**
- Live TV playback
- VOD playback
- User authentication
- [etc.]

**Number of Users Affected:**
[All users / Premium users / Specific user group / etc.]

---

## Test Data and Configuration

**Configuration Settings:**
```json
{
  "setting1": "value1",
  "setting2": "value2"
}
```

**API Endpoints Involved:**
- POST /api/auth/login
- GET /api/channels
- [etc.]

**Database State (if relevant):**
[Describe any specific database conditions]

---

## Regression Information

**Is this a regression?** [Yes / No]

**Previously Working Version:** [v1.1.0]

**First Broken Version:** [v1.2.0]

**Changelog Reference:**
[Link to changelog or commit that may have introduced the bug]

---

## Attachments

- Console log: `console-log.txt`
- Network trace: `network-trace.har`
- Video recording: `bug-reproduction.mp4`
- Test data: `test-data.json`

---

## Lifecycle History

| Date | Status | Updated By | Comments |
|------|--------|------------|----------|
| 2026-01-25 | New | Damla Alper | Bug reported |
| 2026-01-26 | Confirmed | Dev Team | Reproduced in dev environment |
| 2026-01-27 | In Progress | Developer | Working on fix |
| 2026-01-28 | Fixed | Developer | Fixed in PR #123 |
| 2026-01-29 | Retested | Damla Alper | Verified fix works |
| 2026-01-30 | Closed | Damla Alper | Bug resolved |

---

## Comments and Discussion

### Comment 1 - [Date] - [Name]
[Comment text]

### Comment 2 - [Date] - [Name]
[Comment text]

---

## Verification Steps (For Retesting)

After fix is deployed, verify:
1. [Step to verify fix]
2. [Step to verify no side effects]
3. [Step to verify related functionality]

**Verification Result:** [Pass / Fail]

**Verified By:** [QA Engineer Name]

**Verification Date:** [YYYY-MM-DD]

---

## Labels/Tags

`bug` `livetv` `playback` `p1` `regression` `browser-specific`

---

**Note:** Update this template as needed for your project's specific requirements.
