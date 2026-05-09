import { addDays, getDateKey } from './date'
import { buildOccupancyMap } from './occupancy'

const CALENDAR_ROWS = 6
const DAYS_PER_WEEK = 7
const CALENDAR_CELL_COUNT = CALENDAR_ROWS * DAYS_PER_WEEK

export function getCalendarDates(year, month) {
  const firstOfMonth = new Date(year, month, 1)
  const gridStart = addDays(firstOfMonth, -firstOfMonth.getDay())

  return Array.from({ length: CALENDAR_CELL_COUNT }, (_, index) =>
    addDays(gridStart, index),
  )
}

export function generateCalendarGrid(year, month, bookings = []) {
  const dates = getCalendarDates(year, month)
  const occupancyMap = buildOccupancyMap(bookings, dates)

  return dates.map((date) => {
    const occupancy = occupancyMap[getDateKey(date)]

    return {
      id: getDateKey(date),
      date,
      currentMonth: date.getMonth() === month,
      occupancy,
      bookings: occupancy.overlappingBookings,
    }
  })
}

export function chunkCalendarWeeks(cells) {
  return Array.from({ length: CALENDAR_ROWS }, (_, weekIndex) =>
    cells.slice(weekIndex * DAYS_PER_WEEK, (weekIndex + 1) * DAYS_PER_WEEK),
  )
}
