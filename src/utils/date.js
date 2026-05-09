export function parseDate(value) {
  if (value instanceof Date) {
    return normalizeDate(value)
  }

  if (typeof value === 'string') {
    const [year, month, day] = value.split('-').map(Number)

    if (Number.isInteger(year) && Number.isInteger(month) && Number.isInteger(day)) {
      return new Date(year, month - 1, day)
    }
  }

  return normalizeDate(new Date(value))
}

export function normalizeDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function addDays(date, amount) {
  const nextDate = normalizeDate(date)
  nextDate.setDate(nextDate.getDate() + amount)
  return nextDate
}

export function isSameDay(a, b) {
  return normalizeDate(a).getTime() === normalizeDate(b).getTime()
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

export function getDateKey(date) {
  const normalizedDate = normalizeDate(date)
  const year = normalizedDate.getFullYear()
  const month = String(normalizedDate.getMonth() + 1).padStart(2, '0')
  const day = String(normalizedDate.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getNightsBetween(start, end) {
  const startTime = normalizeDate(start).getTime()
  const endTime = normalizeDate(end).getTime()
  const millisecondsPerDay = 1000 * 60 * 60 * 24

  return Math.max(0, Math.round((endTime - startTime) / millisecondsPerDay))
}
