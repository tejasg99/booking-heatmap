const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Checked in', value: 'checked_in' },
  { label: 'Checked out', value: 'checked_out' },
  { label: 'Cancelled', value: 'cancelled' },
]

export function FilterBar({
  filters,
  rooms,
  onRoomChange,
  onStatusChange,
  onClearSelection,
  hasSelection,
}) {
  return (
    <section className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/80 px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.05)] backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase text-[#717786]">
          Room
          <select
            className="h-10 rounded-lg border border-[#c1c6d7] bg-[#f1f3fe] px-3 text-sm font-medium normal-case text-[#181c23] outline-none transition focus:border-[#0058bc] focus:bg-white focus:ring-2 focus:ring-[#adc6ff]"
            onChange={(event) => onRoomChange(event.target.value)}
            value={filters.roomNumber}
          >
            <option value="all">All rooms</option>
            {rooms.map((room) => (
              <option key={room} value={room}>
                Room {room}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold uppercase text-[#717786]">
          Status
          <select
            className="h-10 rounded-lg border border-[#c1c6d7] bg-[#f1f3fe] px-3 text-sm font-medium normal-case text-[#181c23] outline-none transition focus:border-[#0058bc] focus:bg-white focus:ring-2 focus:ring-[#adc6ff]"
            onChange={(event) => onStatusChange(event.target.value)}
            value={filters.status}
          >
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        className="h-10 rounded-lg border border-[#c1c6d7] bg-white px-4 text-sm font-semibold text-[#0058bc] shadow-sm transition hover:bg-[#ecedf9] disabled:cursor-not-allowed disabled:text-[#717786] disabled:opacity-50"
        disabled={!hasSelection}
        onClick={onClearSelection}
        type="button"
      >
        Clear selection
      </button>
    </section>
  )
}
