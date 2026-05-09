import { getDateKey, normalizeDate, parseDate } from './date'

export const TOTAL_ROOMS = 10

const INACTIVE_BOOKING_STATUSES = new Set(['cancelled'])

const occupancyColorMap = {
  empty: {
    label: '0-2',
    cell: 'border-emerald-100 bg-emerald-50 text-emerald-900',
    swatch: 'bg-emerald-100',
  },
  low: {
    label: '0-2',
    cell: 'border-emerald-100 bg-emerald-50 text-emerald-900',
    swatch: 'bg-emerald-100',
  },
  medium: {
    label: '3-4',
    cell: 'border-yellow-100 bg-yellow-50 text-yellow-900',
    swatch: 'bg-yellow-100',
  },
  amber: {
    label: '5-6',
    cell: 'border-amber-200 bg-amber-100 text-amber-950',
    swatch: 'bg-amber-200',
  },
  high: {
    label: '7-8',
    cell: 'border-orange-200 bg-orange-100 text-orange-950',
    swatch: 'bg-orange-200',
  },
  full: {
    label: '9-10',
    cell: 'border-rose-200 bg-rose-100 text-rose-950',
    swatch: 'bg-rose-200',
  },
}

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

export function getOccupancyColor(occupiedRooms, totalRooms = TOTAL_ROOMS) {
  return occupancyColorMap[getOccupancyLevel(occupiedRooms, totalRooms)]
}

export function getOccupancyLegend() {
  return ['empty', 'medium', 'amber', 'high', 'full'].map((level) => occupancyColorMap[level])
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
