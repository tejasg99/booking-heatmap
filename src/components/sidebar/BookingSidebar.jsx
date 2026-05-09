import { getDateKey } from '../../utils/date'
import { BookingCard } from './BookingCard'

function getRangeTitle(selectedRange) {
  if (!selectedRange.start || !selectedRange.end) {
    return 'Recent stays'
  }

  const start = getDateKey(selectedRange.start)
  const end = getDateKey(selectedRange.end)

  if (start === end) {
    return start
  }

  return `${start} to ${end}`
}

export function BookingSidebar({ bookings, selectedRange }) {
  const title = getRangeTitle(selectedRange)

  return (
    <aside className="sticky top-8 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.05)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-[#717786]">Booking Sidebar</p>
          <h2 className="mt-1 text-xl font-semibold">{title}</h2>
        </div>
        <span className="rounded-full bg-[#ecedf9] px-3 py-1 text-xs font-semibold text-[#414755]">
          {bookings.length}
        </span>
      </div>

      <div className="mt-5 flex max-h-[calc(100vh-220px)] flex-col gap-3 overflow-y-auto pr-1">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <BookingCard booking={booking} key={booking.id} />
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-[#c1c6d7] bg-white/60 p-4 text-sm text-[#717786]">
            No bookings in this range.
          </div>
        )}
      </div>
    </aside>
  )
}
