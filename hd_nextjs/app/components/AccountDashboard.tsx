'use client'

import Link from 'next/link'

export default function CollectionPage() {
  return (
    <main className="collection-page">
      <section className="collection-section">
        <div className="collection-shell">

          {/* HEADING */}
          <div className="collection-heading">
            <div className="collection-eyebrow">
              <span className="collection-eyebrow-line" />
              <span>COLLECTION</span>
            </div>

            <div className="collection-heading-row">
              <h1>
                Explore Your <em>Wardrobe</em>
              </h1>
            </div>
          </div>

          {/* SINGLE COLLECTION BOX */}
          <div className="collection-single-card">

            <Link
  href="/collection"
  className="collection-single-card-link"
  aria-label="Start a custom sample order"
>

              <div className="collection-single-card-image">
                <div className="collection-image-glow" />

                <svg
                  className="collection-single-garment"
                  viewBox="0 0 220 260"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  {/* Left sleeve */}
                  <path
                    d="M82 42L48 58L25 98L51 113L72 83"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Right sleeve */}
                  <path
                    d="M138 42L172 58L195 98L169 113L148 83"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Garment body */}
                  <path
                    d="M82 42L70 76L64 218H156L150 76L138 42"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinejoin="round"
                  />

                  {/* Collar */}
                  <path
                    d="M82 42L110 62L138 42"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Center */}
                  <path
                    d="M110 62V218"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeDasharray="5 5"
                  />

                  {/* Pockets */}
                  <path
                    d="M72 157L96 166"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />

                  <path
                    d="M148 157L124 166"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="collection-single-card-content">

                <span className="collection-card-audience">
                  HIDE DESIGN
                </span>

                <h2>
                  Custom Outerwear
                </h2>

                <p>
                  Choose your product category, select an available article,
                  and tell us about your required materials, colors, sizing,
                  quantity, and custom specifications.
                </p>

                <span className="collection-explore">
                  <span>START YOUR INQUIRY</span>
                  <span className="collection-arrow">↗</span>
                </span>

              </div>

            </Link>

          </div>

        </div>
      </section>
    </main>
  )
}