# Notes

## Design Decisions

- Occupancy is calculated with checkout-exclusive logic: a booking from `2026-02-10` to `2026-02-13` occupies Feb 10, 11, and 12 only.
- Cancelled bookings are treated as inactive for occupancy and default sidebar data.
- The calendar always renders 42 cells to keep the dashboard stable month to month.
- Calendar, stats, and sidebar data are derived from memoized filtered bookings so the app avoids repeated full-data recalculation.
- Dashboard interaction state is managed with `useReducer` because month navigation, filters, and range selection change together over time.

## Trade-offs

- The app uses native `Date` only, per the assignment. This keeps dependencies light but requires explicit normalization to avoid time drift.
- Filters affect calendar occupancy as well as stats/sidebar, which makes the dashboard internally consistent.
- Revenue uses active filtered bookings rather than prorating by selected calendar dates.
- The UI is desktop-first and dense by design; mobile refinements are possible but were not the main target.

## Future Improvements I would add

- keyboard support for calendar range selection.
- per-room occupancy drilldowns.
- Export or screenshot support for the dashboard view.
- Unit tests around checkout-exclusive occupancy and range overlap logic.
- Virtualize the sidebar if the booking dataset grows far beyond the current mock data.
