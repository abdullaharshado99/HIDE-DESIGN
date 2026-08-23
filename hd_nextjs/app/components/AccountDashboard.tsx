'use client'

import { useState } from 'react'
import { ArrowUpRight, Check, Heart, UserRound } from 'lucide-react'

const featuredProducts = [
  { id: 'HD-M01', name: 'The Regent', detail: 'Wool · Tailored double-breasted', audience: 'Menswear' },
  { id: 'HD-W01', name: 'The Elena', detail: 'Wool · Sculpted silhouette', audience: 'Womenswear' },
  { id: 'HD-M04', name: 'The Sovereign', detail: 'Cashmere blend · Luxury finish', audience: 'Menswear' },
]

export default function AccountDashboard() {
  const [savedProducts, setSavedProducts] = useState<string[]>(['HD-M01', 'HD-W01'])
  const [name, setName] = useState('Your name')
  const [company, setCompany] = useState('Company or studio')
  const [saved, setSaved] = useState(false)

  function toggleSaved(id: string) {
    setSavedProducts((current) => current.includes(id)
      ? current.filter((productId) => productId !== id)
      : [...current, id])
  }

  return (
    <section className="account-section" id="account">
      <div className="container">
        <div className="account-heading">
          <div>
            <span className="eyebrow">PRIVATE CLIENT DESK</span>
            <h2>Your product <em>workspace.</em></h2>
          </div>
          <span className="account-status"><Check size={14} /> Private workspace preview</span>
        </div>

        <div className="account-layout">
          <aside className="account-profile">
            <div className="account-avatar"><UserRound size={24} /></div>
            <span className="account-kicker">CLIENT PROFILE</span>
            <h3>Build your next collection.</h3>
            <p>Keep your product notes together and prepare a considered request for our atelier.</p>
            <label>
              Your name
              <input value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label>
              Company or studio
              <input value={company} onChange={(event) => setCompany(event.target.value)} />
            </label>
            <a className="btn btn-gold" href="#contact">Speak with the atelier <ArrowUpRight size={16} /></a>
          </aside>

          <div className="account-main">
            <div className="account-summary">
              <div><strong>{savedProducts.length}</strong><span>Saved products</span></div>
              <div><strong>01</strong><span>Open enquiry</span></div>
              <div><strong>48h</strong><span>Typical response</span></div>
            </div>
            <div className="account-products-header">
              <div><span className="account-kicker">YOUR SHORTLIST</span><h3>Product details to review</h3></div>
              <span className="account-note">Select a piece to include it in your enquiry.</span>
            </div>
            <div className="account-products">
              {featuredProducts.map((product) => {
                const isSaved = savedProducts.includes(product.id)
                return (
                  <article className={`account-product ${isSaved ? 'is-saved' : ''}`} key={product.id}>
                    <div><span className="product-id">{product.id}</span><h4>{product.name}</h4><p>{product.detail}</p><small>{product.audience}</small></div>
                    <button className="save-product" type="button" onClick={() => toggleSaved(product.id)} aria-label={`${isSaved ? 'Remove' : 'Save'} ${product.name}`} title={`${isSaved ? 'Remove from' : 'Save to'} shortlist`}><Heart size={17} fill={isSaved ? 'currentColor' : 'none'} /></button>
                  </article>
                )
              })}
            </div>
            <button className="account-save" type="button" onClick={() => setSaved(true)}>{saved ? 'Workspace saved' : 'Save workspace'} <ArrowUpRight size={16} /></button>
          </div>
        </div>
      </div>
    </section>
  )
}
