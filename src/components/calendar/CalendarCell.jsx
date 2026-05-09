import { TOTAL_ROOMS, getOccupancyLevel } from '../../utils/occupancy'

const occupancyStyles = {
  empty: 'border-slate-200 bg-white text-slate-500',
  low: 'border-emerald-100 bg-emerald-50 text-emerald-900',
  medium: 'border-yellow-100 bg-yellow-50 text-yellow-900',
  amber: 'border-amber-200 bg-amber-100 text-amber-950',
  high: 'border-orange-200 bg-orange-100 text-orange-950',
  full: 'border-rose-200 bg-rose-100 text-rose-950',
}

export function CalendarCell({ cell }) {
  const occupiedRooms = cell.occupancy.occupiedRooms
  const level = getOccupancyLevel(occupiedRooms)

  return (
    <button
      className={`group flex min-h-28 flex-col rounded-2xl border p-3 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_28px_rgba(24,28,35,0.08)] ${
        occupancyStyles[level]
      } ${cell.currentMonth ? '' : 'opacity-45'}`}
      type="button"
    >
      <span className="flex items-center justify-between">
        <span className="text-sm font-semibold">{cell.date.getDate()}</span>
        <span className="rounded-full bg-white/70 px-2 py-1 text-[11px] font-semibold text-[#414755]">
          {occupiedRooms}/{TOTAL_ROOMS}
        </span>
      </span>
      <span className="mt-auto text-xs font-medium text-[#414755]">
        {cell.bookings.length} bookings
      </span>
      <span className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/80">
        <span
          className="block h-full rounded-full bg-current transition-all"
          style={{ width: `${(occupiedRooms / TOTAL_ROOMS) * 100}%` }}
        />
      </span>
    </button>
  )
}
