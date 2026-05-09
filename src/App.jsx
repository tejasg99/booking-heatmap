import { useMemo, useState } from 'react'
import { CalendarGrid } from './components/calendar/CalendarGrid'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { Header } from './components/layout/Header'
import { BookingSidebar } from './components/sidebar/BookingSidebar'
import { StatsStrip } from './components/stats/StatsStrip'
import { useBookings } from './hooks/useBookings'
import { generateCalendarGrid } from './utils/calendar'
import { calculateDashboardStats, isBookingActive } from './utils/occupancy'

const initialCalendarDate = new Date(2026, 0, 1)

function App() {
  const { bookings, loading, error } = useBookings()
  const [currentDate, setCurrentDate] = useState(initialCalendarDate)

  const calendarCells = useMemo(
    () => generateCalendarGrid(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      bookings,
    ),
    [bookings, currentDate],
  )

  const activeBookings = useMemo(
    () => bookings.filter(isBookingActive),
    [bookings],
  )

  const stats = useMemo(
    () => calculateDashboardStats(bookings, calendarCells),
    [bookings, calendarCells],
  )

  function goToNextMonth() {
    setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1))
  }

  function goToPrevMonth() {
    setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1))
  }

  function goToToday() {
    setCurrentDate(new Date())
  }

  if (loading) {
    return (
      <DashboardLayout
        header={(
          <Header
            currentDate={currentDate}
            onNextMonth={goToNextMonth}
            onPrevMonth={goToPrevMonth}
            onToday={goToToday}
          />
        )}
        stats={null}
        calendar={(
          <section className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.05)]">
            <p className="text-sm text-[#414755]">Loading bookings from public data...</p>
          </section>
        )}
        sidebar={null}
      />
    )
  }

  if (error) {
    return (
      <DashboardLayout
        header={(
          <Header
            currentDate={currentDate}
            onNextMonth={goToNextMonth}
            onPrevMonth={goToPrevMonth}
            onToday={goToToday}
          />
        )}
        stats={null}
        calendar={(
          <section className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-900 shadow-sm">
            <p className="font-semibold">Could not load bookings</p>
            <p className="mt-1 text-sm">{error.message}</p>
          </section>
        )}
        sidebar={null}
      />
    )
  }

  return (
    <DashboardLayout
      header={(
        <Header
          currentDate={currentDate}
          onNextMonth={goToNextMonth}
          onPrevMonth={goToPrevMonth}
          onToday={goToToday}
        />
      )}
      stats={<StatsStrip stats={stats} />}
      calendar={<CalendarGrid cells={calendarCells} />}
      sidebar={<BookingSidebar bookings={activeBookings} />}
    />
  )
}

export default App
