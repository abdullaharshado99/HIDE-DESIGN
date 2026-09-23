'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getApiUrl } from '@/app/api-config'

interface Inquiry {
  id: number
  category: string
  productCategory: string
  productDetail?: string | null
  color?: string | null
  fabricType?: string | null
  gsm?: string | null
  vintageEffect?: string | null
  fitStyle?: string | null
  printingTechnique?: string | null
  rhinestone?: string | null
  label?: string | null
  sizes?: string | null
  quantity?: string | null
  fileName?: string | null
  notes?: string | null
  status: string
  createdAt: string
}

function formatLabel(value?: string | null) {
  if (!value) return 'Not specified'

  return value
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatSizes(sizes?: string | null) {
  if (!sizes) return 'Not specified'

  try {
    const parsed = JSON.parse(sizes)

    if (Array.isArray(parsed)) {
      return parsed.length
        ? parsed.join(', ')
        : 'Not specified'
    }

    return String(parsed)
  } catch {
    return sizes
  }
}

function formatDate(date: string) {
  if (!date) return 'Unknown date'

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return parsedDate.toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getStatusClass(status: string) {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'status approved'

    case 'completed':
      return 'status completed'

    case 'rejected':
      return 'status rejected'

    default:
      return 'status pending'
  }
}

export default function InquiriesPage() {
  const apiUrl = getApiUrl()

  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedInquiry, setSelectedInquiry] =
    useState<Inquiry | null>(null)

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${apiUrl}/inquiries`)

        if (!response.ok) {
          throw new Error('Failed to load inquiries')
        }

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

  return (
    <main className="inquiries-page">
      <div className="inquiries-shell">

        {/* HEADER */}
        <header className="inquiries-header">
          <div>
            <span className="eyebrow">
              HIDE DESIGN · ADMIN
            </span>

            <h1>Workspace Inquiries</h1>

            <p>
              Manage and review product customization
              inquiries submitted by your clients.
            </p>
          </div>

          <Link
            href="/admin"
            className="back-admin-btn"
          >
            ← Back to Admin
          </Link>
        </header>

        {/* STATS */}
        {!loading && !error && (
          <section className="inquiry-stats">

            <div className="stat-card">
              <span className="stat-label">
                Total Inquiries
              </span>

              <strong>{inquiries.length}</strong>
            </div>

            <div className="stat-card">
              <span className="stat-label">
                Pending
              </span>

              <strong>
                {
                  inquiries.filter(
                    (item) =>
                      item.status?.toLowerCase() ===
                      'pending'
                  ).length
                }
              </strong>
            </div>

            <div className="stat-card">
              <span className="stat-label">
                Completed
              </span>

              <strong>
                {
                  inquiries.filter(
                    (item) =>
                      item.status?.toLowerCase() ===
                      'completed'
                  ).length
                }
              </strong>
            </div>

          </section>
        )}

        {/* CONTENT */}
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

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
              >
                Try Again
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            inquiries.length === 0 && (
              <div className="state-box">
                <div className="empty-icon">◇</div>

                <h2>No Inquiries Yet</h2>

                <p>
                  New product inquiries will appear here
                  when customers submit them.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            inquiries.length > 0 && (
              <div className="inquiries-grid">

                {inquiries.map((inquiry) => (
                  <article
                    key={inquiry.id}
                    className="inquiry-card"
                  >

                    {/* CARD TOP */}
                    <div className="card-top">

                      <div>
                        <span className="inquiry-number">
                          INQUIRY #{inquiry.id}
                        </span>

                        <h2>
                          {inquiry.productCategory}
                        </h2>

                        {inquiry.productDetail && (
                          <p className="product-detail">
                            {inquiry.productDetail}
                          </p>
                        )}
                      </div>

                      <span
                        className={getStatusClass(
                          inquiry.status
                        )}
                      >
                        {formatLabel(inquiry.status)}
                      </span>

                    </div>

                    {/* CATEGORY */}
                    <div className="category-row">

                      <span>
                        {formatLabel(
                          inquiry.category
                        )}
                      </span>

                      <span className="date">
                        {formatDate(
                          inquiry.createdAt
                        )}
                      </span>

                    </div>

                    {/* QUICK DETAILS */}
                    <div className="quick-details">

                      <div className="detail-item">
                        <span>Color</span>

                        <strong>
                          {inquiry.color ||
                            'Not specified'}
                        </strong>
                      </div>

                      <div className="detail-item">
                        <span>Fabric</span>

                        <strong>
                          {inquiry.fabricType ||
                            'Not specified'}
                        </strong>
                      </div>

                      <div className="detail-item">
                        <span>GSM</span>

                        <strong>
                          {inquiry.gsm ||
                            'Not specified'}
                        </strong>
                      </div>

                      <div className="detail-item">
                        <span>Quantity</span>

                        <strong>
                          {inquiry.quantity ||
                            'Not specified'}
                        </strong>
                      </div>

                    </div>

                    {/* SIZES */}
                    <div className="sizes-row">

                      <span className="field-label">
                        Sizes
                      </span>

                      <span className="sizes-value">
                        {formatSizes(inquiry.sizes)}
                      </span>

                    </div>

                    {/* VIEW BUTTON */}
                    <button
                      type="button"
                      className="view-btn"
                      onClick={() =>
                        setSelectedInquiry(inquiry)
                      }
                    >
                      <span>
                        View Full Inquiry
                      </span>

                      <span>→</span>
                    </button>

                  </article>
                ))}

              </div>
            )}

        </section>
      </div>

      {/* MODAL */}
      {selectedInquiry && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedInquiry(null)
          }
        >

          <div
            className="inquiry-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}
            <div className="modal-header">

              <div>

                <span className="eyebrow">
                  INQUIRY #{selectedInquiry.id}
                </span>

                <h2>
                  {selectedInquiry.productCategory}
                </h2>

                {selectedInquiry.productDetail && (
                  <p>
                    {selectedInquiry.productDetail}
                  </p>
                )}

              </div>

              <button
                type="button"
                className="close-btn"
                onClick={() =>
                  setSelectedInquiry(null)
                }
              >
                ×
              </button>

            </div>

            {/* MODAL BODY */}
            <div className="modal-body">

              <div className="modal-status-row">

                <span
                  className={getStatusClass(
                    selectedInquiry.status
                  )}
                >
                  {formatLabel(
                    selectedInquiry.status
                  )}
                </span>

                <span className="modal-date">
                  {formatDate(
                    selectedInquiry.createdAt
                  )}
                </span>

              </div>

              {/* PRODUCT */}
              <div className="modal-section">

                <h3>Product Information</h3>

                <div className="info-grid">

                  <div className="info-item">
                    <span>Category</span>

                    <strong>
                      {formatLabel(
                        selectedInquiry.category
                      )}
                    </strong>
                  </div>

                  <div className="info-item">
                    <span>Product</span>

                    <strong>
                      {selectedInquiry.productCategory}
                    </strong>
                  </div>

                  <div className="info-item">
                    <span>Product Detail</span>

                    <strong>
                      {selectedInquiry.productDetail ||
                        'Not specified'}
                    </strong>
                  </div>

                  <div className="info-item">
                    <span>Quantity</span>

                    <strong>
                      {selectedInquiry.quantity ||
                        'Not specified'}
                    </strong>
                  </div>

                </div>
              </div>

              {/* FABRIC */}
              <div className="modal-section">

                <h3>Fabric & Style</h3>

                <div className="info-grid">

                  <div className="info-item">
                    <span>Color</span>

                    <strong>
                      {selectedInquiry.color ||
                        'Not specified'}
                    </strong>
                  </div>

                  <div className="info-item">
                    <span>Fabric Type</span>

                    <strong>
                      {selectedInquiry.fabricType ||
                        'Not specified'}
                    </strong>
                  </div>

                  <div className="info-item">
                    <span>GSM</span>

                    <strong>
                      {selectedInquiry.gsm ||
                        'Not specified'}
                    </strong>
                  </div>

                  <div className="info-item">
                    <span>Vintage Effect</span>

                    <strong>
                      {selectedInquiry.vintageEffect ||
                        'Not specified'}
                    </strong>
                  </div>

                  <div className="info-item">
                    <span>Fit Style</span>

                    <strong>
                      {selectedInquiry.fitStyle ||
                        'Not specified'}
                    </strong>
                  </div>

                  <div className="info-item">
                    <span>Printing Technique</span>

                    <strong>
                      {selectedInquiry.printingTechnique ||
                        'Not specified'}
                    </strong>
                  </div>

                </div>
              </div>

              {/* CUSTOMIZATION */}
              <div className="modal-section">

                <h3>Customization</h3>

                <div className="info-grid">

                  <div className="info-item">
                    <span>Rhinestone</span>

                    <strong>
                      {selectedInquiry.rhinestone ||
                        'Not specified'}
                    </strong>
                  </div>

                  <div className="info-item">
                    <span>Label</span>

                    <strong>
                      {selectedInquiry.label ||
                        'Not specified'}
                    </strong>
                  </div>

                  <div className="info-item full">
                    <span>Sizes</span>

                    <strong>
                      {formatSizes(
                        selectedInquiry.sizes
                      )}
                    </strong>
                  </div>

                </div>
              </div>

              {/* FILE */}
              {selectedInquiry.fileName && (
                <div className="modal-section">

                  <h3>Design File</h3>

                  <div className="file-box">
                    <span className="file-icon">
                      ◇
                    </span>

                    <span>
                      {selectedInquiry.fileName}
                    </span>
                  </div>

                </div>
              )}

              {/* NOTES */}
              <div className="modal-section">

                <h3>Additional Notes</h3>

                <div className="notes-box">
                  {selectedInquiry.notes?.trim()
                    ? selectedInquiry.notes
                    : 'No additional notes were provided.'}
                </div>

              </div>

            </div>

            {/* FOOTER */}
            <div className="modal-footer">

              <button
                type="button"
                className="close-modal-btn"
                onClick={() =>
                  setSelectedInquiry(null)
                }
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

    </main>
  )
}