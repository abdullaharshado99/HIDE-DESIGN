'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getApiUrl } from '../../api-config'
import { toast } from 'sonner'
import { ArrowLeft, Trash2, X, Maximize2 } from 'lucide-react'

interface Quote {
  id: number
  name: string
  email: string
  phone?: string | null
  category?: string
  message: string
  status: string
  createdAt: string
  imageUrl?: string | null
}

export default function QuotesAdminPage() {
  const router = useRouter()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

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

  const confirmDelete = (id: number) => setConfirmDeleteId(id)

  const executeDelete = async () => {
    if (!confirmDeleteId) return

    const token = localStorage.getItem('admin_token')
    if (!token) {
      toast.error('Admin session expired. Please login again.')
      return
    }

    setDeletingId(confirmDeleteId)
    try {
      const res = await fetch(`${getApiUrl()}/quotes/${confirmDeleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error('Failed to delete')

      setQuotes((current) => current.filter((quote) => quote.id !== confirmDeleteId))
      toast.success('Contact inquiry deleted successfully.')
      setConfirmDeleteId(null)
    } catch (err) {
      console.error(err)
      toast.error('Could not delete contact inquiry.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="admin-shell">
      <div className="admin-header">
        <div>
          <span className="eyebrow">HIDE DESIGN · ADMIN</span>
          <h1>Contact inquiries</h1>
          <p className="admin-intro">Requests submitted through the contact form.</p>
        </div>
        <button
          className="back-admin-btn"
          type="button"
          onClick={() => router.push('/admin')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            padding: '10px 20px',
            fontSize: '11px'
          }}>
          <ArrowLeft size={14} /> BACK TO ADMIN
        </button>
      </div>

      <section className="admin-list admin-inquiry-list">
        {loading && <p className="admin-loading">Loading inquiries...</p>}
        {error && <p className="form-success">{error}</p>}
        {!loading && !error && quotes.length === 0 && <p className="admin-intro">No contact inquiries yet.</p>}

        {quotes.map((quote) => (
          <article className="admin-inquiry-row" key={quote.id} style={{ gridTemplateColumns: '1fr auto', padding: '24px 0' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {quote.imageUrl && (
                <div
                  className="quote-image-wrapper"
                  onClick={() => setPreviewImage(quote.imageUrl!)}
                >
                  <img
                    src={quote.imageUrl}
                    alt="Reference"
                    className="quote-image-thumb"
                  />
                  <div className="quote-image-overlay">
                    <Maximize2 size={20} color="#fff" />
                    <span>View Image</span>
                  </div>
                </div>
              )}

              <div style={{ flex: 1, minWidth: '250px' }}>
                <strong style={{ fontSize: '16px', color: 'var(--cream)' }}>{quote.name}</strong>
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px', fontSize: '13px', color: 'var(--muted)' }}>
                  <span>{quote.email}</span>
                  {quote.phone && <span>· {quote.phone}</span>}
                </div>
                <div style={{ marginTop: '8px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)' }}>
                  {quote.category || 'General inquiry'} <span style={{ color: 'var(--muted)' }}>· {new Date(quote.createdAt).toLocaleString()}</span>
                </div>

                <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid var(--gold)', color: 'var(--parchment)', fontSize: '14px', lineHeight: 1.6 }}>
                  {quote.message}
                </div>
              </div>
            </div>

            <div className="admin-inquiry-actions">
              <span className="admin-status">{quote.status}</span>
              <button
                type="button"
                className="delete-btn"
                onClick={() => confirmDelete(quote.id)}
                disabled={deletingId === quote.id}
                title="Delete Inquiry"
              >
                {deletingId === quote.id ? '...' : <Trash2 size={16} />}
              </button>
            </div>
          </article>
        ))}
      </section>

      {previewImage && (
        <div className="image-lightbox-overlay" onClick={() => setPreviewImage(null)}>
          <button className="lightbox-close" onClick={() => setPreviewImage(null)}>
            <X size={24} />
          </button>
          <img
            src={previewImage}
            alt="Full Preview"
            className="image-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {confirmDeleteId !== null && (
        <div className="confirm-modal-overlay" onClick={() => setConfirmDeleteId(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Contact Inquiry?</h3>
            <p>Are you sure you want to delete this contact inquiry? This action cannot be undone.</p>

            <div className="confirm-modal-actions">
              <button
                className="confirm-modal-cancel"
                onClick={() => setConfirmDeleteId(null)}
                disabled={deletingId !== null}
              >
                Cancel
              </button>
              <button
                className="confirm-modal-confirm"
                onClick={executeDelete}
                disabled={deletingId !== null}
              >
                {deletingId !== null ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}