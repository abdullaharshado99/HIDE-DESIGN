'use client'

import { useScrollReveal } from './ScrollReveal'

export default function Material() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="material-section" id="leather">
      <div
        ref={ref}
        className={`material-grid reveal-stagger ${
          isVisible ? 'visible' : ''
        }`}
      >

        {/* LEFT — IMAGE */}
        <div className="material-panel">
          <div className="material-image">
            <img
              src="/images/materials.jpg"
              alt="Premium leather and wool materials"
            />
          </div>
        </div>

        {/* RIGHT — MATERIALS */}
        <div className="material-left">
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
        </div>

      </div>
    </section>
  )
}
