export function BookingSidebar({ bookings }) {
  const visibleBookings = bookings.slice(0, 8)

  return (
    <aside className="sticky top-8 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.05)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-[#717786]">Booking Sidebar</p>
          <h2 className="mt-1 text-xl font-semibold">Recent stays</h2>
        </div>
        <span className="rounded-full bg-[#ecedf9] px-3 py-1 text-xs font-semibold text-[#414755]">
          {bookings.length}
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {visibleBookings.map((booking) => (
          <article className="rounded-xl border border-[#e0e2ed] bg-white/70 p-3" key={booking.id}>
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-sm font-semibold">{booking.guestName}</p>
              <span className="rounded-full bg-[#f1f3fe] px-2 py-1 text-[11px] font-semibold text-[#414755]">
                {booking.roomNumber}
              </span>
            </div>
            <p className="mt-1 text-xs text-[#717786]">
              {booking.checkIn} to {booking.checkOut}
            </p>
          </article>
        ))}
      </div>
    </aside>
  )
}
