interface TrustItem {
  number: string
  title: string
  desc: string
}

export default function TrustStrip() {
  const items: TrustItem[] = [
    { number: '01', title: 'Premium Materials', desc: 'Finest Wool & Leather' },
    { number: '02', title: 'Custom Design', desc: 'Built To Your Preference' },
    { number: '03', title: 'Quality Assured', desc: 'Crafted To Perfection' },
    { number: '04', title: 'Global Export', desc: 'Worldwide Shipping' },
  ]

  return (
    <section className="trust-strip">
      <div className="container trust-grid">
        {items.map((item) => (
          <div key={item.number}>
            <strong>{item.number}</strong>
            <span>
              {item.title}
              <small>{item.desc}</small>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}