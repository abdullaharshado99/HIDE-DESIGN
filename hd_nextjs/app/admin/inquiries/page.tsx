'use client'

import Link from 'next/link'
import { useEffect, useState, useMemo } from 'react'
import { getApiUrl } from '@/app/api-config'
import { toast } from 'sonner'
import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Inquiry {
  id: number
  userId?: number
  name?: string | null
  phone?: string | null
  email?: string | null
  category: string
  productCategory: string
  isRead?: boolean
  createdAt: string
}

export default function InquiriesListPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.replace('/admin')
      return
    }

    fetch(`${getApiUrl()}/inquiries`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('admin_token')
          toast.error('Session expired. Please login again.')
          router.replace('/admin')
          return []
        }
        if (!response.ok) throw new Error('Failed to load inquiries')
        const data = await response.json()
        return Array.isArray(data) ? data : []
      })
      .then(setInquiries)
      .catch((err) => {
        console.error('Inquiry fetch error:', err)
        setError('Unable to load inquiries.')
      })
      .finally(() => setLoading(false))
  }, [router])

  const groupedInquiries = useMemo(() => {
    const groups: Record<string, {
      identifier: string;
      displayName: string;
      email?: string | null;
      phone?: string | null;
      total: number;
      unread: number;
      lastDate: string;
    }> = {}

    inquiries.forEach((inquiry) => {
      const key = inquiry.userId
        ? `user_${inquiry.userId}`
        : `guest_${inquiry.email || inquiry.phone || 'unknown'}`

      const identifier = inquiry.userId
        ? String(inquiry.userId)
        : `${inquiry.email || inquiry.phone || 'guest'}`

      if (!groups[key]) {
        groups[key] = {
          identifier,
          displayName: inquiry.name || 'Guest User',
          email: inquiry.email,
          phone: inquiry.phone,
          total: 0,
          unread: 0,
          lastDate: inquiry.createdAt
        }
      }

      groups[key].total += 1
      if (!inquiry.isRead) groups[key].unread += 1
    })

    return Object.values(groups).sort((a, b) =>
      new Date(b.lastDate).getTime() - new Date(a.lastDate).getTime()
    )
  }, [inquiries])

  return (
    <main className="inquiries-page">
      <div className="inquiries-shell">
        <header className="inquiries-header">
          <div>
            <span className="eyebrow">HIDE DESIGN · ADMIN</span>
            <h1>Workspace Inquiries</h1>
            <p>Select a customer to view their detailed inquiry history.</p>
          </div>
          <Link href="/admin" className="back-admin-btn">← Back to Admin</Link>
        </header>

        {!loading && !error && (
          <section className="inquiry-stats">
            <div className="stat-card">
              <span className="stat-label">Total Customers</span>
              <strong>{groupedInquiries.length}</strong>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Inquiries</span>
              <strong>{inquiries.length}</strong>
            </div>
          </section>
        )}

        <section className="inquiries-content">
          {loading && <div className="state-box"><div className="loader" /><p>Loading...</p></div>}
          {!loading && error && <div className="state-box error-box"><h2>Error</h2><p>{error}</p></div>}

          {!loading && !error && groupedInquiries.length === 0 && (
            <div className="state-box">
              <div className="empty-icon">◇</div>
              <h2>No Inquiries Yet</h2>
              <p>New inquiries will appear here.</p>
            </div>
          )}

          {!loading && !error && groupedInquiries.length > 0 && (
            <div className="inquiries-grid">
              {groupedInquiries.map((group) => (
                <Link
                  href={`/admin/inquiries/${encodeURIComponent(group.identifier)}`}
                  key={group.identifier}
                  className="user-list-card"
                >
                  <div className="user-list-card-left">
                    <div className="user-list-avatar">
                      {group.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-list-info">
                      <strong className="user-list-name">
                        {group.displayName}
                        {group.unread > 0 && (
                          <span className="unread-badge">{group.unread} NEW</span>
                        )}
                      </strong>
                      <span className="user-list-contact">
                        {group.email || group.phone || 'No contact info'}
                      </span>
                    </div>
                  </div>

                  <div className="user-list-card-right">
                    <div className="user-list-count">
                      <span>{group.total}</span>
                      <small>{group.total === 1 ? 'Inquiry' : 'Inquiries'}</small>
                    </div>
                    <ChevronRight size={20} className="user-list-arrow" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}