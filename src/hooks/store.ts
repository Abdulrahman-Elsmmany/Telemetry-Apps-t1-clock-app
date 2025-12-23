import { createUseInstanceStoreState } from '@telemetryos/sdk/react'

// Clock style types
export type ClockStyle =
  | 'digital-led'
  | 'digital-minimal'
  | 'digital-bold'
  | 'analog-classic'
  | 'analog-modern'
  | 'analog-minimal'

export type TimeFormat = '12' | '24'
export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'written'
export type DayOfWeekFormat = 'off' | 'short' | 'full'
export type MonthFormat = 'number' | 'short' | 'full'

// UI Scale (for responsive sizing)
export const useUiScaleStoreState = createUseInstanceStoreState<number>('ui-scale', 1)

// Clock Style
export const useClockStyleStoreState = createUseInstanceStoreState<ClockStyle>('clock-style', 'digital-minimal')

// Time Settings
export const useTimeFormatStoreState = createUseInstanceStoreState<TimeFormat>('time-format', '12')
export const useShowSecondsStoreState = createUseInstanceStoreState<boolean>('show-seconds', false)
export const useShowAmPmStoreState = createUseInstanceStoreState<boolean>('show-ampm', true)

// Date Settings
export const useShowDateStoreState = createUseInstanceStoreState<boolean>('show-date', true)
export const useDateFormatStoreState = createUseInstanceStoreState<DateFormat>('date-format', 'written')
export const useDayOfWeekFormatStoreState = createUseInstanceStoreState<DayOfWeekFormat>('day-of-week', 'full')
export const useMonthFormatStoreState = createUseInstanceStoreState<MonthFormat>('month-format', 'short')

// Timezone Settings
export const useTimezoneStoreState = createUseInstanceStoreState<string>('timezone', 'America/New_York')
export const useShowCityNameStoreState = createUseInstanceStoreState<boolean>('show-city-name', false)
export const useShowTimezoneAbbrStoreState = createUseInstanceStoreState<boolean>('show-timezone-abbr', false)

// Color Settings
export const usePrimaryColorStoreState = createUseInstanceStoreState<string>('primary-color', '#ffffff')
export const useSecondaryColorStoreState = createUseInstanceStoreState<string>('secondary-color', '#9ca3af')
export const useBackgroundColorStoreState = createUseInstanceStoreState<string>('background-color', '#1a1a1a')
export const useBackgroundOpacityStoreState = createUseInstanceStoreState<number>('background-opacity', 100)

// Accent color (for analog clock second hand, colon, etc.)
export const useAccentColorStoreState = createUseInstanceStoreState<string>('accent-color', '#f97316')

// Greeting Settings
export const useShowGreetingStoreState = createUseInstanceStoreState<boolean>('show-greeting', false)
export const useCustomGreetingStoreState = createUseInstanceStoreState<string>('custom-greeting', '')
