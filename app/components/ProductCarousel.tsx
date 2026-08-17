'use client'

import { useRef } from 'react'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  material: string
  image: string
}

interface ProductCarouselProps {
  gender: 'men' | 'women'
}

const products: Record<'men' | 'women', Product[]> = {
  men: [
    { id: 'HD-M01', name: 'The Regent', material: 'Wool · Tailored Double-Breasted', image: '/images/men/men-01.jpg' },
    { id: 'HD-M02', name: 'The Heritage', material: 'Tweed · Classic Longline', image: '/images/men/men-02.jpg' },
    { id: 'HD-M03', name: 'The Executive', material: 'Wool Blend · Modern Fit', image: '/images/men/men-03.jpg' },
    { id: 'HD-M04', name: 'The Sovereign', material: 'Cashmere Blend · Luxury Finish', image: '/images/men/men-04.jpg' },
    { id: 'HD-M05', name: 'The Traveller', material: 'Wool · Relaxed Tailoring', image: '/images/men/men-05.jpg' },
  ],
  women: [
    { id: 'HD-W01', name: 'The Elena', material: 'Wool · Sculpted Silhouette', image: '/images/women/women-01.jpg' },
    { id: 'HD-W02', name: 'The Camille', material: 'Tweed · Soft Tailoring', image: '/images/women/women-02.jpg' },
    { id: 'HD-W03', name: 'The Victoria', material: 'Wool Blend · Refined Fit', image: '/images/women/women-03.jpg' },
    { id: 'HD-W04', name: 'The Celeste', material: 'Cashmere Blend · Signature Finish', image: '/images/women/women-04.jpg' },
    { id: 'HD-W05', name: 'The Grace', material: 'Wool · Contemporary Longline', image: '/images/women/women-05.jpg' },
  ]
}

export default function ProductCarousel({ gender }: ProductCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const items = products[gender]
  const title = gender === 'men' ? "Men's Long Coats" : "Women's Long Coats"
  const eyebrow = gender === 'men' ? "THE MEN'S EDIT" : "THE WOMEN'S EDIT"

  const scroll = (direction: 'prev' | 'next') => {
    if (carouselRef.current) {
      const step = 300
      carouselRef.current.scrollBy({
        left: direction === 'next' ? step : -step,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className={`collection-section ${gender === 'men' ? 'section-dark' : ''}`} id={gender}>
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
          </div>
          <div className="section-controls">
            <button className="carousel-btn" onClick={() => scroll('prev')}>←</button>
            <button className="carousel-btn" onClick={() => scroll('next')}>→</button>
          </div>
        </div>

        <div className="carousel" ref={carouselRef}>
          {items.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={280}
                  height={340}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/images/placeholder.svg'
                  }}
                />
              </div>
              <div className="product-info">
                <span>{product.id}</span>
                <h3>{product.name}</h3>
                <p>{product.material}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}