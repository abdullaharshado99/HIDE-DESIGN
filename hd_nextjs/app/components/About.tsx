import Image from 'next/image'

export default function About() {
  return (
    <section className="about-section" id="about">
      <div className="container about-grid">

        {/* LEFT — FOUNDER */}
        <div className="about-founder">
          <div className="about-founder-image">
            <Image
              src="/images/founder.jpg"
              alt="Founder of HIDE DESIGN"
              width={500}
              height={600}
            />
          </div>

          <div className="about-founder-name">
            <span>Founder</span>
            <strong>Arshad Javiad Chaudhry</strong>
          </div>
        </div>

        {/* CENTER — ABOUT TEXT */}
        <div className="about-content">
          <span className="eyebrow">ABOUT HIDE DESIGN</span>

          <div className="about-text">
            <p>
              Established in <strong>2002</strong>, <strong>HIDE DESIGN</strong> has built a strong reputation for excellence in the manufacturing of premium leather goods, earning the trust of customers through exceptional craftsmanship, superior materials, and uncompromising quality. With more than two decades of experience in the industry, we have continuously evolved to meet the changing demands of fashion while preserving the values of precision, durability, and timeless elegance.
            </p>

            <p>
              Today, <strong>HIDE DESIGN</strong> proudly extends its expertise to the manufacturing of luxury long coats, combining traditional tailoring techniques with contemporary designs to create garments that reflect sophistication and comfort. Every coat is carefully crafted using premium fabrics, meticulous stitching, and rigorous quality standards to ensure an outstanding finish. Whether for retail, wholesale, or private-label manufacturing, our commitment remains the same—to deliver exclusive quality products that exceed customer expectations and represent true luxury.
            </p>
          </div>
        </div>

        {/* RIGHT — YEAR */}
        <div className="about-number">
          2002
        </div>

      </div>
    </section>
  )
}