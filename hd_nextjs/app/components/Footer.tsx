import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="footer">

      {/* ---------- FOOTER TOP ---------- */}
      <div className="container footer-top">

        <div className="footer-brand">
          <div className="footer-mark">
            <Image
              src="/images/Logo.png"
              alt="HIDE DESIGN"
              width={44}
              height={44}
            />
          </div>

          <div>
            <strong>HIDE DESIGN</strong>
            <span>MANUFACTURER &amp; EXPORTER</span>
          </div>
        </div>

        <div className="footer-links">
          <a href="#men-jackets">Men</a>
          <a href="#women-jackets">Women</a>
          <a href="#leather">Leather</a>
          <a href="#custom">Custom</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>

        <a className="footer-quote" href="#contact">
          Request A Quote ↗
        </a>

      </div>


      {/* ---------- FOOTER BOTTOM ---------- */}
      <div className="container footer-bottom">

        <span className="footer-copy">
          © 2026 HIDE DESIGN. All rights reserved.
        </span>

        <span className="footer-description">
          Manufacturer &amp; Exporter of Leather Jackets &amp; Long Coats.
        </span>

      </div>

    </footer>
  )
}