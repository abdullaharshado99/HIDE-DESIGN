import Image from 'next/image'
import Link from 'next/link'

interface ProductData {
  id: string
  name: string
  material: string
  description: string
  image: string
  price: string
}

const products: Record<string, ProductData> = {
  'ART-123': {
    id: 'ART-123',
    name: 'The Regent',
    material: 'Premium Wool · Tailored Double-Breasted',
    description:
      'A refined long coat designed with premium materials, timeless tailoring and superior craftsmanship.',
    image: '/images/men/men-01.jpg',
    price: 'Contact for Price',
  },

  'ART-124': {
    id: 'ART-124',
    name: 'The Heritage',
    material: 'Premium Tweed · Classic Longline',
    description:
      'A classic longline coat combining traditional tailoring with a sophisticated modern silhouette.',
    image: '/images/men/men-02.jpg',
    price: 'Contact for Price',
  },

  'ART-125': {
    id: 'ART-125',
    name: 'The Elena',
    material: 'Premium Wool · Sculpted Silhouette',
    description:
      'Elegant women’s long coat crafted with attention to detail and a refined contemporary silhouette.',
    image: '/images/women/women-01.jpg',
    price: 'Contact for Price',
  },

  'ART-126': {
    id: 'ART-126',
    name: 'The Camille',
    material: 'Premium Tweed · Soft Tailoring',
    description:
      'A sophisticated women’s coat featuring soft tailoring and timeless design.',
    image: '/images/women/women-02.jpg',
    price: 'Contact for Price',
  },
}

export function generateStaticParams() {
  return Object.keys(products).map((id) => ({
    id,
  }))
}

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({
  params,
}: ProductPageProps) {
  const product = products[params.id]

  if (!product) {
    return (
      <main className="product-detail-page">
        <div className="product-not-found">
          <span>PRODUCT NOT FOUND</span>

          <h1>
            This product is currently unavailable.
          </h1>

          <Link
            href="/"
            className="product-back-btn"
          >
            ← Back To Collection
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="product-detail-page">
      <Link
        href="/"
        className="product-detail-back"
      >
        ← BACK TO COLLECTION
      </Link>

      <div className="product-detail-container">
        <div className="product-detail-image">

          <Image
            src={product.image}
            alt={product.name}
            width={700}
            height={850}
            priority
          />

        </div>
        <div className="product-detail-info">

          <span className="product-detail-id">
            {product.id}
          </span>

          <h1>
            {product.name}
          </h1>

          <div className="product-detail-line"></div>

          <div className="product-detail-block">

            <span>
              MATERIAL &amp; DESIGN
            </span>

            <p>
              {product.material}
            </p>

          </div>

          <div className="product-detail-block">

            <span>
              DESCRIPTION
            </span>

            <p>
              {product.description}
            </p>

          </div>

          <div className="product-detail-price">

            <span>
              PRICE
            </span>

            <strong>
              {product.price}
            </strong>

          </div>

          <div className="product-detail-actions">

            <Link
              href="/#contact"
              className="product-detail-contact"
            >
              CONTACT US
            </Link>

            <Link
              href="/"
              className="product-detail-back-button"
            >
              ← BACK
            </Link>

          </div>

        </div>

      </div>

    </main>
  )
}