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

export function getCalendarOccupancyDates(bookings) {
  const dateKeys = new Set()

  bookings.filter(isBookingActive).forEach((booking) => {
    const checkIn = parseDate(booking.checkIn)
    const checkOut = parseDate(booking.checkOut)

    for (
      let date = normalizeDate(checkIn);
      date.getTime() < checkOut.getTime();
      date.setDate(date.getDate() + 1)
    ) {
      dateKeys.add(getDateKey(date))
    }
  })

  return Array.from(dateKeys).map(parseDate)
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

export function calculateDashboardStats(bookings, calendarCells, totalRooms = TOTAL_ROOMS) {
  const activeBookings = bookings.filter(isBookingActive)
  const currentMonthCells = calendarCells.filter((cell) => cell.currentMonth)
  const roomNightsAvailable = currentMonthCells.length * totalRooms
  const occupiedRoomNights = currentMonthCells.reduce(
    (total, cell) => total + cell.occupancy.occupiedRooms,
    0,
  )
  const averageOccupancy = roomNightsAvailable
    ? Math.round((occupiedRoomNights / roomNightsAvailable) * 100)
    : 0
  const highestOccupancyDay = currentMonthCells.reduce((highestDay, cell) => {
    if (!highestDay) return cell
    return cell.occupancy.occupiedRooms > highestDay.occupancy.occupiedRooms
      ? cell
      : highestDay
  }, null)

  return {
    totalBookings: bookings.length,
    activeBookings: activeBookings.length,
    averageOccupancy,
    highestOccupancyDay,
    occupiedRoomNights,
  }
}
