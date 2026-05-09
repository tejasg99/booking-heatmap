export function DashboardLayout({ header, stats, calendar, sidebar }) {
  return (
    <main className="min-h-screen bg-[#f9f9ff] px-8 py-8 text-[#181c23]">
      <div className="mx-auto flex max-w-360 flex-col gap-6">
        {header}
        {stats}
        <div className="grid grid-cols-[minmax(0,1fr)_320px] items-start gap-6">
          {calendar}
          {sidebar}
        </div>
      </div>
    </main>
  )
}
