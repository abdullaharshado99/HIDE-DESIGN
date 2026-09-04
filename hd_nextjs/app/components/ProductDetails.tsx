'use client'

import { useEffect, useState } from 'react'
import { getApiUrl } from '../api-config'
import Image from 'next/image'
import Link from 'next/link'

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
}

interface ProductDetailsProps {
  articleNumber: string
}

function displayLabel(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value
}

export default function ProductDetails({ articleNumber }: ProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const apiUrl = getApiUrl()

    const loadProduct = async () => {
      try {
        setLoading(true)
        setError(false)

        const response = await fetch(
          `${apiUrl}/products/${encodeURIComponent(articleNumber)}`
        )

        if (!response.ok) {
          throw new Error('Product not found')
        }

        const data: Product = await response.json()

        setProduct(data)
      } catch (err) {
        console.error('Product details error:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [articleNumber])

  if (loading) {
    return (
      <main className="product-details-page">
        <div className="product-details-loading">
          <p>Loading product...</p>
        </div>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="product-details-page">
        <div className="product-not-found">
          <span>PRODUCT NOT FOUND</span>

          <h1>This product is currently unavailable.</h1>

          <Link href="/" className="back-to-collection">
            ← Back To Collection
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="product-details-page">
      <div className="product-details-topbar">
        <Link href="/" className="product-back-link">
          ← Back To Collection
        </Link>

        <span className="product-counter">
          PRODUCT / {product.articleNumber}
        </span>
      </div>
      <section className="product-details-container">
        <div className="product-details-image-section">

          <div className="product-details-image">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 55vw"
              onError={(event) => {
                const target =
                  event.currentTarget as HTMLImageElement

                target.style.display = 'none'
              }}
            />
          </div>

        </div>
        <div className="product-details-info">
          <span className="product-details-id">
            {product.articleNumber}
          </span>
          <h1 className="product-details-title">
            {product.name}
          </h1>
          <div className="product-details-meta">
            <span>
              {displayLabel(product.category)}
            </span>

            <span>
              {displayLabel(product.audience)}
            </span>
          </div>
          {product.price !== null && (
            <div className="product-details-price">
              <span className="product-currency">
                {product.currency}
              </span>

              <span>
                {Number(product.price).toLocaleString()}
              </span>
            </div>
          )}
          <div className="product-details-line" />
          <div className="product-detail-block">

            <span className="product-detail-label">
              MATERIAL
            </span>

            <p>
              {product.material}
            </p>

          </div>
          <div className="product-detail-block">

            <span className="product-detail-label">
              DESCRIPTION
            </span>

            <p>
              {product.description}
            </p>

          </div>
          <div className="product-detail-block">

            <span className="product-detail-label">
              PRODUCT INFORMATION
            </span>

            <div className="product-information-list">

              <div>
                <span>Article Number</span>
                <strong>{product.articleNumber}</strong>
              </div>

              <div>
                <span>Category</span>
                <strong>{displayLabel(product.category)}</strong>
              </div>

              <div>
                <span>Collection</span>
                <strong>
                  {displayLabel(product.audience)}
                </strong>
              </div>

              <div>
                <span>Size</span>
                <strong>{product.size || 'Not specified'}</strong>
              </div>

              <div>
                <span>Color</span>
                <strong>{product.color || 'Not specified'}</strong>
              </div>

              <div>
                <span>Material</span>
                <strong>
                  {product.material}
                </strong>
              </div>

            </div>

          </div>
          <div className="product-details-actions">

            <button
              type="button"
              className="product-action-button product-action-primary"
            >
              ADD TO CART
            </button>

            <button
              type="button"
              className="product-action-button product-action-secondary"
            >
              CUSTOMIZE THIS PRODUCT
            </button>

          </div>

        </div>

      </section>

    </main>
  )
}