'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getApiUrl } from '../api-config'

interface Product {
  id: string
  name: string
  material: string
  image: string
}

interface ApiProduct {
  articleNumber: string
  name: string
  material: string
  imageUrl: string
  audience: string
  category?: string
}

interface CategoryProductsProps {
  gender?: 'men' | 'women'
  category: 'jackets' | 'coats' | 'accessories'
  title: string
  eyebrow: string
}

export default function CategoryProducts({
  gender,
  category,
  title,
  eyebrow,
}: CategoryProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Home page par jis section se aaye the, wapas usi section par jao
  const homeSectionId =
    category === 'accessories'
      ? 'Accessories'
      : `${gender}-${category}`

  useEffect(() => {
    const apiUrl = getApiUrl()

    setLoading(true)

    fetch(`${apiUrl}/products`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        return response.json()
      })
      .then((remoteProducts: ApiProduct[]) => {
        const matchingProducts = remoteProducts
          .filter((product) => {
            const productCategory =
              product.category?.toLowerCase() || 'coats'

            if (category === 'accessories') {
              return productCategory === 'accessories'
            }

            return (
              product.audience?.toLowerCase() === gender &&
              productCategory === category
            )
          })
          .map((product) => ({
            id: product.articleNumber,
            name: product.name,
            material: product.material,
            image: product.imageUrl,
          }))

        setProducts(matchingProducts)
      })
      .catch((error) => {
        console.error('Error loading products:', error)
        setProducts([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [gender, category])

  return (
    <section className="collection-section section-dark collection-page">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
          </div>

          <Link
            href={`/#${homeSectionId}`}
            className="explore-more-btn"
          >
            <span>←</span>
            Back to Home
          </Link>
        </div>

        {loading && (
          <div className="products-loading">
            Loading products...
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="products-empty">
            No products available.
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="collection-grid">
            {products.map((product) => (
              <Link
                href={`/products/${encodeURIComponent(product.id)}`}
                className="product-card"
                key={product.id}
              >
                <div className="product-image">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={280}
                    height={340}
                    style={{ objectFit: 'contain' }}
                    onError={(event) => {
                      const target =
                        event.target as HTMLImageElement

                      target.src = '/images/placeholder.svg'
                    }}
                  />
                </div>

                <div className="product-info">
                  <span className="product-id">
                    {product.id}
                  </span>

                  <h3>{product.name}</h3>

                  <p>{product.material}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}