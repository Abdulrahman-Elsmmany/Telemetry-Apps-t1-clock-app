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

// Format time based on settings
function formatTime(
  date: Date,
  timezone: string,
  format: '12' | '24',
  showSeconds: boolean
) {
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
}

// Get AM/PM
function getAmPm(date: Date, timezone: string): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    hour: 'numeric',
    hour12: true,
  }
  const formatted = new Intl.DateTimeFormat('en-US', options).format(date)
  return formatted.includes('AM') ? 'AM' : 'PM'
}

// Format date based on settings
function formatDate(
  date: Date,
  timezone: string,
  dateFormat: string,
  dayOfWeek: string,
  monthFormat: string
): string {
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
}

// Get timezone abbreviation
function getTimezoneAbbr(date: Date, timezone: string): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    timeZoneName: 'short',
  }
  const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date)
  const tzPart = parts.find((p) => p.type === 'timeZoneName')
  return tzPart?.value || ''
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

// Get time parts for analog clock
function getTimeParts(date: Date, timezone: string) {
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
  const dateStr = showDate ? formatDate(time, timezone, dateFormat, dayOfWeek, monthFormat) : ''

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
      {showDate && (
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
  const dateStr = showDate ? formatDate(time, timezone, dateFormat, dayOfWeek, monthFormat) : ''

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
      {showDate && (
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
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: timeFormat === '12',
  }
  const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(time)

  const hour = parts.find((p) => p.type === 'hour')?.value || '00'
  const minute = parts.find((p) => p.type === 'minute')?.value || '00'
  const ampm = timeFormat === '12' ? getAmPm(time, timezone) : ''
  const dateStr = showDate ? formatDate(time, timezone, dateFormat, dayOfWeek, monthFormat) : ''

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
      {showDate && (
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
  secondaryColor,
  accentColor,
  showCityName,
  showTimezoneAbbr,
}: {
  time: Date
  timezone: string
  showSeconds: boolean
  primaryColor: string
  secondaryColor: string
  accentColor: string
  showCityName: boolean
  showTimezoneAbbr: boolean
}) {
  const { hours, minutes, seconds, milliseconds } = getTimeParts(time, timezone)

  const hourDeg = (hours * 30) + (minutes * 0.5)
  const minuteDeg = (minutes * 6) + (seconds * 0.1)
  const secondDeg = (seconds * 6) + (milliseconds * 0.006)

  const cityName = showCityName ? getCityName(timezone) : ''
  const tzAbbr = showTimezoneAbbr ? getTimezoneAbbr(time, timezone) : ''
  const locationLabel = [cityName, tzAbbr].filter(Boolean).join(' · ')

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

        {/* Location label - rendered before hands so hands pass over it */}
        {locationLabel && (
          <text
            x="100"
            y="140"
            textAnchor="middle"
            fontSize="12"
            fontWeight="500"
            fontFamily="Rubik, sans-serif"
            fill="#555"
          >
            {locationLabel}
          </text>
        )}

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
  secondaryColor,
  accentColor,
  showCityName,
  showTimezoneAbbr,
}: {
  time: Date
  timezone: string
  showSeconds: boolean
  primaryColor: string
  secondaryColor: string
  accentColor: string
  showCityName: boolean
  showTimezoneAbbr: boolean
}) {
  const { hours, minutes, seconds, milliseconds } = getTimeParts(time, timezone)

  const hourDeg = (hours * 30) + (minutes * 0.5)
  const minuteDeg = (minutes * 6) + (seconds * 0.1)
  const secondDeg = (seconds * 6) + (milliseconds * 0.006)

  const cityName = showCityName ? getCityName(timezone) : ''
  const tzAbbr = showTimezoneAbbr ? getTimezoneAbbr(time, timezone) : ''
  const locationLabel = [cityName, tzAbbr].filter(Boolean).join(' · ')

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

        {/* Location label - rendered before hands so hands pass over it */}
        {locationLabel && (
          <text
            x="100"
            y="140"
            textAnchor="middle"
            fontSize="12"
            fontWeight="500"
            fontFamily="Rubik, sans-serif"
            fill={secondaryColor}
          >
            {locationLabel}
          </text>
        )}

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
  secondaryColor,
  accentColor,
  showCityName,
  showTimezoneAbbr,
}: {
  time: Date
  timezone: string
  showSeconds: boolean
  primaryColor: string
  secondaryColor: string
  accentColor: string
  showCityName: boolean
  showTimezoneAbbr: boolean
}) {
  const { hours, minutes, seconds, milliseconds } = getTimeParts(time, timezone)

  const hourDeg = (hours * 30) + (minutes * 0.5)
  const minuteDeg = (minutes * 6) + (seconds * 0.1)
  const secondDeg = (seconds * 6) + (milliseconds * 0.006)

  const cityName = showCityName ? getCityName(timezone) : ''
  const tzAbbr = showTimezoneAbbr ? getTimezoneAbbr(time, timezone) : ''
  const locationLabel = [cityName, tzAbbr].filter(Boolean).join(' · ')

  return (
    <div className="clock clock--analog-minimal">
      <svg viewBox="0 0 200 200" className="clock__face clock__face--minimal">
        {/* Thin circle outline - slightly thicker for visibility */}
        <circle cx="100" cy="100" r="92" fill="none" stroke={primaryColor} strokeWidth="2" />

        {/* Location label - rendered early so hands pass over it */}
        {locationLabel && (
          <text
            x="100"
            y="145"
            textAnchor="middle"
            fontSize="12"
            fontWeight="500"
            fontFamily="Rubik, sans-serif"
            fill={secondaryColor}
          >
            {locationLabel}
          </text>
        )}

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

  // Check if any essential settings are still loading
  const isLoading = isLoadingStyle || isLoadingBg || isLoadingBgOpacity || isLoadingPrimary

  const time = useCurrentTime(timezone)
  const greeting = showGreeting ? getGreeting(time, timezone, customGreeting) : ''

  const bgStyle = useMemo(() => {
    const opacity = backgroundOpacity / 100
    // Convert hex to rgba
    const hex = backgroundColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return {
      backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})`,
    }
  }, [backgroundColor, backgroundOpacity])

  if (isLoading) {
    return (
      <div className="render" style={{ backgroundColor: '#1a1a1a' }}>
        <div style={{ color: '#ffffff', fontSize: '3rem' }}>Loading...</div>
      </div>
    )
  }

  const isDigital = clockStyle.startsWith('digital')
  const cityName = showCityName ? getCityName(timezone) : ''
  const tzAbbr = showTimezoneAbbr ? getTimezoneAbbr(time, timezone) : ''
  const locationLabel = [cityName, tzAbbr].filter(Boolean).join(' · ')

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
            secondaryColor={secondaryColor}
            accentColor={accentColor}
            showCityName={showCityName}
            showTimezoneAbbr={showTimezoneAbbr}
          />
        )
      case 'analog-modern':
        return (
          <AnalogModernClock
            time={time}
            timezone={timezone}
            showSeconds={showSeconds}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            accentColor={accentColor}
            showCityName={showCityName}
            showTimezoneAbbr={showTimezoneAbbr}
          />
        )
      case 'analog-minimal':
        return (
          <AnalogMinimalClock
            time={time}
            timezone={timezone}
            showSeconds={showSeconds}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            accentColor={accentColor}
            showCityName={showCityName}
            showTimezoneAbbr={showTimezoneAbbr}
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
      {titleLabel && (
        <div className="render__title-label" style={{ color: secondaryColor }}>
          {titleLabel}
        </div>
      )}

      {showGreeting && (
        <div className="render__greeting" style={{ color: secondaryColor }}>
          {greeting}
        </div>
      )}

      <div className="render__clock-container">{renderClock()}</div>

      {isDigital && locationLabel && (
        <div className="render__location" style={{ color: secondaryColor }}>
          {locationLabel}
        </div>
      )}
    </div>
  )
}
