export function LoadingPanel() {
  return (
    <section className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="grid grid-cols-7 gap-3">
        {Array.from({ length: 21 }, (_, index) => (
          <div
            className="h-28 animate-pulse rounded-2xl bg-[#ecedf9]"
            key={index}
          />
        ))}
      </div>
    </section>
  )
}
