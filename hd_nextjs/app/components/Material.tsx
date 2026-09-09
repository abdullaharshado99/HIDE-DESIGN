'use client';

import { useScrollReveal } from './ScrollReveal'

export default function Material() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="material-section" id="leather">
      <div
        ref={ref}
        className={`material-grid reveal-stagger ${isVisible ? 'visible' : ''}`}
      >

        {/* LEFT — MATERIALS + SERVICES */}
        <div className="material-left">

          {/* OUR MATERIALS */}
          <div className="material-copy">
            <span className="eyebrow">OUR MATERIALS</span>

            <h2>
              From fine <em>leather</em>
              <br />
              to premium wool.
            </h2>

            <p>
              We work with carefully selected hides, wool, tweed and premium
              blends to create outerwear that feels exceptional and holds its
              character season after season.
            </p>

            <div className="material-list">
              <div>
                <span>01</span>
                <b>Leather</b>
                <small>Jackets · Coats · Custom Finishes</small>
              </div>

              <div>
                <span>02</span>
                <b>Wool &amp; Tweed</b>
                <small>Long Coats · Overcoats · Tailoring</small>
              </div>

              <div>
                <span>03</span>
                <b>Custom Fabrics</b>
                <small>Developed To Your Specification</small>
              </div>
            </div>
          </div>


          {/* OUR SERVICES */}
          <div className="services-copy">
            <span className="eyebrow">OUR SERVICES</span>

            <h2>
              Built for <em>business.</em>
            </h2>

            <div className="services-list">
              <div>
                <span>01</span>
                <b>Retail</b>
              </div>

              <div>
                <span>02</span>
                <b>Wholesale</b>
              </div>

              <div>
                <span>03</span>
                <b>Exporter</b>
              </div>

              <div>
                <span>04</span>
                <b>Manufacturing Departmentsip</b>
              </div>
            </div>
          </div>

        </div>


        {/* RIGHT — ONE IMAGE ONLY */}
        <div className="material-panel">
          <img
            src="/images/materials.jpg"
            alt="Premium leather and wool materials"
          />
        </div>

      </div>
    </section>
  )
}