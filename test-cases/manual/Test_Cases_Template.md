# Manual Test Cases - OTT / IPTV Client

## Test Case Document Information
**Project:** OTT / IPTV Client QA
**Version:** 1.0
**Last Updated:** 2026-01-25
**Author:** Damla Alper

---

## Test Case Format

Each test case follows this structure:

- **TC-ID:** Unique test case identifier
- **Feature:** Feature or module being tested
- **Test Scenario:** High-level scenario description
- **Priority:** Critical / High / Medium / Low
- **Test Type:** Functional / Regression / Smoke / Negative
- **Prerequisites:** Required setup before test execution
- **Test Steps:** Step-by-step actions
- **Expected Result:** Expected outcome
- **Actual Result:** Observed outcome (filled during execution)
- **Status:** Pass / Fail / Blocked / Not Executed
- **Comments:** Additional notes

---

## 1. Authentication Test Cases

### TC-101: Valid User Login
- **Feature:** User Authentication
- **Test Scenario:** User logs in with valid credentials
- **Priority:** Critical
- **Test Type:** Functional, Smoke
- **Prerequisites:** User account exists

**Test Steps:**
1. Navigate to application URL
2. Click "Login" button
3. Enter valid email: `testuser@example.com`
4. Enter valid password: `Test@1234`
5. Click "Submit"

**Expected Result:**
- User successfully logged in
- Redirected to home page
- User name displayed in header

**Actual Result:** _[To be filled during execution]_
**Status:** _[Not Executed]_
**Comments:** _[Any additional notes]_

---

### TC-102: Invalid Credentials Login
- **Feature:** User Authentication
- **Test Scenario:** User attempts login with invalid credentials
- **Priority:** High
- **Test Type:** Negative Testing
- **Prerequisites:** None

**Test Steps:**
1. Navigate to application URL
2. Click "Login" button
3. Enter email: `invalid@example.com`
4. Enter password: `wrongpassword`
5. Click "Submit"

**Expected Result:**
- Login fails with error message
- Error message: "Invalid email or password"
- User remains on login page

**Actual Result:** _[To be filled during execution]_
**Status:** _[Not Executed]_

---

### TC-103: Logout Functionality
- **Feature:** User Authentication
- **Test Scenario:** User logs out successfully
- **Priority:** High
- **Test Type:** Functional
- **Prerequisites:** User is logged in

**Test Steps:**
1. User is logged in
2. Click user profile icon
3. Click "Logout" option
4. Confirm logout if prompted

**Expected Result:**
- User successfully logged out
- Session cleared
- Redirected to login page
- Protected content no longer accessible

**Actual Result:** _[To be filled during execution]_
**Status:** _[Not Executed]_

---

## 2. Live TV Streaming Test Cases

### TC-201: Live Channel List Load
- **Feature:** Live TV
- **Test Scenario:** Display list of available live channels
- **Priority:** Critical
- **Test Type:** Functional, Smoke
- **Prerequisites:** User is logged in

**Test Steps:**
1. User is logged in
2. Navigate to "Live TV" section
3. Observe channel list loading

**Expected Result:**
- Channel list loads within 2 seconds
- All channels displayed with thumbnails
- Channel names and current program info visible

**Actual Result:** _[To be filled during execution]_
**Status:** _[Not Executed]_

---

### TC-202: Play Live Channel
- **Feature:** Live TV
- **Test Scenario:** User plays a live channel
- **Priority:** Critical
- **Test Type:** Functional, Smoke
- **Prerequisites:** User is logged in, on Live TV page

**Test Steps:**
1. Navigate to Live TV section
2. Click on a channel thumbnail
3. Wait for video to start

**Expected Result:**
- Video player opens
- Video starts playing within 2 seconds
- Audio is audible
- Video quality is clear
- No buffering issues

**Actual Result:** _[To be filled during execution]_
**Status:** _[Not Executed]_

---

### TC-203: Channel Switching (Zapping)
- **Feature:** Live TV
- **Test Scenario:** User switches between channels quickly
- **Priority:** High
- **Test Type:** Functional, Performance
- **Prerequisites:** User is watching a live channel

**Test Steps:**
1. User is watching Channel A
2. Click on Channel B from channel list
3. Measure time to switch
4. Repeat for 5 different channels

**Expected Result:**
- Channel switches within 1 second
- Smooth transition without freezing
- Previous channel stops playing
- New channel audio/video in sync

**Actual Result:** _[To be filled during execution]_
**Status:** _[Not Executed]_

---

### TC-204: Live Stream Stability
- **Feature:** Live TV
- **Test Scenario:** Verify stream stability over extended period
- **Priority:** High
- **Test Type:** Stability
- **Prerequisites:** User is logged in

**Test Steps:**
1. Start playing a live channel
2. Let video play for 30 minutes continuously
3. Monitor playback quality
4. Check for interruptions, freezes, or errors

**Expected Result:**
- Video plays continuously for 30 minutes
- No freezing or stuttering
- Less than 5% buffering events
- Audio remains in sync

**Actual Result:** _[To be filled during execution]_
**Status:** _[Not Executed]_

---

## 3. Video on Demand (VOD) Test Cases

### TC-301: Browse VOD Catalog
- **Feature:** VOD
- **Test Scenario:** User browses video on demand content
- **Priority:** High
- **Test Type:** Functional
- **Prerequisites:** User is logged in

**Test Steps:**
1. Navigate to VOD section
2. Browse through content categories
3. Scroll through video thumbnails

**Expected Result:**
- VOD catalog loads within 3 seconds
- Videos displayed with thumbnails and titles
- Categories properly organized
- Smooth scrolling performance

**Actual Result:** _[To be filled during execution]_
**Status:** _[Not Executed]_

---

### TC-302: Play VOD Content
- **Feature:** VOD
- **Test Scenario:** User plays a VOD video
- **Priority:** Critical
- **Test Type:** Functional, Smoke
- **Prerequisites:** User is logged in, on VOD page

**Test Steps:**
1. Navigate to VOD section
2. Click on a video thumbnail
3. Click "Play" button
4. Observe video playback

**Expected Result:**
- Video starts playing within 2 seconds
- Video plays smoothly
- Playback controls visible (play, pause, seek)
- Progress bar updates correctly

**Actual Result:** _[To be filled during execution]_
**Status:** _[Not Executed]_

---

### TC-303: Video Seeking (Forward/Backward)
- **Feature:** VOD
- **Test Scenario:** User seeks forward and backward in video
- **Priority:** High
- **Test Type:** Functional
- **Prerequisites:** VOD video is playing

**Test Steps:**
1. Start playing a VOD video
2. Drag progress bar to 50% position
3. Video should jump to that position
4. Seek backward to 25% position
5. Use keyboard arrow keys for small seeks

**Expected Result:**
- Seeking works smoothly
- Video resumes from new position within 1 second
- Audio remains in sync after seeking
- Progress bar accurately reflects position

**Actual Result:** _[To be filled during execution]_
**Status:** _[Not Executed]_

---

### TC-304: Resume Playback
- **Feature:** VOD
- **Test Scenario:** User resumes video from last watched position
- **Priority:** High
- **Test Type:** Functional
- **Prerequisites:** User previously watched a VOD video partially

**Test Steps:**
1. Start playing a VOD video
2. Watch for 2 minutes
3. Navigate away or close browser
4. Log back in and return to the same video
5. Start playback

**Expected Result:**
- System prompts to resume or start from beginning
- If resume selected, video starts from last watched position
- Playback continues smoothly

**Actual Result:** _[To be filled during execution]_
**Status:** _[Not Executed]_

---

### TC-305: Subtitle Toggle
- **Feature:** VOD
- **Test Scenario:** User enables and disables subtitles
- **Priority:** Medium
- **Test Type:** Functional
- **Prerequisites:** VOD video with subtitles is playing

**Test Steps:**
1. Play a VOD video with subtitle support
2. Click subtitle/CC button in player controls
3. Select a subtitle language
4. Verify subtitles appear
5. Toggle subtitles off

**Expected Result:**
- Subtitle options displayed
- Selected subtitles appear synchronized with audio
- Subtitles can be toggled on/off
- Multiple languages available if supported

**Actual Result:** _[To be filled during execution]_
**Status:** _[Not Executed]_

---

## 4. Search & Discovery Test Cases

### TC-401: Content Search - Valid Query
- **Feature:** Search
- **Test Scenario:** User searches for content with valid keyword
- **Priority:** High
- **Test Type:** Functional
- **Prerequisites:** User is logged in

**Test Steps:**
1. Navigate to search bar
2. Enter search keyword (e.g., "Action")
3. Press Enter or click Search button
4. Observe search results

**Expected Result:**
- Search results displayed within 2 seconds
- Relevant content matching keyword shown
- Results include both Live TV and VOD
- Thumbnails and titles displayed

**Actual Result:** _[To be filled during execution]_
**Status:** _[Not Executed]_

---

### TC-402: Content Search - No Results
- **Feature:** Search
- **Test Scenario:** User searches with keyword that has no matches
- **Priority:** Medium
- **Test Type:** Negative Testing
- **Prerequisites:** User is logged in

**Test Steps:**
1. Navigate to search bar
2. Enter random keyword with no expected results
3. Press Enter

**Expected Result:**
- "No results found" message displayed
- Helpful suggestions provided (e.g., "Try different keywords")
- Search bar remains accessible

**Actual Result:** _[To be filled during execution]_
**Status:** _[Not Executed]_

---

### TC-403: Filter Search Results
- **Feature:** Search
- **Test Scenario:** User applies filters to search results
- **Priority:** Medium
- **Test Type:** Functional
- **Prerequisites:** Search results are displayed

**Test Steps:**
1. Perform a search
2. Apply filter (e.g., "Live TV only" or "VOD only")
3. Apply another filter (e.g., "Genre: Sports")
4. Observe filtered results

**Expected Result:**
- Results update based on selected filters
- Only matching content displayed
- Multiple filters can be combined
- Clear filter option available

**Actual Result:** _[To be filled during execution]_
**Status:** _[Not Executed]_

---

## 5. Favorites Test Cases

### TC-501: Add Content to Favorites
- **Feature:** Favorites
- **Test Scenario:** User adds content to favorites list
- **Priority:** Medium
- **Test Type:** Functional
- **Prerequisites:** User is logged in

**Test Steps:**
1. Browse Live TV or VOD content
2. Hover over or select a content item
3. Click "Add to Favorites" or heart icon
4. Observe feedback

**Expected Result:**
- Content added to favorites
- Visual confirmation (icon changes color)
- Toast notification: "Added to favorites"
- Content appears in Favorites list

**Actual Result:** _[To be filled during execution]_
**Status:** _[Not Executed]_

---

### TC-502: Remove Content from Favorites
- **Feature:** Favorites
- **Test Scenario:** User removes content from favorites
- **Priority:** Medium
- **Test Type:** Functional
- **Prerequisites:** User has content in favorites

**Test Steps:**
1. Navigate to Favorites section
2. Select a content item
3. Click "Remove from Favorites" or heart icon
4. Observe feedback

**Expected Result:**
- Content removed from favorites
- Visual confirmation (icon changes back)
- Toast notification: "Removed from favorites"
- Content no longer in Favorites list

**Actual Result:** _[To be filled during execution]_
**Status:** _[Not Executed]_

---

### TC-503: View Favorites List
- **Feature:** Favorites
- **Test Scenario:** User views all favorite content
- **Priority:** Medium
- **Test Type:** Functional
- **Prerequisites:** User has added items to favorites

**Test Steps:**
1. Click "Favorites" in navigation menu
2. View favorites list

**Expected Result:**
- All favorite items displayed
- Items show thumbnails and titles
- List loads within 2 seconds
- Empty state message if no favorites

**Actual Result:** _[To be filled during execution]_
**Status:** _[Not Executed]_

---

## 6. Network & Error Handling Test Cases

### TC-601: Playback on Slow Network
- **Feature:** Network Resilience
- **Test Scenario:** Video playback under slow network conditions
- **Priority:** High
- **Test Type:** Network Testing
- **Prerequisites:** User is logged in, Network throttling enabled (Slow 3G)

**Test Steps:**
1. Enable network throttling to "Slow 3G" in browser DevTools
2. Play a live channel or VOD
3. Observe playback behavior

**Expected Result:**
- Video starts playing (may take longer)
- Video quality automatically adjusts to lower bitrate
- Minimal buffering
- Smooth playback at lower quality

**Actual Result:** _[To be filled during execution]_
**Status:** _[Not Executed]_

---

### TC-602: Connection Loss During Playback
- **Feature:** Network Resilience
- **Test Scenario:** Video playback when network disconnects
- **Priority:** High
- **Test Type:** Network Testing, Error Handling
- **Prerequisites:** Video is playing

**Test Steps:**
1. Start playing a video
2. Disable network connection
3. Wait 10 seconds
4. Re-enable network connection
5. Observe recovery behavior

**Expected Result:**
- Video pauses when connection lost
- Error message: "Connection lost. Retrying..."
- Video resumes automatically when connection restored
- Playback continues from last position

**Actual Result:** _[To be filled during execution]_
**Status:** _[Not Executed]_

---

### TC-603: Failed Video Load
- **Feature:** Error Handling
- **Test Scenario:** Handle video that fails to load
- **Priority:** High
- **Test Type:** Negative Testing
- **Prerequisites:** User is logged in

**Test Steps:**
1. Attempt to play a video with invalid or broken stream URL
2. Observe error handling

**Expected Result:**
- Clear error message displayed
- Error: "Unable to load video. Please try again."
- Retry button available
- User can navigate back

**Actual Result:** _[To be filled during execution]_
**Status:** _[Not Executed]_

---

## 7. Performance Test Cases

### TC-701: Page Load Time
- **Feature:** Performance
- **Test Scenario:** Measure initial page load time
- **Priority:** High
- **Test Type:** Performance
- **Prerequisites:** Clear browser cache

**Test Steps:**
1. Clear browser cache
2. Navigate to application URL
3. Measure time until page fully loaded
4. Use browser DevTools Performance tab

**Expected Result:**
- Page loads within 3 seconds
- First Contentful Paint < 1.5 seconds
- Time to Interactive < 3 seconds

**Actual Result:** _[To be filled during execution]_
**Status:** _[Not Executed]_

---

### TC-702: Video Startup Latency
- **Feature:** Performance
- **Test Scenario:** Measure time from play button to first frame
- **Priority:** Critical
- **Test Type:** Performance
- **Prerequisites:** User is logged in

**Test Steps:**
1. Navigate to a video
2. Start timer
3. Click play button
4. Stop timer when first video frame appears
5. Repeat 10 times and calculate average

**Expected Result:**
- Average video startup time < 2 seconds
- 95th percentile < 3 seconds
- Consistent performance across attempts

**Actual Result:** _[To be filled during execution]_
**Status:** _[Not Executed]_

---

## 8. Mobile Application Test Cases

### TC-801: Mobile Responsive Layout
- **Feature:** Mobile UI
- **Test Scenario:** Verify application layout on mobile devices
- **Priority:** Critical
- **Test Type:** Functional, UI
- **Prerequisites:** Access via mobile device or simulator

**Test Steps:**
1. Open application on mobile browser (iOS/Android)
2. Verify header and navigation menu collapse correctly
3. Check video player aspect ratio
4. Verify touch interactions (tap, swipe)

**Expected Result:**
- Layout adapts to screen size
- No horizontal scrolling required
- Touch targets are large enough (>44px)
- Video player uses native controls where appropriate

**Actual Result:** _[To be filled during execution]_
**Status:** _[Not Executed]_

### TC-802: Background Playback (Mobile)
- **Feature:** Mobile Playback
- **Test Scenario:** Verify behavior when app moves to background
- **Priority:** Medium
- **Test Type:** Functional
- **Prerequisites:** Mobile device

**Test Steps:**
1. Start playing video on mobile
2. Press Home button to minimize app
3. Lock screen
4. Resume app

**Expected Result:**
- Video pauses when minimized (or continues if background play supported)
- Application state preserved upon resume
- Battery usage is optimized

**Actual Result:** _[To be filled during execution]_
**Status:** _[Not Executed]_

## Test Case Summary

| Priority | Total Test Cases |
|----------|------------------|
| Critical | 5 |
| High | 12 |
| Medium | 8 |
| Low | 0 |
| **Total** | **25** |

---

## Test Execution Tracking

| Test Suite | Total | Pass | Fail | Blocked | Not Executed |
|------------|-------|------|------|---------|--------------|
| Authentication | 3 | - | - | - | 3 |
| Live TV | 4 | - | - | - | 4 |
| VOD | 5 | - | - | - | 5 |
| Search | 3 | - | - | - | 3 |
| Favorites | 3 | - | - | - | 3 |
| Network/Error | 3 | - | - | - | 3 |
| Performance | 2 | - | - | - | 2 |
| **Total** | **25** | **0** | **0** | **0** | **25** |

---

**Note:** This is a template. During actual test execution, update the "Actual Result" and "Status" fields for each test case.
