import { getNightsBetween, parseDate } from '../../utils/date'

const statusStyles = {
  confirmed: 'bg-emerald-50 text-emerald-800',
  checked_in: 'bg-blue-50 text-blue-800',
  checked_out: 'bg-slate-100 text-slate-700',
  cancelled: 'bg-rose-50 text-rose-800',
}

export function BookingCard({ booking }) {
  const nights = getNightsBetween(parseDate(booking.checkIn), parseDate(booking.checkOut))
  const statusClassName = statusStyles[booking.status] || 'bg-[#f1f3fe] text-[#414755]'

  return (
    <article className="rounded-xl border border-[#e0e2ed] bg-white/75 p-3 shadow-sm transition hover:bg-white">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{booking.guestName}</p>
          <p className="mt-1 text-xs text-[#717786]">
            Room {booking.roomNumber} - {booking.roomType}
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${statusClassName}`}>
          {booking.status.replace('_', ' ')}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[#414755]">
        <div>
          <p className="font-semibold text-[#717786]">Check-in</p>
          <p>{booking.checkIn}</p>
        </div>
        <div>
          <p className="font-semibold text-[#717786]">Check-out</p>
          <p>{booking.checkOut}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-[#717786]">{nights} nights</span>
        <span className="font-semibold text-[#181c23]">
          {booking.currency} {booking.totalAmount.toLocaleString('en-IN')}
        </span>
      </div>
    </article>
  )
}
