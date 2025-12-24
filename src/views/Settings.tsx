import {
  SettingsContainer,
  SettingsDivider,
  SettingsField,
  SettingsHeading,
  SettingsHint,
  SettingsInputFrame,
  SettingsLabel,
  SettingsSelectFrame,
  SettingsSliderFrame,
  SettingsColorFrame,
  SettingsSwitchFrame,
  SettingsSwitchLabel,
  SettingsRadioFrame,
  SettingsRadioLabel,
} from '@telemetryos/sdk/react'
import {
  useUiScaleStoreState,
  useClockStyleStoreState,
  useTimeFormatStoreState,
  useShowSecondsStoreState,
  useShowAmPmStoreState,
  useShowDateStoreState,
  useDateFormatStoreState,
  useDayOfWeekFormatStoreState,
  useMonthFormatStoreState,
  useTimezoneStoreState,
  useShowCityNameStoreState,
  useShowTimezoneAbbrStoreState,
  usePrimaryColorStoreState,
  useSecondaryColorStoreState,
  useBackgroundColorStoreState,
  useBackgroundOpacityStoreState,
  useAccentColorStoreState,
  useShowGreetingStoreState,
  useCustomGreetingStoreState,
  useTitleLabelStoreState,
  type ClockStyle,
  type TimeFormat,
  type DateFormat,
  type DayOfWeekFormat,
  type MonthFormat,
} from '../hooks/store'

// Common timezone options
const TIMEZONE_OPTIONS = [
  { value: 'America/New_York', label: 'New York (EST/EDT)' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)' },
  { value: 'America/Denver', label: 'Denver (MST/MDT)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
  { value: 'America/Anchorage', label: 'Anchorage (AKST/AKDT)' },
  { value: 'Pacific/Honolulu', label: 'Honolulu (HST)' },
  { value: 'America/Phoenix', label: 'Phoenix (MST)' },
  { value: 'America/Toronto', label: 'Toronto (EST/EDT)' },
  { value: 'America/Vancouver', label: 'Vancouver (PST/PDT)' },
  { value: 'America/Mexico_City', label: 'Mexico City (CST/CDT)' },
  { value: 'America/Sao_Paulo', label: 'Sao Paulo (BRT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)' },
  { value: 'Europe/Rome', label: 'Rome (CET/CEST)' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)' },
  { value: 'Europe/Moscow', label: 'Moscow (MSK)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Kolkata', label: 'Mumbai (IST)' },
  { value: 'Asia/Bangkok', label: 'Bangkok (ICT)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Seoul', label: 'Seoul (KST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEST/AEDT)' },
  { value: 'Australia/Perth', label: 'Perth (AWST)' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)' },
  { value: 'UTC', label: 'UTC' },
]

const CLOCK_STYLE_OPTIONS: { value: ClockStyle; label: string }[] = [
  { value: 'digital-led', label: 'Digital - LED' },
  { value: 'digital-minimal', label: 'Digital - Minimal' },
  { value: 'digital-bold', label: 'Digital - Bold' },
  { value: 'analog-classic', label: 'Analog - Classic' },
  { value: 'analog-modern', label: 'Analog - Modern' },
  { value: 'analog-minimal', label: 'Analog - Minimal' },
]

export function Settings() {
  // UI Scale
  const [isLoadingUiScale, uiScale, setUiScale] = useUiScaleStoreState(5)

  // Clock Style
  const [isLoadingStyle, clockStyle, setClockStyle] = useClockStyleStoreState()

  // Time Settings
  const [isLoadingTimeFormat, timeFormat, setTimeFormat] = useTimeFormatStoreState()
  const [isLoadingShowSeconds, showSeconds, setShowSeconds] = useShowSecondsStoreState()
  const [isLoadingShowAmPm, showAmPm, setShowAmPm] = useShowAmPmStoreState()

  // Date Settings
  const [isLoadingShowDate, showDate, setShowDate] = useShowDateStoreState()
  const [isLoadingDateFormat, dateFormat, setDateFormat] = useDateFormatStoreState()
  const [isLoadingDayOfWeek, dayOfWeek, setDayOfWeek] = useDayOfWeekFormatStoreState()
  const [isLoadingMonthFormat, monthFormat, setMonthFormat] = useMonthFormatStoreState()

  // Timezone Settings
  const [isLoadingTimezone, timezone, setTimezone] = useTimezoneStoreState()
  const [isLoadingCityName, showCityName, setShowCityName] = useShowCityNameStoreState()
  const [isLoadingTzAbbr, showTimezoneAbbr, setShowTimezoneAbbr] = useShowTimezoneAbbrStoreState()

  // Color Settings
  const [isLoadingPrimary, primaryColor, setPrimaryColor] = usePrimaryColorStoreState(5)
  const [isLoadingSecondary, secondaryColor, setSecondaryColor] = useSecondaryColorStoreState(5)
  const [isLoadingBg, backgroundColor, setBackgroundColor] = useBackgroundColorStoreState(5)
  const [isLoadingBgOpacity, backgroundOpacity, setBackgroundOpacity] = useBackgroundOpacityStoreState(5)
  const [isLoadingAccent, accentColor, setAccentColor] = useAccentColorStoreState(5)

  // Greeting Settings
  const [isLoadingGreeting, showGreeting, setShowGreeting] = useShowGreetingStoreState()
  const [isLoadingCustomGreeting, customGreeting, setCustomGreeting] = useCustomGreetingStoreState(250)

  // Title Label
  const [isLoadingTitleLabel, titleLabel, setTitleLabel] = useTitleLabelStoreState(250)

  const isDigital = clockStyle.startsWith('digital')

  return (
    <SettingsContainer>
      {/* Clock Style */}
      <SettingsHeading>Clock Style</SettingsHeading>

      <SettingsField>
        <SettingsLabel>Style</SettingsLabel>
        <SettingsSelectFrame>
          <select
            disabled={isLoadingStyle}
            value={clockStyle}
            onChange={(e) => setClockStyle(e.target.value as ClockStyle)}
          >
            {CLOCK_STYLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </SettingsSelectFrame>
        <SettingsHint>Choose between digital and analog clock styles</SettingsHint>
      </SettingsField>

      <SettingsDivider />

      {/* Title Label */}
      <SettingsHeading>Title Label</SettingsHeading>

      <SettingsField>
        <SettingsLabel>Display Label</SettingsLabel>
        <SettingsInputFrame>
          <input
            type="text"
            placeholder="e.g., Vancouver, Meeting Room A..."
            disabled={isLoadingTitleLabel}
            value={titleLabel}
            onChange={(e) => setTitleLabel(e.target.value)}
            maxLength={50}
          />
        </SettingsInputFrame>
        <SettingsHint>Optional label displayed above the clock (useful for side-by-side displays)</SettingsHint>
      </SettingsField>

      <SettingsDivider />

      {/* Time Settings */}
      <SettingsHeading>Time Display</SettingsHeading>

      <SettingsField>
        <SettingsLabel>Time Format</SettingsLabel>
        <SettingsRadioFrame>
          <input
            type="radio"
            name="timeFormat"
            value="12"
            disabled={isLoadingTimeFormat}
            checked={timeFormat === '12'}
            onChange={(e) => setTimeFormat(e.target.value as TimeFormat)}
          />
          <SettingsRadioLabel>12-hour (AM/PM)</SettingsRadioLabel>
        </SettingsRadioFrame>
        <SettingsRadioFrame>
          <input
            type="radio"
            name="timeFormat"
            value="24"
            disabled={isLoadingTimeFormat}
            checked={timeFormat === '24'}
            onChange={(e) => setTimeFormat(e.target.value as TimeFormat)}
          />
          <SettingsRadioLabel>24-hour</SettingsRadioLabel>
        </SettingsRadioFrame>
      </SettingsField>

      <SettingsField>
        <SettingsSwitchFrame>
          <input
            type="checkbox"
            role="switch"
            disabled={isLoadingShowSeconds}
            checked={showSeconds}
            onChange={(e) => setShowSeconds(e.target.checked)}
          />
          <SettingsSwitchLabel>Show Seconds</SettingsSwitchLabel>
        </SettingsSwitchFrame>
      </SettingsField>

      {timeFormat === '12' && isDigital && (
        <SettingsField>
          <SettingsSwitchFrame>
            <input
              type="checkbox"
              role="switch"
              disabled={isLoadingShowAmPm}
              checked={showAmPm}
              onChange={(e) => setShowAmPm(e.target.checked)}
            />
            <SettingsSwitchLabel>Show AM/PM</SettingsSwitchLabel>
          </SettingsSwitchFrame>
        </SettingsField>
      )}

      <SettingsDivider />

      {/* Date Settings - Only for digital clocks */}
      {isDigital && (
        <>
          <SettingsHeading>Date Display</SettingsHeading>

          <SettingsField>
            <SettingsSwitchFrame>
              <input
                type="checkbox"
                role="switch"
                disabled={isLoadingShowDate}
                checked={showDate}
                onChange={(e) => setShowDate(e.target.checked)}
              />
              <SettingsSwitchLabel>Show Date</SettingsSwitchLabel>
            </SettingsSwitchFrame>
          </SettingsField>

          {showDate && (
            <>
              <SettingsField>
                <SettingsLabel>Date Format</SettingsLabel>
                <SettingsSelectFrame>
                  <select
                    disabled={isLoadingDateFormat}
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value as DateFormat)}
                  >
                    <option value="written">Written (Jan 15, 2025)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </SettingsSelectFrame>
              </SettingsField>

              <SettingsField>
                <SettingsLabel>Day of Week</SettingsLabel>
                <SettingsSelectFrame>
                  <select
                    disabled={isLoadingDayOfWeek}
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value as DayOfWeekFormat)}
                  >
                    <option value="off">Hidden</option>
                    <option value="short">Short (Mon)</option>
                    <option value="full">Full (Monday)</option>
                  </select>
                </SettingsSelectFrame>
              </SettingsField>

              {dateFormat === 'written' && (
                <SettingsField>
                  <SettingsLabel>Month Format</SettingsLabel>
                  <SettingsSelectFrame>
                    <select
                      disabled={isLoadingMonthFormat}
                      value={monthFormat}
                      onChange={(e) => setMonthFormat(e.target.value as MonthFormat)}
                    >
                      <option value="short">Short (Jan)</option>
                      <option value="full">Full (January)</option>
                      <option value="number">Number (01)</option>
                    </select>
                  </SettingsSelectFrame>
                </SettingsField>
              )}
            </>
          )}

          <SettingsDivider />
        </>
      )}

      {/* Timezone Settings */}
      <SettingsHeading>Timezone</SettingsHeading>

      <SettingsField>
        <SettingsLabel>Timezone</SettingsLabel>
        <SettingsSelectFrame>
          <select
            disabled={isLoadingTimezone}
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            {TIMEZONE_OPTIONS.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </SettingsSelectFrame>
        <SettingsHint>Select the timezone for the clock display</SettingsHint>
      </SettingsField>

      <SettingsField>
        <SettingsSwitchFrame>
          <input
            type="checkbox"
            role="switch"
            disabled={isLoadingCityName}
            checked={showCityName}
            onChange={(e) => setShowCityName(e.target.checked)}
          />
          <SettingsSwitchLabel>Show City Name</SettingsSwitchLabel>
        </SettingsSwitchFrame>
      </SettingsField>

      <SettingsField>
        <SettingsSwitchFrame>
          <input
            type="checkbox"
            role="switch"
            disabled={isLoadingTzAbbr}
            checked={showTimezoneAbbr}
            onChange={(e) => setShowTimezoneAbbr(e.target.checked)}
          />
          <SettingsSwitchLabel>Show Timezone Abbreviation</SettingsSwitchLabel>
        </SettingsSwitchFrame>
      </SettingsField>

      <SettingsDivider />

      {/* Color Settings */}
      <SettingsHeading>Colors</SettingsHeading>

      <SettingsField>
        <SettingsLabel>Primary Color (Time)</SettingsLabel>
        <SettingsColorFrame>
          <input
            type="color"
            disabled={isLoadingPrimary}
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
          />
          <span>{primaryColor}</span>
        </SettingsColorFrame>
        <SettingsHint>Main color for time display and clock hands</SettingsHint>
      </SettingsField>

      <SettingsField>
        <SettingsLabel>Secondary Color (Labels)</SettingsLabel>
        <SettingsColorFrame>
          <input
            type="color"
            disabled={isLoadingSecondary}
            value={secondaryColor}
            onChange={(e) => setSecondaryColor(e.target.value)}
          />
          <span>{secondaryColor}</span>
        </SettingsColorFrame>
        <SettingsHint>Color for date, timezone labels, and secondary text</SettingsHint>
      </SettingsField>

      <SettingsField>
        <SettingsLabel>Accent Color</SettingsLabel>
        <SettingsColorFrame>
          <input
            type="color"
            disabled={isLoadingAccent}
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
          />
          <span>{accentColor}</span>
        </SettingsColorFrame>
        <SettingsHint>Color for second hand (analog) or colon (digital bold)</SettingsHint>
      </SettingsField>

      <SettingsField>
        <SettingsLabel>Background Color</SettingsLabel>
        <SettingsColorFrame>
          <input
            type="color"
            disabled={isLoadingBg}
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
          <span>{backgroundColor}</span>
        </SettingsColorFrame>
      </SettingsField>

      <SettingsField>
        <SettingsLabel>Background Opacity</SettingsLabel>
        <SettingsSliderFrame>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            disabled={isLoadingBgOpacity}
            value={backgroundOpacity}
            onChange={(e) => setBackgroundOpacity(Number(e.target.value))}
          />
          <span>{backgroundOpacity}%</span>
        </SettingsSliderFrame>
        <SettingsHint>Set to 0% for transparent background (overlay mode)</SettingsHint>
      </SettingsField>

      <SettingsDivider />

      {/* Greeting Settings */}
      <SettingsHeading>Greeting</SettingsHeading>

      <SettingsField>
        <SettingsSwitchFrame>
          <input
            type="checkbox"
            role="switch"
            disabled={isLoadingGreeting}
            checked={showGreeting}
            onChange={(e) => setShowGreeting(e.target.checked)}
          />
          <SettingsSwitchLabel>Show Greeting</SettingsSwitchLabel>
        </SettingsSwitchFrame>
        <SettingsHint>Display "Good Morning", "Good Afternoon", etc.</SettingsHint>
      </SettingsField>

      {showGreeting && (
        <SettingsField>
          <SettingsLabel>Custom Greeting (Optional)</SettingsLabel>
          <SettingsInputFrame>
            <input
              type="text"
              placeholder="Leave empty for automatic greeting..."
              disabled={isLoadingCustomGreeting}
              value={customGreeting}
              onChange={(e) => setCustomGreeting(e.target.value)}
            />
          </SettingsInputFrame>
          <SettingsHint>Override the automatic time-based greeting</SettingsHint>
        </SettingsField>
      )}

      <SettingsDivider />

      {/* UI Scale */}
      <SettingsHeading>Display Scale</SettingsHeading>

      <SettingsField>
        <SettingsLabel>UI Scale</SettingsLabel>
        <SettingsSliderFrame>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.1}
            disabled={isLoadingUiScale}
            value={uiScale}
            onChange={(e) => setUiScale(parseFloat(e.target.value))}
          />
          <span>{uiScale.toFixed(1)}x</span>
        </SettingsSliderFrame>
        <SettingsHint>Adjust the overall size of the clock display</SettingsHint>
      </SettingsField>
    </SettingsContainer>
  )
}
