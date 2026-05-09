import { getDateKey } from '../../utils/date'

const statFormatter = new Intl.NumberFormat('en-IN')

export function StatsStrip({ stats }) {
  const highestDayLabel = stats.highestOccupancyDay
    ? `${getDateKey(stats.highestOccupancyDay.date)} - ${stats.highestOccupancyDay.occupancy.occupiedRooms} rooms`
    : 'No data'

  const statsItems = [
    {
      label: 'Bookings',
      value: statFormatter.format(stats.totalBookings),
      helper: `${statFormatter.format(stats.activeBookings)} active`,
    },
    {
      label: 'Avg Occupancy',
      value: `${stats.averageOccupancy}%`,
      helper: 'Current month',
    },
    {
      label: 'Peak Day',
      value: highestDayLabel,
      helper: 'Highest room load',
    },
    {
      label: 'Room Nights',
      value: statFormatter.format(stats.occupiedRoomNights),
      helper: 'Occupied this month',
    },
    {
      label: 'Revenue',
      value: `INR ${statFormatter.format(stats.revenue)}`,
      helper: 'Filtered active bookings',
    },
  ]

  return (
    <section className="grid grid-cols-5 gap-4">
      {statsItems.map((item) => (
        <article
          className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.05)] backdrop-blur-xl"
          key={item.label}
        >
          <p className="text-xs font-semibold uppercase text-[#717786]">{item.label}</p>
          <p className="mt-2 truncate text-2xl font-semibold">{item.value}</p>
          <p className="mt-1 text-sm text-[#414755]">{item.helper}</p>
        </article>
      ))}
    </section>
  )
}
