import { CalendarCell } from './CalendarCell'
import { WeekdayHeader } from './WeekdayHeader'

export function CalendarGrid({ cells }) {
  return (
    <section className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.05)] backdrop-blur-xl">
      <WeekdayHeader />
      <div className="mt-3 grid grid-cols-7 gap-3">
        {cells.map((cell) => (
          <CalendarCell cell={cell} key={cell.id} />
        ))}
      </div>
    </section>
  )
}
