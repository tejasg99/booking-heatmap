const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function WeekdayHeader() {
  return (
    <div className="grid grid-cols-7 gap-3 text-center text-xs font-semibold uppercase text-[#717786]">
      {weekdays.map((day) => (
        <span key={day}>{day}</span>
      ))}
    </div>
  )
}
