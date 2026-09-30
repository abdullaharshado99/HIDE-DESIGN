'use client'

import { useScrollReveal } from './ScrollReveal'

export default function Services() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="services-section" id="services">
      <div
        ref={ref}
        className={`services-container reveal-stagger ${
          isVisible ? 'visible' : ''
        }`}
      >

        {/* LEFT — SERVICES CONTENT */}
        <div className="services-content">

          <div className="services-copy">
            <span className="services-eyebrow">
              OUR SERVICES
            </span>

            <h2>
              Built for <em>business.</em>
            </h2>

            <p>
              From retail and wholesale to international exporting and
              manufacturing partnerships, we provide reliable outerwear
              solutions tailored to every business requirement.
            </p>
          </div>

          <div className="services-list">

            <div className="service-item">
              <span>01</span>
              <div>
                <b>Retail</b>
                <small>
                  Premium outerwear for individual customers and retail
                  collections.
                </small>
              </div>
            </div>

            <div className="service-item">
              <span>02</span>
              <div>
                <b>Wholesale</b>
                <small>
                  Flexible wholesale solutions for businesses and retailers.
                </small>
              </div>
            </div>

            <div className="service-item">
              <span>03</span>
              <div>
                <b>Exporter</b>
                <small>
                  Worldwide export services with dependable production and
                  delivery.
                </small>
              </div>
            </div>

            <div className="service-item">
              <span>04</span>
              <div>
                <b>Manufacturing Partnership</b>
                <small>
                  Dedicated manufacturing support developed around your
                  requirements.
                </small>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT — SERVICES IMAGE */}
        <div className="services-image">
          <img
            src="/images/services.jpg"
            alt="HIDE DESIGN services"
          />
        </div>

      </div>
    </section>
  )
}
