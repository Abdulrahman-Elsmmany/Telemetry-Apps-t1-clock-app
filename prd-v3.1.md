# App_name: 5_Clock

## Overview

**This App:** displays current time and date information on TelemetryOS screens. It works as standalone full-screen content or as a widget layered amongst other content. Typical use case: a retail store displays a corner clock widget showing local time while promotional content rotates behind it. For world clock displays (multiple timezones), add multiple clock widgets to the same page.

**This Project:** We're building 200+ production-ready applications for our new digital signage platform, TelemetryOS. Also, your feedback on the SDK and platform is as valuable as the code you deliver.

**Digital Signage:** is a system that lets companies deliver real-time visuals and messaging—such as menus, dashboards, wayfinding, ads, and announcements—to large screens or TVs in physical spaces like stores, offices, and campuses. Unlike mobile apps, these displays vary in size and are viewed at a glance from 10+ feet away. Design for visual impact at a distance, not information density.

### Delivery

| Stage | Deliverable | Guideline |
|-------|-------------|-----------|
| **Stage 1 (MVP, Mockup)** | Design mockup including settings, submit `feedback.md`, clarify all questions | ~2h (first app), less afterwards |
| **Stage 2 (Production)** | Full functionality, aesthetic, error handling, polish, submit `README.md` and `feedback.md` | 3h max |

### Notes
- **Stage 1 approval required** before moving to Stage 2
- **Resolve all questions** by end of Stage 1; use Slack for communication
- **AI tools required:** Build with Claude Code, Cursor, Copilot, etc.
- **Permission required** to bill above the time guidelines
- **You create the repo** — we fork it after acceptance
- **Act independently** and use good judgment
- **Expanding scope:** Reach out if you have ideas for improving or expanding app functionality

## Resources

| Title | Description | Links |
|-------|-------------|-------|
| SDK Documentation | Getting started, API reference, examples | [docs.telemetryos.com/sdk-getting-started](https://docs.telemetryos.com/docs/sdk-getting-started) |
| Design Guidelines | Breakpoints, mount points, React components, responsive behavior | `design-guidelines.md` |
| Application Components | Mount points (`/render`, `/settings`) documentation | [docs.telemetryos.com/application-components](https://docs.telemetryos.com/docs/application-components) |
| ReactJS Guide | Project structure, `createUseStoreState`, Settings/Render view patterns | [docs.telemetryos.com/docs/ReactJS](https://docs.telemetryos.com/docs/ReactJS) |
| UI Scale Hooks | Responsive scaling hooks for digital signage displays | [docs.telemetryos.com/ui-scale-hooks](https://docs.telemetryos.com/docs/ui-scale-hooks) |
| Reference Apps | Competitor UI examples for inspiration (free trials available) | [TelemetryTV](https://telemetrytv.com), [Yodeck](https://yodeck.com), [OptiSigns](https://optisigns.com); Pintrest, Behave, Dribbble for mockup. |
| TOS Testing Environment | Account credentials for testing your app | Credentials sent via email |
| Feedback Form | Complete with your Stage 1 & 2 submissions | `feedback.md` |
| Communication | Day-to-day questions via slack; stage submissions via GitHub PR | - |

## Platform Concepts

Before building, understand these TelemetryOS fundamentals:

- **Mount Points:** Your app has two entry points—`/render` (what displays on screen) and `/settings` (admin configuration UI). These are separate React components.
- **Playlist:** A sequence of content items that rotate on screen. Your app is one item in a playlist managed by the platform.
- **Responsive Scaling:** Your app may display at various sizes within a playlist page. Use `useUiScaleToSetRem()` and REM units so content scales proportionally.

Refer to `design-guidelines.md` for zone shapes (square, rectangle, extreme) and responsive behavior.

## Requirements

1. **Time Display:** Display current time with configurable format (12-hour with AM/PM or 24-hour). Support showing or hiding seconds. Support multiple clock styles for both digital (LED-style, minimal, bold) and analog (classic, modern, minimal). Analog clocks display smooth sweeping second hand animation.

2. **Date Display:** Display current date with toggleable and formattable elements: date format (MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD, or written like "January 15, 2025"), month format (number, short "Jan", or full "January"), and day of week (off, short "Mon", or full "Monday"). English only.

3. **Timezone Support:** Display time in configured timezone using IANA timezone identifiers (e.g., "America/New_York"). Support toggleable display elements: city name label (e.g., "New York"), timezone abbreviation (e.g., "EST"), or both. Automatically handle daylight saving time transitions.

4. **Visual Styling:** Support configurable font selection per `design-guidelines.md` (Rubik default, sans-serif fallback). Support primary color for time display (hex codes like #ffffff), secondary color for date and labels, and background color with opacity control. Support transparent backgrounds for overlay use cases.

5. **Optional Features:** Support togglable time-based greeting messages like "Good Morning", "Good Afternoon", "Good Evening" based on current time. Support customizable greeting text through settings interface.

6. **Settings Interface:** Provide settings UI in `/settings` mount point where operators configure time format, date format, clock style, timezone, visual styling, and optional features. Settings changes propagate automatically to render component without requiring manual refresh.

7. **Startup Behavior:** On device startup, display current time using device system time with no blank screen or loading delay.

8. **Offline Operation:** Continue displaying accurate time indefinitely during network outages using device system time. All functionality works without network connectivity after initial load.

9. **Continuous Operation:** Run continuously without restart, maintaining smooth rendering with no memory leaks or performance degradation.

10. **Edge Cases:**
    - **Empty state:** On first load before configuration, display current time in default format (12-hour, MM/DD/YYYY) with minimal styling
    - **Error state:** If time calculation fails, display "Time Unavailable" message with retry mechanism

## SDK Quick Reference

| Feature | SDK Method/Hook |
|---------|-----------------|
| Configuration storage | `useStoreState(store().instance, key, initialValue)` |
| Responsive scaling | `useUiScaleToSetRem(uiScale)` |
| Aspect ratio detection | `useUiAspectRatio()` |
| Time calculation | JavaScript `Date` API |
| Timezone conversion | `Intl.DateTimeFormat` API |
| Canvas rendering (analog) | HTML5 Canvas API |
| Smooth animations | `requestAnimationFrame()` |

Full SDK documentation: [docs.telemetryos.com](https://docs.telemetryos.com/docs/sdk-getting-started)

## Acceptance Criteria

### Stage 1 (MVP, Mockup)
Focus: Visual design and settings UI mockup. Functional code not strictly required.

- [ ] GitHub repo created and shared
- [ ] Mockup demonstrates at least three digital and three analog clock styles
- [ ] Settings UI mockup shows all configurable options (time format, date format, clock style, timezone, colors, greeting toggle)
- [ ] Design follows `design-guidelines.md` breakpoints (rectangle, square, extreme)
- [ ] Render is readable from 10+ feet away
- [ ] `feedback.md` submitted

### Stage 2 (Production)
Focus: Fully functional implementation of all requirements.

- [ ] All 10 requirements implemented and functional
- [ ] All clock styles working (3 digital + 3 analog)
- [ ] Timezone selection with optional label display
- [ ] Settings changes propagate to render without refresh
- [ ] Handles errors gracefully (fallback UI, no crashes)
- [ ] Works offline using device system time
- [ ] `README.md` and `feedback.md` submitted
