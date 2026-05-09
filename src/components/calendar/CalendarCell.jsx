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
      className={`group relative flex min-h-28 select-none flex-col rounded-3xl border p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_10px_26px_rgba(24,28,35,0.05)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_16px_34px_rgba(24,28,35,0.1)] ${
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
        <span className="text-lg font-semibold">{cell.date.getDate()}</span>
        <span className="rounded-full bg-white/70 px-2 py-1 text-[11px] font-semibold text-[#414755] shadow-sm">
          {occupiedRooms}/{TOTAL_ROOMS}
        </span>
      </span>
      <span className="mt-auto text-xs font-semibold opacity-75">
        {cell.bookings.length} bookings
      </span>
      <span className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/80">
        <span
          className={`block h-full rounded-full transition-all ${occupancyColor.meter}`}
          style={{ width: `${(occupiedRooms / TOTAL_ROOMS) * 100}%` }}
        />
      </span>
    </button>
  )
}
