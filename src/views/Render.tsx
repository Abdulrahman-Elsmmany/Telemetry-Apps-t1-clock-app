import { useEffect, useState, useMemo } from 'react'
import { useUiScaleToSetRem } from '@telemetryos/sdk/react'
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
} from '../hooks/store'
import './Render.css'

// Time hook that updates every second
function useCurrentTime(timezone: string) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return time
}

// Format time based on settings (with error handling)
function formatTime(
  date: Date,
  timezone: string,
  format: '12' | '24',
  showSeconds: boolean
): string | null {
  try {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: format === '12',
    }
    if (showSeconds) {
      options.second = '2-digit'
    }

    const formatted = new Intl.DateTimeFormat('en-US', options).format(date)
    // Remove AM/PM for separate handling
    return formatted.replace(/\s?(AM|PM)$/i, '')
  } catch {
    return null
  }
}

// Get AM/PM (with error handling)
function getAmPm(date: Date, timezone: string): string {
  try {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      hour: 'numeric',
      hour12: true,
    }
    const formatted = new Intl.DateTimeFormat('en-US', options).format(date)
    return formatted.includes('AM') ? 'AM' : 'PM'
  } catch {
    return ''
  }
}

// Format date based on settings (with error handling)
function formatDate(
  date: Date,
  timezone: string,
  dateFormat: string,
  dayOfWeek: string,
  monthFormat: string
): string | null {
  try {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
    }

    // Day of week
    let dayStr = ''
    if (dayOfWeek !== 'off') {
      const dayOptions: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        weekday: dayOfWeek === 'short' ? 'short' : 'long',
      }
      dayStr = new Intl.DateTimeFormat('en-US', dayOptions).format(date)
    }

    // Date formatting
    let dateStr = ''
    if (dateFormat === 'written') {
      const monthOpt = monthFormat === 'full' ? 'long' : monthFormat === 'short' ? 'short' : 'numeric'
      options.month = monthOpt as 'long' | 'short' | 'numeric'
      options.day = 'numeric'
      options.year = 'numeric'
      dateStr = new Intl.DateTimeFormat('en-US', options).format(date)
    } else {
      const day = date.toLocaleDateString('en-US', { timeZone: timezone, day: '2-digit' })
      const month = date.toLocaleDateString('en-US', { timeZone: timezone, month: '2-digit' })
      const year = date.toLocaleDateString('en-US', { timeZone: timezone, year: 'numeric' })

      switch (dateFormat) {
        case 'MM/DD/YYYY':
          dateStr = `${month}/${day}/${year}`
          break
        case 'DD/MM/YYYY':
          dateStr = `${day}/${month}/${year}`
          break
        case 'YYYY-MM-DD':
          dateStr = `${year}-${month}-${day}`
          break
        default:
          dateStr = `${month}/${day}/${year}`
      }
    }

    if (dayStr) {
      return `${dayStr}, ${dateStr}`
    }
    return dateStr
  } catch {
    return null
  }
}

// Get timezone abbreviation (with error handling)
function getTimezoneAbbr(date: Date, timezone: string): string {
  try {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      timeZoneName: 'short',
    }
    const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date)
    const tzPart = parts.find((p) => p.type === 'timeZoneName')
    return tzPart?.value || ''
  } catch {
    return ''
  }
}

// Get city name from timezone
function getCityName(timezone: string): string {
  const parts = timezone.split('/')
  const city = parts[parts.length - 1]
  return city.replace(/_/g, ' ')
}

// Get greeting based on time
function getGreeting(date: Date, timezone: string, customGreeting: string): string {
  if (customGreeting) return customGreeting

  const hour = parseInt(
    new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false,
    }).format(date)
  )

  if (hour >= 5 && hour < 12) return 'Good Morning'
  if (hour >= 12 && hour < 17) return 'Good Afternoon'
  if (hour >= 17 && hour < 21) return 'Good Evening'
  return 'Good Night'
}

// Get time parts for analog clock (with error handling)
function getTimeParts(date: Date, timezone: string): { hours: number; minutes: number; seconds: number; milliseconds: number } | null {
  try {
    const timeStr = date.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    const [hours, minutes, seconds] = timeStr.split(':').map(Number)
    const ms = date.getMilliseconds()

    return {
      hours: hours % 12,
      minutes,
      seconds,
      milliseconds: ms,
    }
  } catch {
    return null
  }
}

// Error Display Component
function ErrorDisplay({ primaryColor }: { primaryColor: string }) {
  return (
    <div className="clock clock--error">
      <div className="clock__error-message" style={{ color: primaryColor }}>
        Time Unavailable
      </div>
      <div className="clock__error-hint" style={{ color: primaryColor, opacity: 0.6 }}>
        Please check timezone settings
      </div>
    </div>
  )
}

// Digital LED Clock Component
function DigitalLedClock({
  time,
  timezone,
  timeFormat,
  showSeconds,
  showAmPm,
  showDate,
  dateFormat,
  dayOfWeek,
  monthFormat,
  primaryColor,
  secondaryColor,
}: {
  time: Date
  timezone: string
  timeFormat: '12' | '24'
  showSeconds: boolean
  showAmPm: boolean
  showDate: boolean
  dateFormat: string
  dayOfWeek: string
  monthFormat: string
  primaryColor: string
  secondaryColor: string
}) {
  const timeStr = formatTime(time, timezone, timeFormat, showSeconds)
  const ampm = timeFormat === '12' ? getAmPm(time, timezone) : ''
  const dateStr = showDate ? formatDate(time, timezone, dateFormat, dayOfWeek, monthFormat) : null

  // Show error state if time formatting fails
  if (timeStr === null) {
    return <ErrorDisplay primaryColor={primaryColor} />
  }

  return (
    <div className="clock clock--digital-led">
      <div className="clock__time-row">
        <span className="clock__time clock__time--led" style={{ color: primaryColor }}>
          {timeStr}
        </span>
        {showAmPm && timeFormat === '12' && (
          <span className="clock__ampm clock__ampm--led" style={{ color: primaryColor }}>
            {ampm}
          </span>
        )}
      </div>
      {showDate && dateStr && (
        <div className="clock__date clock__date--led" style={{ color: primaryColor }}>
          {dateStr}
        </div>
      )}
    </div>
  )
}

// Digital Minimal Clock Component
function DigitalMinimalClock({
  time,
  timezone,
  timeFormat,
  showSeconds,
  showAmPm,
  showDate,
  dateFormat,
  dayOfWeek,
  monthFormat,
  primaryColor,
  secondaryColor,
}: {
  time: Date
  timezone: string
  timeFormat: '12' | '24'
  showSeconds: boolean
  showAmPm: boolean
  showDate: boolean
  dateFormat: string
  dayOfWeek: string
  monthFormat: string
  primaryColor: string
  secondaryColor: string
}) {
  const timeStr = formatTime(time, timezone, timeFormat, showSeconds)
  const ampm = timeFormat === '12' ? getAmPm(time, timezone) : ''
  const dateStr = showDate ? formatDate(time, timezone, dateFormat, dayOfWeek, monthFormat) : null

  // Show error state if time formatting fails
  if (timeStr === null) {
    return <ErrorDisplay primaryColor={primaryColor} />
  }

  return (
    <div className="clock clock--digital-minimal">
      <div className="clock__time-row">
        <span className="clock__time clock__time--minimal" style={{ color: primaryColor }}>
          {timeStr}
        </span>
        {showAmPm && timeFormat === '12' && (
          <span className="clock__ampm clock__ampm--minimal" style={{ color: secondaryColor }}>
            {ampm}
          </span>
        )}
      </div>
      {showDate && dateStr && (
        <div className="clock__date clock__date--minimal" style={{ color: secondaryColor }}>
          {dateStr}
        </div>
      )}
    </div>
  )
}

// Digital Bold Clock Component
function DigitalBoldClock({
  time,
  timezone,
  timeFormat,
  showSeconds,
  showAmPm,
  showDate,
  dateFormat,
  dayOfWeek,
  monthFormat,
  primaryColor,
  secondaryColor,
  accentColor,
}: {
  time: Date
  timezone: string
  timeFormat: '12' | '24'
  showSeconds: boolean
  showAmPm: boolean
  showDate: boolean
  dateFormat: string
  dayOfWeek: string
  monthFormat: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
}) {
  // Parse time with error handling
  let hour = '00'
  let minute = '00'
  try {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: timeFormat === '12',
    }
    const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(time)
    hour = parts.find((p) => p.type === 'hour')?.value || '00'
    minute = parts.find((p) => p.type === 'minute')?.value || '00'
  } catch {
    return <ErrorDisplay primaryColor={primaryColor} />
  }

  const ampm = timeFormat === '12' ? getAmPm(time, timezone) : ''
  const dateStr = showDate ? formatDate(time, timezone, dateFormat, dayOfWeek, monthFormat) : null

  return (
    <div className="clock clock--digital-bold">
      <div className="clock__time-row">
        <span className="clock__time clock__time--bold" style={{ color: primaryColor }}>
          {hour}
        </span>
        <span className="clock__colon clock__colon--bold" style={{ color: accentColor }}>
          <span className="clock__colon-dot"></span>
          <span className="clock__colon-dot"></span>
        </span>
        <span className="clock__time clock__time--bold" style={{ color: primaryColor }}>
          {minute}
        </span>
        {showAmPm && timeFormat === '12' && (
          <span className="clock__ampm clock__ampm--bold" style={{ color: secondaryColor }}>
            {ampm}
          </span>
        )}
      </div>
      {showDate && dateStr && (
        <div className="clock__date clock__date--bold" style={{ color: secondaryColor }}>
          {dateStr.toUpperCase()}
        </div>
      )}
    </div>
  )
}

// Analog Classic Clock Component - Swiss Precision Style
function AnalogClassicClock({
  time,
  timezone,
  showSeconds,
  primaryColor,
  accentColor,
}: {
  time: Date
  timezone: string
  showSeconds: boolean
  primaryColor: string
  accentColor: string
}) {
  const timeParts = getTimeParts(time, timezone)

  // Show error state if time calculation fails
  if (!timeParts) {
    return <ErrorDisplay primaryColor={primaryColor} />
  }

  const { hours, minutes, seconds, milliseconds } = timeParts
  const hourDeg = (hours * 30) + (minutes * 0.5)
  const minuteDeg = (minutes * 6) + (seconds * 0.1)
  const secondDeg = (seconds * 6) + (milliseconds * 0.006)

  const numerals = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

  return (
    <div className="clock clock--analog-classic">
      <svg viewBox="0 0 200 200" className="clock__face clock__face--classic">
        {/* Outer rim - Swiss style silver */}
        <circle cx="100" cy="100" r="97" fill="none" stroke="#b8b8b8" strokeWidth="5" />
        {/* Face */}
        <circle cx="100" cy="100" r="92" fill="#ffffff" />

        {/* Hour markers and numerals */}
        {numerals.map((num, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180)
          const isQuarter = [12, 3, 6, 9].includes(num)
          const x1 = 100 + 75 * Math.cos(angle)
          const y1 = 100 + 75 * Math.sin(angle)
          const x2 = 100 + 85 * Math.cos(angle)
          const y2 = 100 + 85 * Math.sin(angle)
          const textX = 100 + 62 * Math.cos(angle)
          const textY = 100 + 62 * Math.sin(angle)

          return (
            <g key={num}>
              {/* Thicker markers at quarters, thinner at other hours */}
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#222"
                strokeWidth={isQuarter ? '4' : '2'}
                strokeLinecap="round"
              />
              {/* Bold numerals at 12, 3, 6, 9 for 10ft readability */}
              {isQuarter && (
                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="22"
                  fontWeight="700"
                  fontFamily="Rubik, sans-serif"
                  fill="#222"
                >
                  {num}
                </text>
              )}
            </g>
          )
        })}

        {/* Hour hand - Swiss Precision: thick rectangle with rounded end */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="48"
          stroke="#1a1a1a"
          strokeWidth="6"
          strokeLinecap="round"
          transform={`rotate(${hourDeg} 100 100)`}
        />

        {/* Minute hand - thinner but same style */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="28"
          stroke="#1a1a1a"
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${minuteDeg} 100 100)`}
        />

        {/* Second hand */}
        {showSeconds && (
          <line
            x1="100"
            y1="118"
            x2="100"
            y2="22"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${secondDeg} 100 100)`}
          />
        )}

        {/* Center cap - larger with shadow effect */}
        <circle cx="100" cy="100" r="7" fill="#1a1a1a" />
        <circle cx="100" cy="100" r="4" fill="#333" />
      </svg>
    </div>
  )
}

// Analog Modern Clock Component - Swiss Precision Style (Dark)
function AnalogModernClock({
  time,
  timezone,
  showSeconds,
  primaryColor,
  accentColor,
}: {
  time: Date
  timezone: string
  showSeconds: boolean
  primaryColor: string
  accentColor: string
}) {
  const timeParts = getTimeParts(time, timezone)

  // Show error state if time calculation fails
  if (!timeParts) {
    return <ErrorDisplay primaryColor={primaryColor} />
  }

  const { hours, minutes, seconds, milliseconds } = timeParts
  const hourDeg = (hours * 30) + (minutes * 0.5)
  const minuteDeg = (minutes * 6) + (seconds * 0.1)
  const secondDeg = (seconds * 6) + (milliseconds * 0.006)

  return (
    <div className="clock clock--analog-modern">
      <svg viewBox="0 0 200 200" className="clock__face clock__face--modern">
        {/* Outer rim - Swiss style */}
        <circle cx="100" cy="100" r="97" fill="none" stroke="#404040" strokeWidth="5" />
        {/* Face */}
        <circle cx="100" cy="100" r="92" fill="#1a1a1a" />

        {/* Hour markers (bars) - thicker at quarters */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180)
          const isQuarter = i % 3 === 0
          const x1 = 100 + 72 * Math.cos(angle)
          const y1 = 100 + 72 * Math.sin(angle)
          const x2 = 100 + 84 * Math.cos(angle)
          const y2 = 100 + 84 * Math.sin(angle)

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={primaryColor}
              strokeWidth={isQuarter ? '5' : '2'}
              strokeLinecap="round"
            />
          )
        })}

        {/* Hour hand - Swiss Precision: thick */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="50"
          stroke={primaryColor}
          strokeWidth="6"
          strokeLinecap="round"
          transform={`rotate(${hourDeg} 100 100)`}
        />

        {/* Minute hand - thinner but same style */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="30"
          stroke={primaryColor}
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${minuteDeg} 100 100)`}
        />

        {/* Second hand */}
        {showSeconds && (
          <g transform={`rotate(${secondDeg} 100 100)`}>
            <line
              x1="100"
              y1="118"
              x2="100"
              y2="25"
              stroke={accentColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="100" cy="118" r="5" fill={accentColor} />
          </g>
        )}

        {/* Center cap - larger with layered effect */}
        <circle cx="100" cy="100" r="7" fill={primaryColor} />
        <circle cx="100" cy="100" r="4" fill="#333" />
      </svg>
    </div>
  )
}

// Analog Minimal Clock Component - Swiss Precision Style (Ultra-clean)
function AnalogMinimalClock({
  time,
  timezone,
  showSeconds,
  primaryColor,
  accentColor,
}: {
  time: Date
  timezone: string
  showSeconds: boolean
  primaryColor: string
  accentColor: string
}) {
  const timeParts = getTimeParts(time, timezone)

  // Show error state if time calculation fails
  if (!timeParts) {
    return <ErrorDisplay primaryColor={primaryColor} />
  }

  const { hours, minutes, seconds, milliseconds } = timeParts
  const hourDeg = (hours * 30) + (minutes * 0.5)
  const minuteDeg = (minutes * 6) + (seconds * 0.1)
  const secondDeg = (seconds * 6) + (milliseconds * 0.006)

  return (
    <div className="clock clock--analog-minimal">
      <svg viewBox="0 0 200 200" className="clock__face clock__face--minimal">
        {/* Thin circle outline - slightly thicker for visibility */}
        <circle cx="100" cy="100" r="92" fill="none" stroke={primaryColor} strokeWidth="2" />

        {/* Hour hand - thicker for readability */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="50"
          stroke={primaryColor}
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${hourDeg} 100 100)`}
        />

        {/* Minute hand */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="30"
          stroke={primaryColor}
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${minuteDeg} 100 100)`}
        />

        {/* Second hand */}
        {showSeconds && (
          <line
            x1="100"
            y1="115"
            x2="100"
            y2="22"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            transform={`rotate(${secondDeg} 100 100)`}
          />
        )}

        {/* Center dot - larger */}
        <circle cx="100" cy="100" r="5" fill={accentColor} />

        {/* Small dot at 12 o'clock for orientation */}
        <circle cx="100" cy="18" r="3" fill={primaryColor} />
      </svg>
    </div>
  )
}

// Main Render Component
export function Render() {
  const [, uiScale] = useUiScaleStoreState()
  useUiScaleToSetRem(uiScale)

  const [isLoadingStyle, clockStyle] = useClockStyleStoreState()
  const [isLoadingTimeFormat, timeFormat] = useTimeFormatStoreState()
  const [isLoadingShowSeconds, showSeconds] = useShowSecondsStoreState()
  const [isLoadingShowAmPm, showAmPm] = useShowAmPmStoreState()
  const [isLoadingShowDate, showDate] = useShowDateStoreState()
  const [isLoadingDateFormat, dateFormat] = useDateFormatStoreState()
  const [isLoadingDayOfWeek, dayOfWeek] = useDayOfWeekFormatStoreState()
  const [isLoadingMonthFormat, monthFormat] = useMonthFormatStoreState()
  const [isLoadingTimezone, timezone] = useTimezoneStoreState()
  const [isLoadingCityName, showCityName] = useShowCityNameStoreState()
  const [isLoadingTzAbbr, showTimezoneAbbr] = useShowTimezoneAbbrStoreState()
  const [isLoadingPrimary, primaryColor] = usePrimaryColorStoreState()
  const [isLoadingSecondary, secondaryColor] = useSecondaryColorStoreState()
  const [isLoadingBg, backgroundColor] = useBackgroundColorStoreState()
  const [isLoadingBgOpacity, backgroundOpacity] = useBackgroundOpacityStoreState()
  const [isLoadingAccent, accentColor] = useAccentColorStoreState()
  const [isLoadingGreeting, showGreeting] = useShowGreetingStoreState()
  const [isLoadingCustomGreeting, customGreeting] = useCustomGreetingStoreState()
  const [isLoadingTitleLabel, titleLabel] = useTitleLabelStoreState()

  const time = useCurrentTime(timezone)

  // Get greeting with error handling
  let greeting = ''
  try {
    greeting = showGreeting ? getGreeting(time, timezone, customGreeting) : ''
  } catch {
    // Silently fail for greeting - not critical
  }

  // Background style with error handling
  const bgStyle = useMemo(() => {
    try {
      const opacity = backgroundOpacity / 100
      // Convert hex to rgba
      const hex = backgroundColor.replace('#', '')
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      return {
        backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})`,
      }
    } catch {
      // Fallback to solid dark background
      return { backgroundColor: '#1a1a1a' }
    }
  }, [backgroundColor, backgroundOpacity])

  const isDigital = clockStyle.startsWith('digital')

  // Unified title: Display Label takes priority, otherwise city name if enabled
  const displayTitle = titleLabel || (showCityName ? getCityName(timezone) : '')

  const renderClock = () => {
    switch (clockStyle) {
      case 'digital-led':
        return (
          <DigitalLedClock
            time={time}
            timezone={timezone}
            timeFormat={timeFormat}
            showSeconds={showSeconds}
            showAmPm={showAmPm}
            showDate={showDate}
            dateFormat={dateFormat}
            dayOfWeek={dayOfWeek}
            monthFormat={monthFormat}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        )
      case 'digital-minimal':
        return (
          <DigitalMinimalClock
            time={time}
            timezone={timezone}
            timeFormat={timeFormat}
            showSeconds={showSeconds}
            showAmPm={showAmPm}
            showDate={showDate}
            dateFormat={dateFormat}
            dayOfWeek={dayOfWeek}
            monthFormat={monthFormat}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        )
      case 'digital-bold':
        return (
          <DigitalBoldClock
            time={time}
            timezone={timezone}
            timeFormat={timeFormat}
            showSeconds={showSeconds}
            showAmPm={showAmPm}
            showDate={showDate}
            dateFormat={dateFormat}
            dayOfWeek={dayOfWeek}
            monthFormat={monthFormat}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            accentColor={accentColor}
          />
        )
      case 'analog-classic':
        return (
          <AnalogClassicClock
            time={time}
            timezone={timezone}
            showSeconds={showSeconds}
            primaryColor={primaryColor}
            accentColor={accentColor}
          />
        )
      case 'analog-modern':
        return (
          <AnalogModernClock
            time={time}
            timezone={timezone}
            showSeconds={showSeconds}
            primaryColor={primaryColor}
            accentColor={accentColor}
          />
        )
      case 'analog-minimal':
        return (
          <AnalogMinimalClock
            time={time}
            timezone={timezone}
            showSeconds={showSeconds}
            primaryColor={primaryColor}
            accentColor={accentColor}
          />
        )
      default:
        return (
          <DigitalMinimalClock
            time={time}
            timezone={timezone}
            timeFormat={timeFormat}
            showSeconds={showSeconds}
            showAmPm={showAmPm}
            showDate={showDate}
            dateFormat={dateFormat}
            dayOfWeek={dayOfWeek}
            monthFormat={monthFormat}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        )
    }
  }

  return (
    <div className="render" style={bgStyle}>
      {displayTitle && (
        <div className="render__title-label" style={{ color: secondaryColor }}>
          {displayTitle}
        </div>
      )}

      {showGreeting && (
        <div className="render__greeting" style={{ color: secondaryColor }}>
          {greeting}
        </div>
      )}

      <div className="render__clock-container">{renderClock()}</div>
    </div>
  )
}
