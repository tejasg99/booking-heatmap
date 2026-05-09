import { getOccupancyLegend } from '../../utils/occupancy'

const monthFormatter = new Intl.DateTimeFormat('en', {
  month: 'long',
  year: 'numeric',
})

const legendItems = getOccupancyLegend()

export function Header({ currentDate, onNextMonth, onPrevMonth, onToday }) {
  return (
    <header className="flex items-end justify-between gap-6">
      <div>
        <p className="text-xs font-semibold uppercase text-[#414755]">
          Hotel Occupancy Heatmap
        </p>
        <h1 className="mt-2 text-3xl font-semibold">
          {monthFormatter.format(currentDate)}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-2 shadow-sm backdrop-blur-xl">
          {legendItems.map((item) => (
            <div className="flex items-center gap-1.5" key={item.label}>
              <span className={`h-3 w-3 rounded-full shadow-sm ${item.swatch}`} />
              <span className="text-xs font-medium text-[#414755]">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex rounded-lg border border-[#c1c6d7] bg-white/80 p-1 shadow-sm">
          <button
            aria-label="Previous month"
            className="h-9 w-9 rounded-md text-lg text-[#414755] transition hover:bg-[#ecedf9]"
            onClick={onPrevMonth}
            type="button"
          >
            ‹
          </button>
          <button
            className="h-9 rounded-md px-3 text-sm font-semibold text-[#0058bc] transition hover:bg-[#ecedf9]"
            onClick={onToday}
            type="button"
          >
            Today
          </button>
          <button
            aria-label="Next month"
            className="h-9 w-9 rounded-md text-lg text-[#414755] transition hover:bg-[#ecedf9]"
            onClick={onNextMonth}
            type="button"
          >
            ›
          </button>
        </div>
      </div>
    </header>
  )
}
