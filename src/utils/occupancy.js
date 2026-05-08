import { getDateKey, normalizeDate, parseDate } from './date'

export const TOTAL_ROOMS = 10

const INACTIVE_BOOKING_STATUSES = new Set(['cancelled'])

export function isBookingActive(booking) {
  return !INACTIVE_BOOKING_STATUSES.has(booking.status)
}

export function doesBookingOccupyDate(booking, targetDate) {
  if (!isBookingActive(booking)) {
    return false
  }

  const targetTime = normalizeDate(targetDate).getTime()
  const checkInTime = parseDate(booking.checkIn).getTime()
  const checkOutTime = parseDate(booking.checkOut).getTime()

  return checkInTime <= targetTime && targetTime < checkOutTime
}

export function calculateOccupancy(bookings, targetDate) {
  const overlappingBookings = bookings.filter((booking) =>
    doesBookingOccupyDate(booking, targetDate),
  )
  const occupiedRooms = new Set(
    overlappingBookings.map((booking) => booking.roomNumber),
  ).size

  return {
    occupiedRooms,
    overlappingBookings,
  }
}

export function buildOccupancyMap(bookings, dates) {
  return dates.reduce((occupancyMap, date) => {
    occupancyMap[getDateKey(date)] = calculateOccupancy(bookings, date)
    return occupancyMap
  }, {})
}

export function getOccupancyLevel(occupiedRooms, totalRooms = TOTAL_ROOMS) {
  if (totalRooms <= 0) {
    return 'empty'
  }

  const ratio = occupiedRooms / totalRooms

  if (ratio === 0) return 'empty'
  if (ratio <= 0.2) return 'low'
  if (ratio <= 0.4) return 'medium'
  if (ratio <= 0.6) return 'amber'
  if (ratio <= 0.8) return 'high'
  return 'full'
}
