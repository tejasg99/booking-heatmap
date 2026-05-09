import { useMemo, useReducer } from 'react'
import { CalendarGrid } from './components/calendar/CalendarGrid'
import { FilterBar } from './components/filters/FilterBar'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { Header } from './components/layout/Header'
import { LoadingPanel } from './components/layout/LoadingPanel'
import { BookingSidebar } from './components/sidebar/BookingSidebar'
import { StatsStrip } from './components/stats/StatsStrip'
import { useBookings } from './hooks/useBookings'
import { generateCalendarGrid } from './utils/calendar'
import { calculateDashboardStats, isBookingActive } from './utils/occupancy'
import {
  doesBookingOverlapRange,
  isDateInRange,
  sortDateRange,
} from './utils/selection'

const initialCalendarDate = new Date(2026, 0, 1)

const initialDashboardState = {
  currentDate: initialCalendarDate,
  selectionStart: null,
  selectionEnd: null,
  isDragging: false,
  filters: {
    roomNumber: 'all',
    status: 'all',
  },
}

function dashboardReducer(state, action) {
  switch (action.type) {
    case 'next-month':
      return {
        ...state,
        currentDate: new Date(
          state.currentDate.getFullYear(),
          state.currentDate.getMonth() + 1,
          1,
        ),
      }
    case 'previous-month':
      return {
        ...state,
        currentDate: new Date(
          state.currentDate.getFullYear(),
          state.currentDate.getMonth() - 1,
          1,
        ),
      }
    case 'today':
      return {
        ...state,
        currentDate: new Date(),
      }
    case 'selection-start':
      return {
        ...state,
        selectionStart: action.date,
        selectionEnd: action.date,
        isDragging: true,
      }
    case 'selection-move':
      if (!state.isDragging) return state

      return {
        ...state,
        selectionEnd: action.date,
      }
    case 'selection-end':
      return {
        ...state,
        isDragging: false,
      }
    case 'selection-clear':
      return {
        ...state,
        selectionStart: null,
        selectionEnd: null,
        isDragging: false,
      }
    case 'filter-room':
      return {
        ...state,
        filters: {
          ...state.filters,
          roomNumber: action.roomNumber,
        },
      }
    case 'filter-status':
      return {
        ...state,
        filters: {
          ...state.filters,
          status: action.status,
        },
      }
    default:
      return state
  }
}

function applyBookingFilters(bookings, filters) {
  return bookings.filter((booking) => {
    const matchesRoom = filters.roomNumber === 'all'
      || booking.roomNumber === filters.roomNumber
    const matchesStatus = filters.status === 'all'
      || booking.status === filters.status

    return matchesRoom && matchesStatus
  })
}

function App() {
  const { bookings, loading, error } = useBookings()
  const [dashboardState, dispatch] = useReducer(
    dashboardReducer,
    initialDashboardState,
  )
  const {
    currentDate,
    selectionStart,
    selectionEnd,
    filters,
  } = dashboardState

  const roomOptions = useMemo(
    () => Array.from(new Set(bookings.map((booking) => booking.roomNumber))).sort(),
    [bookings],
  )

  const filteredBookings = useMemo(
    () => applyBookingFilters(bookings, filters),
    [bookings, filters],
  )

  const calendarCells = useMemo(
    () => generateCalendarGrid(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      filteredBookings,
    ),
    [filteredBookings, currentDate],
  )

  const activeBookings = useMemo(
    () => filteredBookings.filter(isBookingActive),
    [filteredBookings],
  )

  const stats = useMemo(
    () => calculateDashboardStats(filteredBookings, calendarCells),
    [filteredBookings, calendarCells],
  )

  const selectedRange = useMemo(
    () => sortDateRange(selectionStart, selectionEnd),
    [selectionStart, selectionEnd],
  )

  const sidebarBookings = useMemo(() => {
    if (!selectedRange.start || !selectedRange.end) {
      return activeBookings.slice(0, 12)
    }

    return activeBookings.filter((booking) =>
      doesBookingOverlapRange(booking, selectedRange.start, selectedRange.end),
    )
  }, [activeBookings, selectedRange])

  const isFiltered = filters.roomNumber !== 'all' || filters.status !== 'all'
  const hasSelection = Boolean(selectedRange.start && selectedRange.end)

  function goToNextMonth() {
    dispatch({ type: 'next-month' })
  }

  function goToPrevMonth() {
    dispatch({ type: 'previous-month' })
  }

  function goToToday() {
    dispatch({ type: 'today' })
  }

  function startSelection(date) {
    dispatch({ type: 'selection-start', date })
  }

  function moveSelection(date) {
    dispatch({ type: 'selection-move', date })
  }

  function endSelection() {
    dispatch({ type: 'selection-end' })
  }

  function isSelectedDate(date) {
    return isDateInRange(date, selectedRange.start, selectedRange.end)
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
        filters={null}
        calendar={<LoadingPanel />}
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
        filters={null}
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
      filters={(
        <FilterBar
          filters={filters}
          hasSelection={hasSelection}
          onClearSelection={() => dispatch({ type: 'selection-clear' })}
          onRoomChange={(roomNumber) => dispatch({ type: 'filter-room', roomNumber })}
          onStatusChange={(status) => dispatch({ type: 'filter-status', status })}
          rooms={roomOptions}
        />
      )}
      calendar={(
        <CalendarGrid
          cells={calendarCells}
          isFiltering={isFiltered}
          isDateSelected={isSelectedDate}
          onSelectionEnd={endSelection}
          onSelectionMove={moveSelection}
          onSelectionStart={startSelection}
        />
      )}
      sidebar={(
        <BookingSidebar
          bookings={sidebarBookings}
          isFiltered={isFiltered}
          selectedRange={selectedRange}
        />
      )}
    />
  )
}

export default App
