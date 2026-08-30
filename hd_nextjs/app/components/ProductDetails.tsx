'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
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
}

interface ProductDetailsProps {
  articleNumber: string
}

export default function ProductDetails({
  articleNumber,
}: ProductDetailsProps) {
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

  /* ---------- LOADING ---------- */

  if (loading) {
    return (
      <main className="product-details-page">
        <div className="product-details-loading">
          <p>Loading product...</p>
        </div>
      </main>
    )
  }

  /* ---------- ERROR ---------- */

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

  /* ---------- PRODUCT ---------- */

  return (
    <main className="product-details-page">

      {/* ---------- TOP BAR ---------- */}

      <div className="product-details-topbar">
        <Link href="/" className="product-back-link">
          ← Back To Collection
        </Link>

        <span className="product-counter">
          PRODUCT / {product.articleNumber}
        </span>
      </div>

      {/* ---------- MAIN PRODUCT AREA ---------- */}

      <section className="product-details-container">

        {/* ---------- IMAGE ---------- */}

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

        {/* ---------- PRODUCT INFORMATION ---------- */}

        <div className="product-details-info">

          {/* ARTICLE NUMBER */}

          <span className="product-details-id">
            {product.articleNumber}
          </span>

          {/* PRODUCT NAME */}

          <h1 className="product-details-title">
            {product.name}
          </h1>

          {/* CATEGORY / AUDIENCE */}

          <div className="product-details-meta">
            <span>
              {product.category}
            </span>

            <span>
              {product.audience}
            </span>
          </div>

          {/* PRICE */}

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

          {/* DIVIDER */}

          <div className="product-details-line" />

          {/* MATERIAL */}

          <div className="product-detail-block">

            <span className="product-detail-label">
              MATERIAL
            </span>

            <p>
              {product.material}
            </p>

          </div>

          {/* DESCRIPTION */}

          <div className="product-detail-block">

            <span className="product-detail-label">
              DESCRIPTION
            </span>

            <p>
              {product.description}
            </p>

          </div>

          {/* PRODUCT INFORMATION */}

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
                <strong>{product.category}</strong>
              </div>

              <div>
                <span>Collection</span>
                <strong>
                  {product.audience}
                </strong>
              </div>

              <div>
                <span>Material</span>
                <strong>
                  {product.material}
                </strong>
              </div>

            </div>

          </div>

          {/* ACTIONS */}

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