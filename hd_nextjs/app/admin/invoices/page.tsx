'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getApiUrl } from '../../api-config'

interface Invoice {
  id: number
  name: string
  email: string
  phone: string
  company?: string | null
  productName: string
  articleNumber: string
  color?: string | null
  fabricType?: string | null
  fabricGsm?: string | null
  sizes?: string[] | null
  quantity: number
  unit?: string | null
  additionalNotes?: string | null
  designFileUrl?: string | null
  specifications?: string | null
  status: string
  createdAt: string
}

export default function InvoicesAdminPage() {
  const router = useRouter()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.replace('/admin')
      return
    }

    fetch(`${getApiUrl()}/invoices`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('admin_token')
          router.replace('/admin')
          return []
        }
        if (!response.ok) throw new Error('Could not load workspace inquiries.')
        return response.json() as Promise<Invoice[]>
      })
      .then(setInvoices)
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Could not load workspace inquiries.'))
      .finally(() => setLoading(false))
  }, [router])

  return (
    <main className="admin-shell">
      <div className="admin-header">
        <div>
          <span className="eyebrow">HIDE DESIGN · ADMIN</span>
          <h1>Workspace inquiries</h1>
          <p className="admin-intro">Product briefs, quantities, specifications, and design files.</p>
        </div>
        <button className="btn-quote" type="button" onClick={() => router.push('/admin')}>Back to articles</button>
      </div>
      <section className="admin-list admin-inquiry-list">
        {loading && <p className="admin-loading">Loading inquiries...</p>}
        {error && <p className="form-success">{error}</p>}
        {!loading && !error && invoices.length === 0 && <p className="admin-intro">No workspace inquiries yet.</p>}
        {invoices.map((invoice) => (
          <article className="admin-inquiry-row" key={invoice.id}>
            <div>
              <strong>{invoice.productName} <small>({invoice.articleNumber})</small></strong>
              <small>{invoice.name} · {invoice.email} · {invoice.phone}</small>
              <small>{invoice.company || 'Private client'} · {new Date(invoice.createdAt).toLocaleString()}</small>
            </div>
            <p>
              {invoice.quantity} {invoice.unit || 'units'} · Sizes: {invoice.sizes?.join(', ') || 'Not specified'}
              <br />
              {[invoice.color, invoice.fabricType, invoice.fabricGsm].filter(Boolean).join(' · ') || 'No fabric details'}
              {invoice.additionalNotes ? <><br />{invoice.additionalNotes}</> : null}
            </p>
            <div className="admin-inquiry-actions">
              <span className="admin-status">{invoice.status}</span>
              {invoice.designFileUrl && <a href={invoice.designFileUrl} target="_blank" rel="noreferrer" className="btn-quote">Design file</a>}
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}