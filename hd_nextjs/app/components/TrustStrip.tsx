import { Shield, Scissors, BadgeCheck, Crown } from 'lucide-react'

interface TrustItem {
  icon: React.ReactNode
  title: string
  desc: string
}

export default function TrustStrip() {
  const items: TrustItem[] = [
    {
      icon: <Shield size={36} strokeWidth={1.5} />,
      title: 'Finest Materials',
      desc: 'Carefully selected leather & fabrics for superior comfort and durability.',
    },
    {
      icon: <Scissors size={36} strokeWidth={1.5} />,
      title: 'Expert Craftsmanship',
      desc: 'Precision stitching & attention to detail in every piece.',
    },
    {
      icon: <BadgeCheck size={36} strokeWidth={1.5} />,
      title: 'Built To Last',
      desc: 'Durable, reliable & made to stand the test of time.',
    },
    {
      icon: <Crown size={36} strokeWidth={1.5} />,
      title: 'Timeless Design',
      desc: 'Classic styles that never go out of fashion.',
    },
  ]

  return (
    <section className="trust-strip">
      <div className="container trust-grid">
        {items.map((item, index) => (
          <div className="trust-item" key={index}>
            <span className="icon-wrapper">
              {item.icon}
            </span>

            <div className="trust-text">
              <span className="trust-title">
                {item.title}
              </span>

              <small>
                {item.desc}
              </small>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}