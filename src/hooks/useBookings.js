import { useEffect, useState } from 'react'

export function useBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadBookings() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/bookings.json', {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Unable to load bookings (${response.status})`)
        }

        const data = await response.json()

        if (!Array.isArray(data)) {
          throw new Error('Bookings payload must be an array')
        }

        setBookings(data)
      } catch (bookingError) {
        if (bookingError.name !== 'AbortError') {
          setError(bookingError)
          setBookings([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadBookings()

    return () => controller.abort()
  }, [])

  return {
    bookings,
    loading,
    error,
  }
}
