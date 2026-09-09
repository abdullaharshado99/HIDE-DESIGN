'use client';

import { useScrollReveal } from './ScrollReveal'

export default function Custom() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="custom-section" id="custom">
      <div
        ref={ref}
        className={`custom-inner reveal-stagger ${isVisible ? 'visible' : ''}`}
      >

        {/* LEFT — IMAGE */}
        <div className="custom-image">
          <img
            src="/images/custom-project.jpg"
            alt="Custom leather craftsmanship"
          />
        </div>

        {/* RIGHT — TEXT */}
        <div className="custom-copy">
          <span className="eyebrow">
            PRIVATE LABEL · WHOLESALE · BESPOKE
          </span>

          <h2>
            Your design.
            <br />
            <em>Our craftsmanship.</em>
          </h2>

          <p>
            Share your sketches, references, fabric requirements or size
            specifications. Our team can develop custom coats for your
            collection or private label.
          </p>

          <a className="btn btn-gold" href="#contact">
            Start A Custom Project <span>→</span>
          </a>
        </div>

      </div>
    </section>
  )
}