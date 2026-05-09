import { TOTAL_ROOMS, getOccupancyColor } from '../../utils/occupancy'

export function CalendarCell({
  cell,
  isSelected,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) {
  const occupiedRooms = cell.occupancy.occupiedRooms
  const occupancyColor = getOccupancyColor(occupiedRooms)

  return (
    <button
      className={`group relative flex min-h-28 select-none flex-col rounded-2xl border p-3 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_28px_rgba(24,28,35,0.08)] ${
        occupancyColor.cell
      } ${cell.currentMonth ? '' : 'opacity-45'} ${
        isSelected ? 'ring-2 ring-[#0058bc] ring-offset-2 ring-offset-[#f9f9ff]' : ''
      }`}
      onMouseDown={() => onMouseDown(cell.date)}
      onMouseEnter={() => onMouseEnter(cell.date)}
      onMouseUp={onMouseUp}
      type="button"
    >
      {isSelected && (
        <span className="pointer-events-none absolute inset-0 rounded-2xl bg-[#0058bc]/10" />
      )}
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
