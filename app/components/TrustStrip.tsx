import { Shield, Scissors, Star, Globe } from 'lucide-react'

interface TrustItem {
  icon: React.ReactNode
  title: string
  desc: string
}

export default function TrustStrip() {
  const items: TrustItem[] = [
    { 
      icon: <Shield size={36} strokeWidth={1.5} />, 
      title: 'Premium Materials', 
      desc: 'Finest Wool & Leather' 
    },
    { 
      icon: <Scissors size={36} strokeWidth={1.5} />, 
      title: 'Custom Design', 
      desc: 'Built To Your Preference' 
    },
    { 
      icon: <Star size={36} strokeWidth={1.5} />, 
      title: 'Quality Assured', 
      desc: 'Crafted To Perfection' 
    },
    { 
      icon: <Globe size={36} strokeWidth={1.5} />, 
      title: 'Global Export', 
      desc: 'Worldwide Shipping' 
    },
  ]

  return (
    <section className="trust-strip">
      <div className="container trust-grid">
        {items.map((item, index) => (
          <div key={index}>
            <span className="icon-wrapper">{item.icon}</span>
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