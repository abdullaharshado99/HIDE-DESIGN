'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getApiUrl } from '@/app/api-config'
import { toast } from 'sonner'
import { Package, User as UserIcon, ShoppingBag } from 'lucide-react'

interface Order {
  id: number
  userId: number
  items: any[]
  totalAmount: number
  paymentMethod: string
  shippingAddress: string
  phone: string
  status: string
  createdAt: string
  customer: {
    name: string
    email: string
    phone: string
  }
  currentWardrobeItems: any[]
}

export default function AdminOrdersPage() {
  const apiUrl = getApiUrl()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin')
      return
    }

    fetch(`${apiUrl}/orders/admin/all`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('admin_token')
          router.push('/admin')
          throw new Error('Session expired')
        }
        return res.json()
      })
      .then(data => setOrders(data))
      .catch(() => toast.error('Could not load orders'))
      .finally(() => setLoading(false))
  }, [apiUrl, router])

  if (loading) return <div className="state-box"><p>Loading orders...</p></div>

  return (
    <main className="inquiries-page">
      <div className="inquiries-shell">
        <header className="inquiries-header">
          <div>
            <span className="eyebrow">HIDE DESIGN · ADMIN</span>
            <h1>Customer Orders & Wardrobes</h1>
            <p>See who checked out what, and what's left in their wardrobe.</p>
          </div>
          <Link href="/admin" className="back-admin-btn">← Back to Admin</Link>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '30px' }}>
          {orders.length === 0 && <p style={{ color: 'var(--muted)' }}>No orders yet.</p>}
          
          {orders.map(order => (
            <div key={order.id} className="inquiry-card">
              {/* Header: Order & Customer Info */}
              <div className="card-top" style={{ borderBottom: '1px solid var(--hair)', paddingBottom: '15px', marginBottom: '15px' }}>
                <div>
                  <span className="inquiry-number">ORDER #{order.id}</span>
                  <h2>{order.customer.name}</h2>
                  <p className="product-detail">{order.customer.email} · {order.customer.phone}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ color: 'var(--gold)', fontSize: '20px' }}>USD {order.totalAmount}</strong>
                  <p style={{ fontSize: '11px', color: 'var(--muted)' }}>{new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Shipping & Payment */}
              <div className="info-grid" style={{ marginBottom: '20px' }}>
                <div className="info-item">
                  <span>Shipping Address</span>
                  <strong>{order.shippingAddress}</strong>
                </div>
                <div className="info-item">
                  <span>Payment Method</span>
                  <strong>{order.paymentMethod}</strong>
                </div>
              </div>

              {/* Purchased Items */}
              <h3 style={{ fontSize: '16px', marginBottom: '10px', color: 'var(--gold)' }}>Items Purchased</h3>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--espresso-2)', padding: '10px', border: '1px solid var(--hair)' }}>
                    {item.imageUrl && <img src={item.imageUrl} alt="" style={{ width: '40px', height: '50px', objectFit: 'cover' }} />}
                    <div>
                      <strong style={{ display: 'block', fontSize: '13px', color: 'var(--cream)' }}>{item.name}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--muted)' }}>#{item.articleNumber}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Current Wardrobe Items */}
              <h3 style={{ fontSize: '16px', marginBottom: '10px', color: 'var(--muted)' }}>Current Wardrobe (Saved items not yet purchased)</h3>
              {order.currentWardrobeItems.length > 0 ? (
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  {order.currentWardrobeItems.map((item: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--espresso-2)', padding: '10px', border: '1px solid var(--hair)' }}>
                      {item.imageUrl && <img src={item.imageUrl} alt="" style={{ width: '40px', height: '50px', objectFit: 'cover' }} />}
                      <div>
                        <strong style={{ display: 'block', fontSize: '13px', color: 'var(--cream)' }}>{item.name}</strong>
                        <span style={{ fontSize: '11px', color: 'var(--muted)' }}>#{item.articleNumber}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '13px', color: 'var(--muted)' }}>Wardrobe is empty.</p>
              )}

            </div>
          ))}
        </div>
      </div>
    </main>
  )
}