'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function CollectionPage() {
  return (
    <main className="wholesale-page">
      <section className="wholesale-section" id="wholesale-page">
        <div className="wholesale-shell">

          {/* HEADING */}
          <div className="wholesale-heading">
            <div className="wholesale-eyebrow">
              <span className="wholesale-eyebrow-line" />
              <span>WHOLESALE &amp; BULK</span>
            </div>

            <h1>
              Order in <em>Bulk.</em>
            </h1>
          </div>

          {/* WHOLESALE CARD */}
          <div className="wholesale-card">

            {/* IMAGE */}
            <div className="wholesale-art">

              <div className="wholesale-image-wrap">
                <Image
                  src="/images/wholesale-jacket.jpg"
                  alt="HIDE DESIGN wholesale outerwear"
                  width={700}
                  height={700}
                  className="wholesale-image"
                  priority
                />
              </div>

              <div className="wholesale-badge">
                Wholesale · Export · Private Label
              </div>

            </div>

            {/* CONTENT */}
            <div className="wholesale-body">

              <div className="wholesale-body-eyebrow">
                HIDE DESIGN
              </div>

              <h2>
                Bulk Orders, Made to Your <em>Spec.</em>
              </h2>

              <p>
                Manufacturer &amp; exporter since 2002. Stock your store or
                launch your own label with leather jackets and wool long coats
                produced in volume, to your materials, colors, sizes and
                finishing.
              </p>

              <ol className="wholesale-steps">
                <li>
                  <b>01</b>
                  <span>Choose your category and articles</span>
                </li>

                <li>
                  <b>02</b>
                  <span>
                    Share materials, colors, sizing &amp; quantity
                  </span>
                </li>

                <li>
                  <b>03</b>
                  <span>Receive your wholesale quote</span>
                </li>

                <li>
                  <b>04</b>
                  <span>We manufacture &amp; ship worldwide</span>
                </li>
              </ol>

              <div className="wholesale-tags">
                <span>Wholesale Pricing</span>
                <span>Private Label</span>
                <span>Custom Fabrics</span>
                <span>Worldwide Export</span>
              </div>

              <div className="wholesale-cta">

                <Link
                  href="#contact"
                  className="wholesale-btn wholesale-btn-primary"
                >
                  Request Bulk Quote
                  <span>↗</span>
                </Link>

                <Link
                  href="/collection"
                  className="wholesale-btn wholesale-btn-secondary"
                >
                  Browse Articles
                </Link>

              </div>

            </div>

          </div>

        </div>
      </section>
    </main>
  )
}