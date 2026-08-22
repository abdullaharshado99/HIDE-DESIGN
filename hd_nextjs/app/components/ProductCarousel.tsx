'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

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
}

const products: Record<'men' | 'women', Product[]> = {
  men: [
    {
      id: 'HD-M01',
      name: 'The Regent',
      material: 'Wool · Tailored Double-Breasted',
      image: '/images/men/men-01.jpg',
    },
    {
      id: 'HD-M02',
      name: 'The Heritage',
      material: 'Tweed · Classic Longline',
      image: '/images/men/men-02.jpg',
    },
    {
      id: 'HD-M03',
      name: 'The Executive',
      material: 'Wool Blend · Modern Fit',
      image: '/images/men/men-03.jpg',
    },
    {
      id: 'HD-M04',
      name: 'The Sovereign',
      material: 'Cashmere Blend · Luxury Finish',
      image: '/images/men/men-04.jpg',
    },
    {
      id: 'HD-M05',
      name: 'The Traveller',
      material: 'Wool · Relaxed Tailoring',
      image: '/images/men/men-05.jpg',
    },
  ],

  women: [
    {
      id: 'HD-W01',
      name: 'The Elena',
      material: 'Wool · Sculpted Silhouette',
      image: '/images/women/women-01.jpg',
    },
    {
      id: 'HD-W02',
      name: 'The Camille',
      material: 'Tweed · Soft Tailoring',
      image: '/images/women/women-02.jpg',
    },
    {
      id: 'HD-W03',
      name: 'The Victoria',
      material: 'Wool Blend · Refined Fit',
      image: '/images/women/women-03.jpg',
    },
    {
      id: 'HD-W04',
      name: 'The Celeste',
      material: 'Cashmere Blend · Signature Finish',
      image: '/images/women/women-04.jpg',
    },
    {
      id: 'HD-W05',
      name: 'The Grace',
      material: 'Wool · Contemporary Longline',
      image: '/images/women/women-05.jpg',
    },
  ],
}

export default function ProductCarousel({
  gender,
}: ProductCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null)
  const [apiProducts, setApiProducts] = useState<Product[] | null>(null)

  const items = apiProducts ?? products[gender]

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

    fetch(`${apiUrl}/products`)
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((remoteProducts: Array<{
        articleNumber: string
        name: string
        material: string
        description: string
        imageUrl: string
        price: number | null
        currency: string
        audience: string
      }>) => {
        const matchingProducts = remoteProducts
          .filter((product) => product.audience.toLowerCase() === gender)
          .map((product) => ({
            id: product.articleNumber,
            name: product.name,
            material: product.material,
            image: product.imageUrl,
            description: product.description,
            price: product.price,
            currency: product.currency,
          }))

        if (matchingProducts.length > 0) setApiProducts(matchingProducts)
      })
      .catch(() => undefined)
  }, [gender])

  const title =
    gender === 'men'
      ? "Men's Long Coats"
      : "Women's Long Coats"

  const eyebrow =
    gender === 'men'
      ? "THE MEN'S EDIT"
      : "THE WOMEN'S EDIT"

  /* ---------- AUTO SCROLL ---------- */

  useEffect(() => {
    const carousel = carouselRef.current

    if (!carousel) return

    const interval = setInterval(() => {
      const card = carousel.querySelector(
        '.product-card'
      ) as HTMLElement | null

      if (!card) return

      const gap = 24
      const scrollAmount = card.offsetWidth + gap

      const maxScroll =
        carousel.scrollWidth - carousel.clientWidth

      if (carousel.scrollLeft >= maxScroll - 5) {
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

    return () => clearInterval(interval)
  }, [])

  /* ---------- CLOSE MODAL WITH ESC ---------- */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedProduct(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      )
    }
  }, [])

  /* ---------- PREVENT BACKGROUND SCROLL ---------- */

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

  return (
    <>
      <section
        className={`collection-section ${
          gender === 'men' ? 'section-dark' : ''
        }`}
        id={gender}
      >
        <div className="container">

          {/* SECTION HEADING */}

          <div className="section-heading">
            <div>
              <span className="eyebrow">
                {eyebrow}
              </span>

              <h2>{title}</h2>
            </div>
          </div>

          {/* CAROUSEL */}

          <div
            className="carousel"
            ref={carouselRef}
          >
            {items.map((product) => (
              <article
                className="product-card"
                key={product.id}
                onClick={() =>
                  setSelectedProduct(product)
                }
              >
                <div className="product-image">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={280}
                    height={340}
                    onError={(e) => {
                      const target =
                        e.target as HTMLImageElement

                      target.src =
                        '/images/placeholder.svg'
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
              </article>
            ))}
          </div>

        </div>
      </section>


      {/* ---------- PRODUCT MODAL ---------- */}

      {selectedProduct && (
        <div
          className="product-modal-overlay"
          onClick={() =>
            setSelectedProduct(null)
          }
        >
          <div
            className="product-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* CLOSE BUTTON */}

            <button
              className="product-modal-close"
              onClick={() =>
                setSelectedProduct(null)
              }
              aria-label="Close product details"
            >
              ×
            </button>

            {/* IMAGE */}

            <div className="product-modal-image">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                width={500}
                height={600}
              />
            </div>

            {/* DETAILS */}

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

              <p>
                {selectedProduct.material}
              </p>
              {selectedProduct.description && <p>{selectedProduct.description}</p>}
              {selectedProduct.price != null && (
                <p>{selectedProduct.currency} {selectedProduct.price}</p>
              )}

            </div>

          </div>
        </div>
      )}
    </>
  )
}