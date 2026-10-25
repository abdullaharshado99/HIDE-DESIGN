'use client'

import Link from 'next/link'
import { useEffect, useState, useMemo } from 'react'
import { getApiUrl } from '@/app/api-config'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'

interface Inquiry {
  id: number
  userId?: number
  name?: string | null
  phone?: string | null
  email?: string | null
  category: string
  productCategory: string
  productDetail?: string | null
  color?: string | null
  fabricType?: string | null
  gsm?: string | null
  vintageEffect?: string | null
  fitStyle?: string | null
  label?: string | null
  sizes?: string | null
  quantity?: string | null
  notes?: string | null
  createdAt: string
}

function formatLabel(value?: string | null) {
  if (!value) return 'Not specified'
  return value.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatSizes(sizes?: string | null) {
  if (!sizes) return 'Not specified'
  try {
    const parsed = JSON.parse(sizes)
    if (Array.isArray(parsed)) return parsed.length ? parsed.join(', ') : 'Not specified'
    return String(parsed)
  } catch { return sizes }
}

function formatDate(date: string) {
  if (!date) return 'Unknown date'
  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return date
  return parsedDate.toLocaleString('en-US', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function InquiriesPage() {
  const apiUrl = getApiUrl()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [expandedUser, setExpandedUser] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await fetch(`${apiUrl}/inquiries`)
        if (!response.ok) throw new Error('Failed to load inquiries')
        const data = await response.json()
        setInquiries(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Inquiry fetch error:', err)
        setError('Unable to load inquiries.')
      } finally {
        setLoading(false)
      }
    }
    fetchInquiries()
  }, [apiUrl])

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return

    const token = localStorage.getItem('admin_token')
    if (!token) {
      toast.error('Admin session expired. Please login again.')
      return
    }

    setDeletingId(id)
    try {
      const res = await fetch(`${apiUrl}/inquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error('Failed to delete inquiry')

      setInquiries((current) => current.filter((inq) => inq.id !== id))
      toast.success('Inquiry deleted successfully.')

      if (selectedInquiry?.id === id) setSelectedInquiry(null)
    } catch (err) {
      console.error(err)
      toast.error('Could not delete inquiry.')
    } finally {
      setDeletingId(null)
    }
  }

  const confirmDelete = (id: number) => {
    setConfirmDeleteId(id)
  }

  const executeDelete = async () => {
    if (!confirmDeleteId) return

    const token = localStorage.getItem('admin_token')
    if (!token) {
      toast.error('Admin session expired. Please login again.')
      return
    }

    setDeletingId(confirmDeleteId)
    try {
      const res = await fetch(`${apiUrl}/inquiries/${confirmDeleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error('Failed to delete inquiry')

      setInquiries((current) => current.filter((inq) => inq.id !== confirmDeleteId))
      toast.success('Inquiry deleted successfully.')

      if (selectedInquiry?.id === confirmDeleteId) setSelectedInquiry(null)
      setConfirmDeleteId(null)
    } catch (err) {
      console.error(err)
      toast.error('Could not delete inquiry.')
    } finally {
      setDeletingId(null)
    }
  }

  const groupedInquiries = useMemo(() => {
    const groups: Record<string, { user: Inquiry; inquiries: Inquiry[] }> = {}

    inquiries.forEach((inquiry) => {
      const key = inquiry.userId
        ? `user_${inquiry.userId}`
        : `guest_${inquiry.email || inquiry.phone || 'unknown'}`

      if (!groups[key]) {
        groups[key] = {
          user: inquiry,
          inquiries: [],
        }
      }
      groups[key].inquiries.push(inquiry)
    })

    return Object.values(groups)
  }, [inquiries])

  return (
    <main className="inquiries-page">
      <div className="inquiries-shell">
        <header className="inquiries-header">
          <div>
            <span className="eyebrow">HIDE DESIGN · ADMIN</span>
            <h1>Workspace Inquiries</h1>
            <p>Manage and review product customization inquiries submitted by your clients.</p>
          </div>
          <Link href="/admin" className="back-admin-btn">← Back to Admin</Link>
        </header>

        {!loading && !error && (
          <section className="inquiry-stats">
            <div className="stat-card">
              <span className="stat-label">Total Inquiries</span>
              <strong>{groupedInquiries.length}</strong>
            </div>
          </section>
        )}

        <section className="inquiries-content">
          {loading && (
            <div className="state-box">
              <div className="loader" />
              <p>Loading inquiries...</p>
            </div>
          )}
          {!loading && error && (
            <div className="state-box error-box">
              <h2>Something went wrong</h2>
              <p>{error}</p>
              <button type="button" onClick={() => window.location.reload()}>Try Again</button>
            </div>
          )}
          {!loading && !error && groupedInquiries.length === 0 && (
            <div className="state-box">
              <div className="empty-icon">◇</div>
              <h2>No Inquiries Yet</h2>
              <p>New product inquiries will appear here when customers submit them.</p>
            </div>
          )}

          {!loading && !error && groupedInquiries.length > 0 && (
            <div className="inquiries-grid">
              {groupedInquiries.map(({ user, inquiries: userInquiries }) => {
                const userKey = user.userId ? `user_${user.userId}` : `guest_${user.email || user.phone || user.id}`
                const isOpen = expandedUser === userKey

                return (
                  <div key={userKey} className="inquiry-item">
                    <button
                      type="button"
                      className={`name-toggle ${isOpen ? 'open' : ''}`}
                      onClick={() => setExpandedUser(isOpen ? null : userKey)}
                    >
                      <span className="name-toggle-text">
                        {user.name || 'Guest User'}
                        {user.userId && <small style={{ marginLeft: '8px', color: 'var(--gold)' }}>#{user.userId}</small>}
                        <small style={{ marginLeft: '10px', opacity: 0.6 }}>
                          ({userInquiries.length} {userInquiries.length === 1 ? 'inquiry' : 'inquiries'})
                        </small>
                      </span>
                      <span className="name-toggle-arrow">{isOpen ? '−' : '+'}</span>
                    </button>

                    {isOpen && (
                      <div className="inquiry-group-list">
                        {userInquiries.map((inquiry) => (
                          <article className="inquiry-card" key={inquiry.id}>
                            <div className="card-top">
                              <div>
                                <span className="inquiry-number">INQUIRY #{inquiry.id}</span>
                                <h2>{inquiry.productCategory}</h2>
                                {inquiry.productDetail && <p className="product-detail">{inquiry.productDetail}</p>}
                              </div>
                              <button
                                type="button"
                                className="delete-btn"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  confirmDelete(inquiry.id)
                                }}
                                disabled={deletingId === inquiry.id}
                                title="Delete Inquiry"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <div className="category-row">
                              <span>{formatLabel(inquiry.category)}</span>
                              <span className="date">{formatDate(inquiry.createdAt)}</span>
                            </div>
                            <div className="customer-info">
                              <div className="customer-info-item"><span>Name</span><strong>{inquiry.name || 'Not specified'}</strong></div>
                              <div className="customer-info-item"><span>Phone</span><strong>{inquiry.phone || 'Not specified'}</strong></div>
                              <div className="customer-info-item"><span>Email</span><strong>{inquiry.email || 'Not specified'}</strong></div>
                            </div>
                            <div className="quick-details">
                              <div className="detail-item"><span>Color</span><strong>{inquiry.color || 'Not specified'}</strong></div>
                              <div className="detail-item"><span>Fabric</span><strong>{inquiry.fabricType || 'Not specified'}</strong></div>
                              <div className="detail-item"><span>GSM</span><strong>{inquiry.gsm || 'Not specified'}</strong></div>
                              <div className="detail-item"><span>Quantity</span><strong>{inquiry.quantity || 'Not specified'}</strong></div>
                            </div>
                            <div className="sizes-row">
                              <span className="field-label">Sizes</span>
                              <span className="sizes-value">{formatSizes(inquiry.sizes)}</span>
                            </div>
                            <button type="button" className="view-btn" onClick={() => setSelectedInquiry(inquiry)}>
                              <span>View Full Inquiry</span>
                              <span>→</span>
                            </button>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>

      {selectedInquiry && (
        <div className="modal-overlay" onClick={() => setSelectedInquiry(null)}>
          <div className="inquiry-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow"> INQUIRY #{selectedInquiry.id}</span>
                <h2>{selectedInquiry.productCategory}</h2>
                {selectedInquiry.productDetail && <p>{selectedInquiry.productDetail}</p>}
              </div>
              <button type="button" className="close-btn" onClick={() => setSelectedInquiry(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="modal-section">
                <h3>Customer Information</h3>
                <div className="info-grid">
                  <div className="info-item"><span>Name</span><strong>{selectedInquiry.name || 'Not specified'}</strong></div>
                  <div className="info-item"><span>Phone Number</span><strong>{selectedInquiry.phone || 'Not specified'}</strong></div>
                  <div className="info-item"><span>Email</span><strong>{selectedInquiry.email || 'Not specified'}</strong></div>
                </div>
              </div>
              <div className="modal-status-row">
                <span className="modal-date">{formatDate(selectedInquiry.createdAt)}</span>
              </div>
              <div className="modal-section">
                <h3>Product Information</h3>
                <div className="info-grid">
                  <div className="info-item"><span>Category</span><strong>{formatLabel(selectedInquiry.category)}</strong></div>
                  <div className="info-item"><span>Product</span><strong>{selectedInquiry.productCategory}</strong></div>
                  <div className="info-item"><span>Product Detail</span><strong>{selectedInquiry.productDetail || 'Not specified'}</strong></div>
                  <div className="info-item"><span>Quantity</span><strong>{selectedInquiry.quantity || 'Not specified'}</strong></div>
                </div>
              </div>
              <div className="modal-section">
                <h3>Fabric & Style</h3>
                <div className="info-grid">
                  <div className="info-item"><span>Color</span><strong>{selectedInquiry.color || 'Not specified'}</strong></div>
                  <div className="info-item"><span>Fabric Type</span><strong>{selectedInquiry.fabricType || 'Not specified'}</strong></div>
                  <div className="info-item"><span>GSM</span><strong>{selectedInquiry.gsm || 'Not specified'}</strong></div>
                  <div className="info-item"><span>Fit Style</span><strong>{selectedInquiry.fitStyle || 'Not specified'}</strong></div>
                </div>
              </div>
              <div className="modal-section">
                <h3>Customization</h3>
                <div className="info-grid">
                  <div className="info-item"><span>Label</span><strong>{selectedInquiry.label || 'Not specified'}</strong></div>
                  <div className="info-item full"><span>Sizes</span><strong>{formatSizes(selectedInquiry.sizes)}</strong></div>
                </div>
              </div>
              <div className="modal-section">
                <h3>Additional Notes</h3>
                <div className="notes-box">
                  {selectedInquiry.notes?.trim() ? selectedInquiry.notes : 'No additional notes were provided.'}
                </div>
              </div>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button
                type="button"
                className="delete-modal-btn"
                onClick={() => handleDelete(selectedInquiry.id)}
                disabled={deletingId === selectedInquiry.id}
              >
                <Trash2 size={15} /> Delete Inquiry
              </button>
              <button type="button" className="close-modal-btn" onClick={() => setSelectedInquiry(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteId !== null && (
        <div className="confirm-modal-overlay" onClick={() => setConfirmDeleteId(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Inquiry?</h3>
            <p>Are you sure you want to delete this workspace inquiry? This action cannot be undone.</p>

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