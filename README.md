# Clock App for TelemetryOS

A customizable clock application for TelemetryOS digital signage displays. Features multiple clock styles, timezone support, and extensive visual customization options.

## Features

### Clock Styles
- **Digital LED** - Classic LED-style display with high visibility
- **Digital Minimal** - Clean, lightweight design with thin fonts
- **Digital Bold** - Strong, impactful typography with accent-colored colon
- **Analog Classic** - Traditional clock face with Roman-inspired styling
- **Analog Modern** - Contemporary dark theme with marker-only design
- **Analog Minimal** - Ultra-clean circle with hands and minimal decoration

### Time & Date
- 12-hour or 24-hour format
- Optional seconds display
- AM/PM indicator toggle
- Multiple date formats: MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD, or written (e.g., "December 24, 2025")
- Day of week display (short, full, or hidden)
- Month format options (number, short, or full)

### Timezone Support
- Full IANA timezone support (e.g., "America/New_York", "Europe/London")
- Automatic daylight saving time handling
- Optional city name display
- Optional timezone abbreviation display (e.g., "EST", "PST")

### Visual Customization
- Primary color for time display
- Secondary color for date and labels
- Accent color for second hands and decorative elements
- Background color with opacity control (0-100%)
- Transparent background support for overlay use

### Additional Features
- Title label above clock (useful for multi-timezone displays)
- Time-based greeting messages (Good Morning/Afternoon/Evening/Night)
- Custom greeting text option
- UI scale adjustment for different viewing distances

## Configuration

All settings are configured through the TelemetryOS Studio settings panel:

| Setting | Options | Default |
|---------|---------|---------|
| Clock Style | 6 styles available | Digital Minimal |
| Time Format | 12-hour / 24-hour | 12-hour |
| Show Seconds | On / Off | Off |
| Show AM/PM | On / Off | On |
| Show Date | On / Off | On |
| Date Format | Multiple formats | Written |
| Day of Week | Off / Short / Full | Full |
| Month Format | Number / Short / Full | Short |
| Timezone | IANA timezones | America/New_York |
| Show City Name | On / Off | Off |
| Show Timezone Abbr | On / Off | Off |
| Primary Color | Hex color | #ffffff |
| Secondary Color | Hex color | #d1d5db |
| Background Color | Hex color | #1a1a1a |
| Background Opacity | 0-100% | 100% |
| Accent Color | Hex color | #f97316 |
| Show Greeting | On / Off | Off |
| Custom Greeting | Text | (empty) |
| Title Label | Text | (empty) |
| UI Scale | 1-3x | 1x |

## Technical Details

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **SDK:** TelemetryOS SDK for store synchronization and UI components
- **Fonts:** Rubik (loaded via Google Fonts)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Serve with TelemetryOS CLI
tos serve
```

## Offline Operation

The clock operates entirely offline after initial load, using the device's system time. No network connectivity is required for continuous operation.

## Error Handling

If time calculation fails (e.g., invalid timezone), the clock displays "Time Unavailable" with a prompt to check settings. This ensures graceful degradation rather than crashes.

## License

Proprietary - TelemetryOS Applications
