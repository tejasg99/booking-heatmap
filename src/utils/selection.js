import { addDays, normalizeDate, parseDate } from './date'

export function sortDateRange(start, end) {
  if (!start || !end) {
    return {
      start: start || null,
      end: end || null,
    }
  }

  const normalizedStart = normalizeDate(start)
  const normalizedEnd = normalizeDate(end)

  if (normalizedStart.getTime() <= normalizedEnd.getTime()) {
    return {
      start: normalizedStart,
      end: normalizedEnd,
    }
  }

  return {
    start: normalizedEnd,
    end: normalizedStart,
  }
}

export function isDateInRange(date, start, end) {
  if (!date || !start || !end) {
    return false
  }

  const targetTime = normalizeDate(date).getTime()
  const range = sortDateRange(start, end)

  return range.start.getTime() <= targetTime && targetTime <= range.end.getTime()
}

export function doesBookingOverlapRange(booking, start, end) {
  if (!booking || !start || !end) {
    return false
  }

  const range = sortDateRange(start, end)
  const checkInTime = parseDate(booking.checkIn).getTime()
  const checkOutTime = parseDate(booking.checkOut).getTime()
  const rangeEndExclusive = addDays(range.end, 1).getTime()

  return checkInTime < rangeEndExclusive && checkOutTime > range.start.getTime()
}
