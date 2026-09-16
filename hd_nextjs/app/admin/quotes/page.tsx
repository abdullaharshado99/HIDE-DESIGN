'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getApiUrl } from '../../api-config'

interface Quote {
  id: number
  name: string
  email: string
  phone?: string | null
  category?: string
  message: string
  status: string
  createdAt: string
}

export default function QuotesAdminPage() {
  const router = useRouter()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.replace('/admin')
      return
    }

    fetch(`${getApiUrl()}/quotes`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('admin_token')
          router.replace('/admin')
          return []
        }
        if (!response.ok) throw new Error('Could not load contact inquiries.')
        return response.json() as Promise<Quote[]>
      })
      .then(setQuotes)
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Could not load contact inquiries.'))
      .finally(() => setLoading(false))
  }, [router])

  return (
    <main className="admin-shell">
      <div className="admin-header">
        <div>
          <span className="eyebrow">HIDE DESIGN · ADMIN</span>
          <h1>Contact inquiries</h1>
          <p className="admin-intro">Requests submitted through the contact form.</p>
        </div>
        <button className="btn-quote" type="button" onClick={() => router.push('/admin')}>Back to articles</button>
      </div>
      <section className="admin-list admin-inquiry-list">
        {loading && <p className="admin-loading">Loading inquiries...</p>}
        {error && <p className="form-success">{error}</p>}
        {!loading && !error && quotes.length === 0 && <p className="admin-intro">No contact inquiries yet.</p>}
        {quotes.map((quote) => (
          <article className="admin-inquiry-row" key={quote.id}>
            <div>
              <strong>{quote.name}</strong>
              <small>{quote.email} {quote.phone ? `· ${quote.phone}` : ''}</small>
              <small>{quote.category || 'General inquiry'} · {new Date(quote.createdAt).toLocaleString()}</small>
            </div>
            <p>{quote.message}</p>
            <span className="admin-status">{quote.status}</span>
          </article>
        ))}
      </section>
    </main>
  )
}