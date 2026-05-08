import { useMemo } from 'react'
import { useBookings } from './hooks/useBookings'
import { generateCalendarGrid } from './utils/calendar'
import { getOccupancyLevel, TOTAL_ROOMS } from './utils/occupancy'

const initialCalendarDate = new Date(2026, 0, 1)

const monthFormatter = new Intl.DateTimeFormat('en', {
  month: 'long',
  year: 'numeric',
})

const levelStyles = {
  empty: 'bg-white text-slate-500 border-slate-200',
  low: 'bg-emerald-50 text-emerald-800 border-emerald-100',
  medium: 'bg-yellow-50 text-yellow-800 border-yellow-100',
  amber: 'bg-amber-100 text-amber-900 border-amber-200',
  high: 'bg-orange-100 text-orange-900 border-orange-200',
  full: 'bg-rose-100 text-rose-900 border-rose-200',
}

function App() {
  const { bookings, loading, error } = useBookings()
  const calendarCells = useMemo(
    () => generateCalendarGrid(
      initialCalendarDate.getFullYear(),
      initialCalendarDate.getMonth(),
      bookings,
    ),
    [bookings],
  )
  const activeBookings = useMemo(
    () => bookings.filter((booking) => booking.status !== 'cancelled'),
    [bookings],
  )

  return (
    <main className="min-h-screen bg-[#f9f9ff] px-8 py-8 text-[#181c23]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-[#414755]">
              Hotel Occupancy Heatmap
            </p>
            <h1 className="mt-2 text-3xl font-semibold">
              {monthFormatter.format(initialCalendarDate)}
            </h1>
          </div>
          <div className="rounded-full border border-[#c1c6d7] bg-white/80 px-4 py-2 text-sm text-[#414755] shadow-sm">
            Phase 1-3 foundation
          </div>
        </header>

        {loading && (
          <section className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.05)]">
            <p className="text-sm text-[#414755]">Loading bookings from public data...</p>
          </section>
        )}

        {error && (
          <section className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-900 shadow-sm">
            <p className="font-semibold">Could not load bookings</p>
            <p className="mt-1 text-sm">{error.message}</p>
          </section>
        )}

        {!loading && !error && (
          <>
            <section className="grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.05)]">
                <p className="text-xs font-semibold uppercase text-[#717786]">
                  Total Bookings
                </p>
                <p className="mt-2 text-3xl font-semibold">{bookings.length}</p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.05)]">
                <p className="text-xs font-semibold uppercase text-[#717786]">
                  Active Bookings
                </p>
                <p className="mt-2 text-3xl font-semibold">{activeBookings.length}</p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.05)]">
                <p className="text-xs font-semibold uppercase text-[#717786]">
                  Room Capacity
                </p>
                <p className="mt-2 text-3xl font-semibold">{TOTAL_ROOMS}</p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.05)]">
              <div className="grid grid-cols-7 gap-3 text-center text-xs font-semibold uppercase text-[#717786]">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-7 gap-3">
                {calendarCells.map((cell) => {
                  const level = getOccupancyLevel(cell.occupancy.occupiedRooms)

                  return (
                    <div
                      className={`min-h-24 rounded-2xl border p-3 shadow-sm transition ${
                        levelStyles[level]
                      } ${cell.currentMonth ? '' : 'opacity-45'}`}
                      key={cell.id}
                    >
                      <p className="text-sm font-semibold">{cell.date.getDate()}</p>
                      <p className="mt-6 text-xs font-medium">
                        {cell.occupancy.occupiedRooms}/{TOTAL_ROOMS}
                      </p>
                    </div>
                  )
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  )
}

export default App
