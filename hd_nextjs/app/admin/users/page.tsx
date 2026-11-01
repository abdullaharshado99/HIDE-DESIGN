'use client'

import Link from 'next/link'
import { useEffect, useState, useMemo } from 'react'
import { getApiUrl } from '@/app/api-config'
import { toast } from 'sonner'
import { ArrowLeft, ChevronRight } from 'lucide-react'
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

export default function AdminUsersPage() {
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
                        <h1>Users & Customers</h1>
                        <p>List of all users who have submitted inquiries.</p>
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
                            <h2>No Users Found</h2>
                            <p>No users have submitted inquiries yet.</p>
                        </div>
                    )}

                    {!loading && !error && groupedInquiries.length > 0 && (
                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Customer</th>
                                        <th>Contact Info</th>
                                        <th>Inquiries</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedInquiries.map((group) => (
                                        <tr key={group.identifier}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div className="table-avatar">
                                                        {group.displayName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <strong style={{ color: 'var(--cream)', fontSize: '15px' }}>
                                                        {group.displayName}
                                                    </strong>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                                                    <span style={{ color: 'var(--cream)' }}>{group.email || 'No email'}</span>
                                                    <span style={{ color: 'var(--muted)' }}>{group.phone || 'No phone'}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span style={{ color: 'var(--gold-bright)', fontSize: '16px', fontWeight: 500 }}>
                                                    {group.total}
                                                </span>
                                                <span style={{ color: 'var(--muted)', fontSize: '11px', marginLeft: '6px', textTransform: 'uppercase' }}>
                                                    {group.total === 1 ? 'Inquiry' : 'Inquiries'}
                                                </span>
                                            </td>
                                            <td>
                                                {group.unread > 0 ? (
                                                    <span className="unread-badge">{group.unread} NEW</span>
                                                ) : (
                                                    <span style={{ color: 'var(--muted)', fontSize: '12px' }}>All Read</span>
                                                )}
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <Link
                                                    href={`/admin/inquiries/${encodeURIComponent(group.identifier)}`}
                                                    className="table-action-btn"
                                                >
                                                    View <ChevronRight size={14} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}