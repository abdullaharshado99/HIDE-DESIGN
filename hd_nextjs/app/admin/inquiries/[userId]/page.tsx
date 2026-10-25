'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getApiUrl } from '@/app/api-config'
import { toast } from 'sonner'
import { Trash2, CheckCheck, ArrowLeft } from 'lucide-react'

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
    fitStyle?: string | null
    label?: string | null
    sizes?: string | null
    quantity?: string | null
    notes?: string | null
    createdAt: string
    articleNumber?: string | null
    isRead?: boolean
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

export default function UserInquiriesDetailPage() {
    const apiUrl = getApiUrl()
    const router = useRouter()
    const params = useParams()
    const identifier = params.userId as string

    const [inquiries, setInquiries] = useState<Inquiry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
    const [productData, setProductData] = useState<any[]>([])
    const [productImages, setProductImages] = useState<Record<string, string>>({})

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await fetch(`${apiUrl}/inquiries`)
                if (!response.ok) throw new Error('Failed to load')
                const allData = await response.json()

                const filtered = allData.filter((inq: Inquiry) => {
                    if (inq.userId && String(inq.userId) === identifier) return true
                    if (!inq.userId && (inq.email === identifier || inq.phone === identifier)) return true
                    return false
                })

                setInquiries(filtered)

                const prodRes = await fetch(`${apiUrl}/products`)
                if (prodRes.ok) {
                    const products = await prodRes.json()
                    setProductData(products)
                    const imageMap: Record<string, string> = {}
                    products.forEach((p: any) => {
                        if (p.articleNumber && p.imageUrl) imageMap[p.articleNumber] = p.imageUrl
                    })
                    setProductImages(imageMap)
                }
            } catch (err) {
                setError('Unable to load inquiries.')
            } finally {
                setLoading(false)
            }
        }
        if (identifier) fetchData()
    }, [apiUrl, identifier])

    const getProductImage = (inquiry: Inquiry) => {
        if (!productData.length) return null;
        if (inquiry.articleNumber) {
            const matchById = productData.find(p => p.articleNumber === inquiry.articleNumber);
            if (matchById && matchById.imageUrl) return matchById.imageUrl;
        }
        if (inquiry.productDetail) {
            const matchByName = productData.find(p => p.name.toLowerCase().trim() === inquiry.productDetail?.toLowerCase().trim());
            if (matchByName && matchByName.imageUrl) return matchByName.imageUrl;
        }
        return null;
    }

    const handleViewInquiry = async (inquiry: Inquiry) => {
        setSelectedInquiry(inquiry)
        if (inquiry.isRead) return;

        const token = localStorage.getItem('admin_token')
        if (!token) return

        try {
            const res = await fetch(`${apiUrl}/inquiries/${inquiry.id}/read`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                setInquiries(current => current.map(inq => inq.id === inquiry.id ? { ...inq, isRead: true } : inq))
            }
        } catch (err) { }
    }

    const executeDelete = async () => {
        if (!confirmDeleteId) return
        const token = localStorage.getItem('admin_token')
        if (!token) return toast.error('Admin session expired.')

        setDeletingId(confirmDeleteId)
        try {
            const res = await fetch(`${apiUrl}/inquiries/${confirmDeleteId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            })
            if (!res.ok) throw new Error('Failed')
            setInquiries((current) => current.filter((inq) => inq.id !== confirmDeleteId))
            toast.success('Inquiry deleted.')
            if (selectedInquiry?.id === confirmDeleteId) setSelectedInquiry(null)
            setConfirmDeleteId(null)
        } catch (err) {
            toast.error('Could not delete.')
        } finally {
            setDeletingId(null)
        }
    }

    if (loading) return <div className="state-box"><div className="loader" /><p>Loading...</p></div>

    if (inquiries.length === 0 && !error) {
        return (
            <main className="inquiries-page">
                <div className="inquiries-shell">
                    <button onClick={() => router.back()} className="back-admin-btn" style={{ marginBottom: '20px' }}>← Back</button>
                    <div className="state-box">
                        <h2>No Inquiries Found</h2>
                        <p>This user has no inquiries.</p>
                    </div>
                </div>
            </main>
        )
    }

    const user = inquiries[0]

    return (
        <main className="inquiries-page">
            <div className="inquiries-shell">
                <button onClick={() => router.back()} className="inquiry-back" style={{ marginBottom: '20px' }}>
                    <ArrowLeft size={16} /> Back to Customers
                </button>

                <header className="inquiries-header" style={{ borderBottom: '1px solid var(--hair)', paddingBottom: '20px', marginBottom: '30px' }}>
                    <div>
                        <span className="eyebrow">CUSTOMER PROFILE</span>
                        <h1 style={{ textTransform: 'capitalize' }}>{user.name || 'Guest User'}</h1>
                        <p style={{ margin: '5px 0' }}>{user.email} {user.phone ? `· ${user.phone}` : ''}</p>
                        <span style={{ fontSize: '13px', color: 'var(--gold)' }}>{inquiries.length} Total Inquiries</span>
                    </div>
                </header>

                <div className="user-inquiries-list" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {inquiries.map((inquiry) => {
                        const imgUrl = getProductImage(inquiry)
                        return (
                            <article className="inquiry-card" key={inquiry.id}>
                                <div className="card-top">
                                    <div>
                                        <span className="inquiry-number">
                                            INQUIRY #{inquiry.id}
                                            <span style={{ marginLeft: '10px', display: 'inline-flex', alignItems: 'center' }}>
                                                {inquiry.isRead ? (
                                                    <CheckCheck size={16} color="#4ade80" title="Seen" />
                                                ) : (
                                                    <span style={{ width: '8px', height: '8px', background: 'var(--gold)', borderRadius: '50%' }} title="Unseen"></span>
                                                )}
                                            </span>
                                        </span>
                                        <h2>{inquiry.productCategory}</h2>
                                        {inquiry.productDetail && <p className="product-detail">{inquiry.productDetail}</p>}
                                    </div>
                                    <button type="button" className="delete-btn" onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(inquiry.id); }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="inquiry-article-preview">
                                    {imgUrl ? (
                                        <div className="inquiry-preview-image"><img src={imgUrl} alt="Article" /></div>
                                    ) : (
                                        <div className="inquiry-preview-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '10px' }}>No Image</div>
                                    )}
                                    <div className="inquiry-preview-info">
                                        <span className="inquiry-preview-label">Selected Article</span>
                                        <strong>{inquiry.productDetail || 'Unknown Name'}</strong>
                                        {inquiry.articleNumber && <span className="inquiry-preview-num">#{inquiry.articleNumber}</span>}
                                    </div>
                                </div>

                                <div className="category-row">
                                    <span>{formatLabel(inquiry.category)}</span>
                                    <span className="date">{formatDate(inquiry.createdAt)}</span>
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

                                <button type="button" className="view-btn" onClick={() => handleViewInquiry(inquiry)}>
                                    <span>View Full Inquiry</span>
                                    <span>→</span>
                                </button>
                            </article>
                        )
                    })}
                </div>
            </div>

            {selectedInquiry && (
                <div className="modal-overlay" onClick={() => setSelectedInquiry(null)}>
                    <div className="inquiry-modal" onClick={(event) => event.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <span className="eyebrow"> INQUIRY #{selectedInquiry.id} <span style={{ color: '#4ade80', marginLeft: '8px' }}><CheckCheck size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Seen</span></span>
                                <h2>{selectedInquiry.productCategory}</h2>
                            </div>
                            <button type="button" className="close-btn" onClick={() => setSelectedInquiry(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-section">
                                <h3>Customer Information</h3>
                                <div className="info-grid">
                                    <div className="info-item"><span>Name</span><strong>{selectedInquiry.name || 'Not specified'}</strong></div>
                                    <div className="info-item"><span>Phone</span><strong>{selectedInquiry.phone || 'Not specified'}</strong></div>
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
                                <div className="notes-box">{selectedInquiry.notes?.trim() ? selectedInquiry.notes : 'No notes provided.'}</div>
                            </div>
                        </div>
                        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
                            <button type="button" className="delete-modal-btn" onClick={() => setConfirmDeleteId(selectedInquiry.id)} disabled={deletingId === selectedInquiry.id}>
                                <Trash2 size={15} /> Delete
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
                        <p>Are you sure you want to delete this inquiry? This action cannot be undone.</p>
                        <div className="confirm-modal-actions">
                            <button className="confirm-modal-cancel" onClick={() => setConfirmDeleteId(null)} disabled={deletingId !== null}>Cancel</button>
                            <button className="confirm-modal-confirm" onClick={executeDelete} disabled={deletingId !== null}>{deletingId !== null ? 'Deleting...' : 'Yes, Delete'}</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}