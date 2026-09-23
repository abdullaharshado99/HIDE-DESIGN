'use client'

import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

interface CategoryData {
  title: string
}

const categoryData: Record<string, CategoryData> = {
  'mens-jacket': {
    title: "Men's Jacket",
  },

  'womens-jacket': {
    title: "Women's Jacket",
  },

  'mens-long-coat': {
    title: "Men's Long Coat",
  },

  'womens-long-coat': {
    title: "Women's Long Coat",
  },
}

export default function CollectionPage() {
  const router = useRouter()
  const params = useParams()

  const category =
    typeof params.category === 'string'
      ? params.category
      : ''

  const product = categoryData[category]

  if (!product) {
    return (
      <main className="collection-proceed-page">
        <div className="container">
          <h1>Collection not found</h1>

          <button
            type="button"
            onClick={() => router.push('/')}
          >
            Back to Collection
          </button>
        </div>
      </main>
    )
  }

  function startSampleOrder() {
    router.push(
      `/collection/${category}/inquiry`
    )
  }

  return (
    <main className="collection-proceed-page">
      <div className="container">

        {/* ---------- BACK ---------- */}

        <button
          type="button"
          className="collection-back"
          onClick={() => router.back()}
        >
          <ArrowLeft size={17} />
          Collection / {product.title}
        </button>

        {/* ---------- PRODUCT ---------- */}

        <div className="proceed-heading">
          <span className="eyebrow">
            COLLECTION
          </span>

          <h1>
            {product.title}
          </h1>

          <h2>
            How would you like <em>to proceed?</em>
          </h2>
        </div>

        {/* ---------- OPTIONS ---------- */}

        <div className="proceed-grid">

          {/* =====================================================
              CUSTOM SAMPLE
              ===================================================== */}

          <article className="proceed-card">

            <span className="proceed-number">
              01
            </span>

            <h3>
              Order a Custom Sample
            </h3>

            <p>
              Perfect for testing your design
              before bulk production.
            </p>

            <ul>
              <li>
                <span>✓</span>
                Low MOQ
              </li>

              <li>
                <span>✓</span>
                Fully Customized
              </li>

              <li>
                <span>✓</span>
                Premium Quality
              </li>

              <li>
                <span>✓</span>
                Delivered Worldwide
              </li>
            </ul>

            <button
              type="button"
              className="btn btn-gold"
              onClick={startSampleOrder}
            >
              Start Sample Order
              <ArrowUpRight size={16} />
            </button>

          </article>

          {/* =====================================================
              BULK QUOTE
              ===================================================== */}

          <article className="proceed-card">

            <span className="proceed-number">
              02
            </span>

            <h3>
              Looking for a Bulk Quote
            </h3>

            <p>
              Already have your design? Get
              factory pricing and MOQ details.
            </p>

            <ul>
              <li>
                <span>✓</span>
                Wholesale Pricing
              </li>

              <li>
                <span>✓</span>
                Low Minimum Quantity
              </li>

              <li>
                <span>✓</span>
                Private Label / OEM
              </li>

              <li>
                <span>✓</span>
                Worldwide Shipping
              </li>
            </ul>

            <button
              type="button"
              className="btn btn-outline"
            >
              Request Bulk Quote
              <ArrowUpRight size={16} />
            </button>

          </article>

        </div>

      </div>
    </main>
  )
}