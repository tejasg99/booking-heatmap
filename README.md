# Hotel Occupancy Heatmap Calendar

A desktop-first React dashboard for visualizing hotel room occupancy across a monthly calendar. Bookings are loaded client-side from `public/bookings.json`. Built as a part of Guestara assignment.

## Features

- 6 by 7 calendar grid with previous and next month overflow days
- Vibrant occupancy heatmap from green to yellow, orange, and red
- Checkout-exclusive booking logic, so checkout day is not counted as occupied
- Cancelled bookings excluded from occupancy calculations
- Month navigation with previous, next, and Today actions
- Drag-to-select date ranges, including backward selection and overflow days
- Booking sidebar filtered by the selected range
- Room and status filters
- Stats strip with bookings, occupancy, peak day, room nights, and revenue
- Loading skeletons, empty states, and error handling

## Tech Stack

- React
- Vite
- Tailwind CSS
- Native JavaScript Date API

## Setup
1. Clone the repository
```bash
git clone https://github.com/tejasg99/booking-heatmap.git
cd booking-heatmap
```
2. Install dependencies
```bash
npm install
```
3. Run the development server
```bash
npm run dev
```
4. Server should be running on http://localhost:5173

## Architecture

- `src/hooks/useBookings.js` fetches and validates `bookings.json`.
- `src/utils/date.js` contains date normalization and day math helpers.
- `src/utils/calendar.js` generates the fixed 42-cell monthly grid.
- `src/utils/occupancy.js` handles booking activity, occupancy, heatmap colors, and dashboard stats.
- `src/utils/selection.js` handles selected date ranges and booking overlap checks.
- `src/components/calendar` renders the weekday header, grid, and cells.
- `src/components/layout` contains the dashboard shell, header, and loading panel.
- `src/components/stats` renders dashboard metrics.
- `src/components/filters` renders room and status filters.
- `src/components/sidebar` renders selected-range booking details.
