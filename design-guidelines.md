# TelemetryOS Application Design Guidelines

Required reading before building TelemetryOS applications.

---

## Why These Guidelines

Digital signage is not mobile or web. Apps run on large displays viewed from several feet away in lobbies, retail floors, and public spaces. This changes everything:

| Mobile/Web | Digital Signage |
|------------|-----------------|
| Small screen, close viewing | Large screen, distant viewing |
| User-initiated interaction | Glanceable, passive consumption |
| Reliable connectivity | Intermittent, must work offline |
| Minutes of use | Runs 24/7 for months |

These guidelines ensure your app is readable at distance, resilient offline, and stable for continuous operation.

---

## Resources

| Resource | What's Inside |
|----------|---------------|
| [guidelines/](../../guidelines/) | Design system, CSS files, component patterns |
| [SDK Docs](https://docs.telemetryos.com/docs/sdk-getting-started) | Setup, API reference, code examples |

Start with `guidelines/README.md` for setup instructions.

---

## Requirements

Your application must:

| Category | Requirement |
|----------|-------------|
| **Design system** | Use provided `tokens.css` and `components.css` |
| **Sizing** | REM units only, never pixels |
| **Typography** | Primary ≥ 3rem, secondary ≥ 1.5rem, contrast ≥ 7:1 |
| **Layout** | Support square, rectangle, and extreme zone shapes |
| **Safe zones** | Keep critical content within 5% inset from edges |
| **Data** | Use SDK methods only, never direct API calls |
| **Offline** | Cache-first rendering, show stale data over errors ([details](../../guidelines/foundations/offline.md)) |
| **Loading** | Skeleton placeholders, never blank screens |
| **Errors** | Branded fallback UI, never technical messages |
| **Performance** | FCP < 1s, 60fps, < 100MB memory, < 10% CPU idle |
| **Background** | Support configurable backgrounds with transparency |

---

## Background

All applications must support configurable backgrounds:

| Option | Behavior |
|--------|----------|
| **Default** | App-specific smart background (e.g., weather conditions). Falls back to solid `--color-background` if none defined. |
| **Solid color** | User-selected color via color picker |
| **Media** | Image or video from TelemetryOS media library |
| **Transparency** | 0-100% opacity slider, applies to background layer only—app content remains fully visible |

See [foundations/backgrounds.md](../../guidelines/foundations/backgrounds.md) for implementation details.

---

## Checklist

- [ ] Using `tokens.css` and `components.css`
- [ ] Settings component works in TelemetryOS Studio
- [ ] Adapts to all zone shapes
- [ ] Works offline with cached data
- [ ] Skeleton loading states
- [ ] Error boundary with branded fallback
- [ ] Typography and contrast requirements met
- [ ] Critical content within safe zones
- [ ] Background settings implemented (default, solid, media, transparency)
