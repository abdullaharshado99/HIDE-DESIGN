'use client'

import { startTransition, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getApiUrl } from '../api-config'

interface Product {
  id: string
  name: string
  material: string
  image: string
  description?: string
  price?: number | null
  currency?: string
}

interface ProductCarouselProps {
  gender: 'men' | 'women'
  category: 'jackets' | 'coats'
}

interface ApiProduct {
  articleNumber: string
  name: string
  material: string
  description: string
  imageUrl: string
  price: number | null
  currency: string
  audience: string
  category?: string
}

export default function ProductCarousel({
  gender,
  category,
}: ProductCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)

  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null)

  const [loading, setLoading] = useState(true)
  const title = `${gender === 'men' ? "Men's" : "Women's"} ${category === 'coats' ? 'Long Coats' : 'Jackets'}`

  const eyebrow = `THE ${gender === 'men' ? "MEN'S" : "WOMEN'S"} ${category === 'coats' ? 'COAT' : 'JACKET'} EDIT`

  useEffect(() => {
    const apiUrl = getApiUrl()

    startTransition(() => {
      setLoading(true)
    })

    fetch(`${apiUrl}/products`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        return response.json()
      })
      .then((remoteProducts: ApiProduct[]) => {
        const matchingProducts = remoteProducts
          .filter(
            (product) =>
              product.audience?.toLowerCase() === gender &&
              (product.category?.toLowerCase() || 'coats') === category
          )
          .map((product) => ({
            id: product.articleNumber,
            name: product.name,
            material: product.material,
            image: product.imageUrl,
            description: product.description,
            price: product.price,
            currency: product.currency,
          }))

        setProducts(matchingProducts)
      })
      .catch((error) => {
        console.error(
          'Error loading products:',
          error
        )

        setProducts([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [gender, category])

  useEffect(() => {
    const carousel = carouselRef.current

    if (!carousel || products.length === 0) {
      return
    }

    const interval = setInterval(() => {
      const card =
        carousel.querySelector(
          '.product-card'
        ) as HTMLElement | null

      if (!card) return

      const gap = 24

      const scrollAmount =
        card.offsetWidth + gap

      const maxScroll =
        carousel.scrollWidth -
        carousel.clientWidth

      if (maxScroll <= 0) {
        return
      }

      if (
        carousel.scrollLeft >=
        maxScroll - 5
      ) {
        carousel.scrollTo({
          left: 0,
          behavior: 'smooth',
        })
      } else {
        carousel.scrollBy({
          left: scrollAmount,
          behavior: 'smooth',
        })
      }
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [products])

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === 'Escape') {
        setSelectedProduct(null)
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown
    )

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      )
    }
  }, [])

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedProduct])

  const openProductModule = (
    product: Product
  ) => {
    setSelectedProduct(product)
  }
  const closeProductModule = () => {
    setSelectedProduct(null)
  }

  return (
    <>
      <section
        className={`collection-section ${
          gender === 'men'
            ? 'section-dark'
            : ''
        }`}
        id={`${gender}-${category}`}
      >
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                {eyebrow}
              </span>

              <h2>{title}</h2>
            </div>
          </div>
          {loading && (
            <div className="products-loading">
              Loading products...
            </div>
          )}
          {!loading &&
            products.length === 0 && (
              <div className="products-empty">
                No products available.
              </div>
            )}
          {!loading &&
            products.length > 0 && (
              <div
                className="carousel"
                ref={carouselRef}
              >
                {products.map((product) => (
                  <article
                    className="product-card"
                    key={product.id}
                    onClick={() =>
                      openProductModule(
                        product
                      )
                    }
                  >
                    <div className="product-image">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={280}
                        height={340}
                        onError={(event) => {
                          const target =
                            event.target as HTMLImageElement

                          target.src =
                            '/images/placeholder.svg'
                        }}
                      />
                    </div>
                    <div className="product-info">
                      <span className="product-id">
                        {product.id}
                      </span>

                      <h3>
                        {product.name}
                      </h3>

                      <p>
                        {product.material}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </div>
      </section>
      {selectedProduct && (
        <div
          className="product-modal-overlay"
          onClick={
            closeProductModule
          }
        >
          <div
            className="product-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              className="product-modal-close"
              onClick={
                closeProductModule
              }
              aria-label="Close product module"
            >
              ×
            </button>
            <div className="product-modal-image">
              <Image
                src={
                  selectedProduct.image
                }
                alt={
                  selectedProduct.name
                }
                width={500}
                height={600}
              />
            </div>
            <div className="product-modal-content">

              <span className="product-modal-id">
                {selectedProduct.id}
              </span>

              <h2>
                {selectedProduct.name}
              </h2>

              <div className="product-modal-line"></div>

              <span className="product-modal-label">
                MATERIAL &amp; DESIGN
              </span>

              <p className="product-modal-material">
                {selectedProduct.material}
              </p>
              {selectedProduct.description && (
                <p className="product-modal-description">
                  {
                    selectedProduct.description
                  }
                </p>
              )}

              {selectedProduct.price != null && (
                <p className="product-modal-price">
                  {selectedProduct.currency}{' '}
                  {selectedProduct.price}
                </p>
              )}
              <Link
                href={`/products/${encodeURIComponent(
                  selectedProduct.id
                )}`}
                className="product-details-btn"
                onClick={() =>
                  setSelectedProduct(null)
                }
              >
                View Details
                <span>→</span>
              </Link>

            </div>
          </div>
        </div>
      )}
    </>
  )
}