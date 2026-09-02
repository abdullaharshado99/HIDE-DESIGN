'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { getApiUrl } from '../api-config'

interface Product {
  id: number
  articleNumber: string
  name: string
  category: string
  audience: string
  material: string
  description: string
  price: number | null
  currency: string
  imageUrl: string
  published: boolean
  createdAt?: Date
  updatedAt?: Date
}

export default function ProductDetailView() {
  const apiUrl = getApiUrl()
  const router = useRouter()
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState('')

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token')
    if (!savedToken) {
      router.push('/admin')
      return
    }

    setToken(savedToken)
    const productId = params.id

    if (productId) {
      fetch(`${apiUrl}/products/${productId}`, {
        headers: { Authorization: `Bearer ${savedToken}` }
      })
        .then((res) => res.json())
        .then((data) => setProduct(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false))
    }
  }, [params.id])

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
              <span className="detail-value">{product.category}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Audience:</span>
              <span className="detail-value">{product.audience}</span>
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
