import { getDateKey, normalizeDate, parseDate } from './date'

export const TOTAL_ROOMS = 10

const INACTIVE_BOOKING_STATUSES = new Set(['cancelled'])

const occupancyColorMap = {
  empty: {
    label: '0-2',
    cell: 'border-[#d6f2cd] bg-[radial-gradient(circle_at_30%_20%,#f5fff0_0%,#dff5d6_58%,#caedbf_100%)] text-[#14351c]',
    swatch: 'bg-[#42c967]',
    meter: 'bg-[#2fb956]',
  },
  low: {
    label: '0-2',
    cell: 'border-[#d6f2cd] bg-[radial-gradient(circle_at_30%_20%,#f5fff0_0%,#dff5d6_58%,#caedbf_100%)] text-[#14351c]',
    swatch: 'bg-[#42c967]',
    meter: 'bg-[#2fb956]',
  },
  medium: {
    label: '3-4',
    cell: 'border-[#eaf3a6] bg-[radial-gradient(circle_at_30%_20%,#faffc8_0%,#edf59b_58%,#ddeb75_100%)] text-[#243714]',
    swatch: 'bg-[#dce85a]',
    meter: 'bg-[#89b92a]',
  },
  amber: {
    label: '5-6',
    cell: 'border-[#ffe285] bg-[radial-gradient(circle_at_30%_20%,#fff3a9_0%,#ffe173_54%,#ffd04e_100%)] text-[#4a3500]',
    swatch: 'bg-[#ffc83f]',
    meter: 'bg-[#d99300]',
  },
  high: {
    label: '7-8',
    cell: 'border-[#ffc074] bg-[radial-gradient(circle_at_30%_20%,#ffd782_0%,#ffb955_54%,#ff9948_100%)] text-[#4d2400]',
    swatch: 'bg-[#ffad45]',
    meter: 'bg-[#ef6c18]',
  },
  full: {
    label: '9-10',
    cell: 'border-[#ff7b66] bg-[radial-gradient(circle_at_30%_20%,#ff8e63_0%,#ff674d_52%,#ff3838_100%)] text-white',
    swatch: 'bg-[#ff453f]',
    meter: 'bg-white',
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
  const revenue = activeBookings.reduce(
    (total, booking) => total + (Number(booking.totalAmount) || 0),
    0,
  )
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
    revenue,
  }
}
