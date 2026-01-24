# Bug Report - BUG-001

## Bug Information

**Bug ID:** BUG-001
**Title:** Video Playback Fails on Channel Switch in Firefox
**Reported By:** Damla Alper
**Date Reported:** 2026-01-25
**Status:** New

---

## Priority and Severity

**Severity:** High
- Major feature not working, significant UX degradation

**Priority:** P1
- Should fix before release

---

## Environment Details

**Application Version:** v1.2.0
**Test Environment:** Staging
**Browser:** Firefox 122
**Operating System:** Windows 11
**Screen Resolution:** 1920x1080
**Network Condition:** Normal (100 Mbps)
**Device Type:** Desktop

---

## Bug Description

### Summary
When switching between live TV channels in Firefox, the video player fails to load the new channel stream and displays a black screen with no error message.

### Detailed Description
During testing of the channel switching functionality (zapping) on Firefox, we discovered that after switching from one live channel to another, the video player shows a black screen instead of playing the new channel. The issue occurs consistently in Firefox but not in Chrome or Edge. The audio continues to play from the previous channel for approximately 2 seconds before stopping, but no video appears for the new channel.

---

## Steps to Reproduce

1. Open the application in Firefox 122
2. Log in with credentials: testuser@example.com / Test@1234
3. Navigate to Live TV section
4. Click on "Sports Channel" to start playback
5. Wait for video to start playing (approximately 2 seconds)
6. Click on "News Channel" to switch channels
7. Observe the video player behavior

**Test Data Used:**
- Username: testuser@example.com
- First Channel: Sports Channel (ID: 101)
- Second Channel: News Channel (ID: 102)

---

## Expected Result

1. Video from "Sports Channel" should stop playing
2. Video player should show a brief loading indicator
3. "News Channel" video should start playing within 1 second
4. Audio and video should be synchronized
5. No error messages should appear

---

## Actual Result

1. Video from "Sports Channel" stops playing
2. Video player shows a black screen (no loading indicator)
3. Audio from "Sports Channel" continues for 2 seconds then stops
4. No video appears for "News Channel"
5. No error message is displayed to the user
6. Console shows error: "DOMException: The play() request was interrupted"

---

## Visual Evidence

### Screenshots
![Black Screen After Channel Switch](../assets/bug-001-screenshot.png)

### Video Recording
Link: [Recording of bug reproduction - 45 seconds](https://example.com/bug-001-recording.mp4)

### Console Errors
```
DOMException: The play() request was interrupted by a call to pause()
    at HTMLVideoElement.play()
    at VideoPlayer.switchChannel (VideoPlayer.js:156)
    at ChannelList.handleChannelClick (ChannelList.js:89)

Warning: Video source changed before previous source finished loading
    at src/components/VideoPlayer.js:203

Error: Failed to load video source
    at VideoController.loadSource (VideoController.js:45)
```

---

## Additional Information

**Frequency:** Always

**Reproducibility Rate:** 10/10 tries in Firefox, 0/10 in Chrome/Edge

**Workaround Available:** Yes

**Workaround Steps:**
1. After switching channels, wait 3 seconds
2. Manually refresh the page
3. Navigate back to the desired channel
4. Video will play correctly

**Related Issues:**
- BUG-002 (Audio continues playing after channel switch - may be related)
- Feature #345 (Channel zap optimization - this might have introduced the bug)

**Root Cause (if known):**
Preliminary investigation suggests that the video player's cleanup method is not properly stopping the previous stream before loading the new one in Firefox. The promise chain for video.play() may be getting interrupted.

**Suggested Fix (optional):**
Add proper cleanup handling:
1. Ensure previous video stream is fully stopped and released
2. Add a small delay between stopping old stream and loading new one
3. Wrap play() call in try-catch to handle promise rejection
4. Add better error messaging for users

---

## Browser-Specific Issues

**Affected Browsers:**
- [x] Firefox (v122)

**Not Affected Browsers:**
- [x] Chrome (v120)
- [x] Edge (v119)
- [x] Safari (v17) - Not fully tested yet

---

## Impact Assessment

**User Impact:** High

**Business Impact:**
Channel switching is a core feature of the IPTV experience. Firefox users make up approximately 15% of our user base. This bug severely degrades the user experience and may cause users to switch to competitor platforms or different browsers.

**Affected Features:**
- Live TV channel switching
- Video player state management
- Potentially affects VOD video switching as well (needs verification)

**Number of Users Affected:**
Approximately 15% of user base (all Firefox users)

---

## Test Data and Configuration

**Configuration Settings:**
```json
{
  "videoPlayer": {
    "autoplay": true,
    "preload": "metadata",
    "bufferSize": 10
  },
  "channelSwitch": {
    "transitionDelay": 0,
    "preserveState": false
  }
}
```

**API Endpoints Involved:**
- GET /api/channels/:channelId/stream
- GET /api/channels/:channelId/metadata
- POST /api/analytics/playback (for tracking)

**Database State (if relevant):**
Standard test database with 50 live channels configured

---

## Regression Information

**Is this a regression?** Yes

**Previously Working Version:** v1.1.5

**First Broken Version:** v1.2.0

**Changelog Reference:**
PR #345 "Optimize channel zap performance" merged on 2026-01-20 may have introduced this issue. That PR refactored the VideoPlayer cleanup logic.

Link: https://github.com/example/ott-client/pull/345

---

## Attachments

- Console log: `bug-001-console-log.txt`
- Network trace: `bug-001-network-trace.har`
- Video recording: `bug-001-reproduction.mp4`
- Firefox browser profiler data: `bug-001-firefox-profile.json`

---

## Lifecycle History

| Date | Status | Updated By | Comments |
|------|--------|------------|----------|
| 2026-01-25 | New | Damla Alper | Bug reported after regression testing |
| - | - | - | Awaiting confirmation from dev team |

---

## Comments and Discussion

### Comment 1 - 2026-01-25 - Damla Alper
I've tested this on 3 different Firefox installations (Windows, macOS, Linux) and the issue reproduces consistently. Chrome and Edge work fine. I suspect this is related to how Firefox handles video.play() promises differently than Chromium-based browsers.

### Comment 2 - [Pending]
[Awaiting developer response]

---

## Verification Steps (For Retesting)

After fix is deployed, verify:
1. Switch between 5 different channels in Firefox - all should work smoothly
2. Verify channel zap time is still < 1 second (performance not degraded)
3. Test the same flow in Chrome and Edge to ensure no regression
4. Verify no console errors appear
5. Test both with and without browser extensions enabled
6. Test on different network speeds (3G, 4G, Wifi)
7. Verify audio/video remain synchronized after channel switch

**Verification Result:** [Pending - Not Yet Retested]

**Verified By:** [To be assigned]

**Verification Date:** [Pending]

---

## Labels/Tags

`bug` `livetv` `playback` `channel-switch` `firefox` `p1` `high-severity` `regression` `browser-specific`

---

**Last Updated:** 2026-01-25 by Damla Alper
