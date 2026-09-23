'use client'

import { ArrowUpRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CollectionCard {
  id: string
  gender: string
  title: string
  description: string
  image: string
}

const collections: CollectionCard[] = [
  {
    id: 'mens-jacket',
    gender: 'MEN',
    title: "Men's Jacket",
    description:
      'Premium jackets crafted for comfort, style, and confidence.',
    image: '/images/collections/mens-jacket.jpg',
  },
  {
    id: 'womens-jacket',
    gender: 'WOMEN',
    title: "Women's Jacket",
    description:
      'Premium jackets engineered for fit, comfort, and everyday wear.',
    image: '/images/collections/womens-jacket.jpg',
  },
  {
    id: 'mens-long-coat',
    gender: 'MEN',
    title: "Men's Long Coat",
    description:
      'Premium long coats designed for durability and a sharp silhouette.',
    image: '/images/collections/mens-long-coat.jpg',
  },
  {
    id: 'womens-long-coat',
    gender: 'WOMEN',
    title: "Women's Long Coat",
    description:
      'Premium long coats made for warmth, drape, and everyday elegance.',
    image: '/images/collections/womens-long-coat.jpg',
  },
]

export default function AccountDashboard() {
  const router = useRouter()

  function handleExplore(id: string) {
    router.push(`/collection/${id}`)
  }

  return (
    <section className="account-section" id="account">
      <div className="container">

        {/* =========================================================
            OLD ACCOUNT DASHBOARD CODE
            ---------------------------------------------------------
            The previous product workspace / shortlist / enquiry
            dashboard has been replaced by the collection flow below.
            ========================================================= */}

        {/* ---------- HEADING ---------- */}

        <div className="account-heading">
          <div>
            <span className="eyebrow">
              CATEGORIES
            </span>

            <h2>
              Explore Our <em>Collection</em>
            </h2>
          </div>
        </div>

        {/* ---------- COLLECTION GRID ---------- */}

        <div className="collection-grid">

          {collections.map((collection) => (
            <article
              className="collection-card"
              key={collection.id}
            >

              {/* ---------- IMAGE ---------- */}

              <div className="collection-image">
                <img
                  src={collection.image}
                  alt={collection.title}
                />
              </div>

              {/* ---------- CONTENT ---------- */}

              <div className="collection-content">

                <span className="collection-gender">
                  {collection.gender}
                </span>

                <h3>
                  {collection.title}
                </h3>

                <p>
                  {collection.description}
                </p>

                <button
                  type="button"
                  className="collection-explore"
                  onClick={() =>
                    handleExplore(collection.id)
                  }
                >
                  Explore
                  <ArrowUpRight size={17} />
                </button>

              </div>

            </article>
          ))}

        </div>

      </div>
    </section>
  )
}