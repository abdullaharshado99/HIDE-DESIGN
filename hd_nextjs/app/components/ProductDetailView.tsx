'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { getApiUrl } from '../api-config'

interface Product {
  id: number
  articleNumber: string
  name: string
  category: string
  audience: string
  size?: string
  color?: string
  material: string
  description: string
  price: number | null
  currency: string
  imageUrl: string
  published: boolean
  createdAt?: Date
  updatedAt?: Date
}

function displayLabel(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value
}

export default function ProductDetailView() {
  const apiUrl = getApiUrl()
  const router = useRouter()
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState('')

  const redirectToLogin = useCallback(() => {
    localStorage.removeItem('admin_token')
    router.push('/admin')
  }, [router])

  useEffect(() => {
    if (!token) return

    let timeoutId = window.setTimeout(redirectToLogin, 5 * 60 * 1000)
    const resetInactivityTimer = () => {
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(redirectToLogin, 5 * 60 * 1000)
    }
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart']

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, resetInactivityTimer)
    })

    return () => {
      window.clearTimeout(timeoutId)
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, resetInactivityTimer)
      })
    }
  }, [redirectToLogin, token])

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token')
    if (!savedToken) {
      router.push('/admin')
      return
    }

    setToken(savedToken)
    const productId = params.id

    if (productId) {
      fetch(`${apiUrl}/products/admin/${productId}`, {
        headers: { Authorization: `Bearer ${savedToken}` }
      })
        .then((res) => {
          if (res.status === 401) {
            redirectToLogin()
            throw new Error('Admin session expired')
          }
          if (!res.ok) throw new Error('Article not found')
          return res.json()
        })
        .then((data) => setProduct(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false))
    }
  }, [apiUrl, params.id, redirectToLogin])

  if (loading) return <div className="admin-shell"><p>Loading article...</p></div>
  if (!product) return <div className="admin-shell"><p>Article not found</p></div>

  return (
    <main className="admin-shell">
      <div className="admin-header">
        <div>
          <span className="eyebrow">HIDE DESIGN · ADMIN</span>
          <h1>Article Details</h1>
        </div>
        <Link href="/admin/all-products" className="btn-quote">← Back to List</Link>
      </div>

      <div className="product-detail-container">
        <div className="product-detail-image">
          {product.imageUrl && (
            <img src={product.imageUrl} alt={product.name} />
          )}
        </div>

        <div className="product-detail-info">
          <div className="detail-section">
            <h2>Article Information</h2>
            <div className="detail-row">
              <span className="detail-label">Article Number:</span>
              <span className="detail-value">{product.articleNumber}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Product Name:</span>
              <span className="detail-value">{product.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Category:</span>
              <span className="detail-value">{displayLabel(product.category)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Audience:</span>
              <span className="detail-value">{displayLabel(product.audience)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Size:</span>
              <span className="detail-value">{product.size || 'Not specified'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Color:</span>
              <span className="detail-value">{product.color || 'Not specified'}</span>
            </div>
          </div>

          <div className="detail-section">
            <h2>Price & Availability</h2>
            <div className="detail-row">
              <span className="detail-label">Price:</span>
              <span className="detail-value">
                {product.price ? `${product.currency} ${product.price}` : 'No Price'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className="detail-value">
                {product.published ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h2>Material & Description</h2>
            <div className="detail-row">
              <span className="detail-label">Material:</span>
              <span className="detail-value">{product.material}</span>
            </div>
            <div className="detail-section-full">
              <span className="detail-label">Description:</span>
              <p className="detail-description">{product.description}</p>
            </div>
          </div>

          <div className="detail-actions">
            <Link href={`/admin?edit=${product.id}`} className="btn btn-gold">
              Edit Article
            </Link>
            <Link href="/admin/all-products" className="btn-quote">
              Back to List
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
