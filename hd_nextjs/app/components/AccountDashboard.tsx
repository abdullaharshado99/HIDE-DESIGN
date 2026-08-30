'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight, Check, Heart, UserRound } from 'lucide-react'
import { getApiUrl } from '../api-config'

interface Product { id: string; name: string; detail: string; audience: string; description?: string }

const featuredProducts: Product[] = [
  { id: 'HD-M01', name: 'The Regent', detail: 'Wool · Tailored double-breasted', audience: 'Menswear' },
  { id: 'HD-W01', name: 'The Elena', detail: 'Wool · Sculpted silhouette', audience: 'Womenswear' },
  { id: 'HD-M04', name: 'The Sovereign', detail: 'Cashmere blend · Luxury finish', audience: 'Menswear' },
]

const SAVED_KEY = 'hide-design-shortlist'
const PROFILE_KEY = 'hide-design-client-profile'

export default function AccountDashboard() {
  const [products, setProducts] = useState<Product[]>(featuredProducts)
  const [savedProducts, setSavedProducts] = useState<string[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const shortlist = JSON.parse(localStorage.getItem(SAVED_KEY) ?? '[]')
      const profile = JSON.parse(localStorage.getItem(PROFILE_KEY) ?? '{}')
      if (Array.isArray(shortlist)) setSavedProducts(shortlist)
      if (typeof profile.name === 'string') setName(profile.name)
      if (typeof profile.company === 'string') setCompany(profile.company)
    } catch {  }

    const apiUrl = getApiUrl()
    fetch(`${apiUrl}/products`)
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((remoteProducts: Array<{ articleNumber: string; name: string; material: string; audience: string; description: string }>) => {
        if (remoteProducts.length) setProducts(remoteProducts.map((product) => ({
          id: product.articleNumber, name: product.name, detail: product.material,
          audience: product.audience, description: product.description,
        })))
      })
      .catch(() => undefined)
  }, [])

  function toggleSaved(id: string) {
    setSavedProducts((current) => {
      const next = current.includes(id) ? current.filter((productId) => productId !== id) : [...current, id]
      localStorage.setItem(SAVED_KEY, JSON.stringify(next))
      return next
    })
  }

  function toggleSelected(id: string) {
    setSelectedProducts((current) => current.includes(id) ? current.filter((productId) => productId !== id) : [...current, id])
  }

  function saveWorkspace() {
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ name, company }))
    localStorage.setItem(SAVED_KEY, JSON.stringify(savedProducts))
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  function startEnquiry() {
    const chosen = products.filter((product) => selectedProducts.includes(product.id))
    window.dispatchEvent(new CustomEvent('hide-design-enquiry', { detail: { name, company, products: chosen.map((product) => product.name) } }))
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
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
            <p>Save pieces, add your details, and send one clear product enquiry to the atelier.</p>
            <label>
              Your name
              <input value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label>
              Company or studio
              <input value={company} onChange={(event) => setCompany(event.target.value)} />
            </label>
            <button className="btn btn-gold" type="button" onClick={startEnquiry}>Start an enquiry <ArrowUpRight size={16} /></button>
          </aside>

          <div className="account-main">
            <div className="account-summary">
              <div><strong>{savedProducts.length}</strong><span>Saved products</span></div>
              <div><strong>{selectedProducts.length}</strong><span>In enquiry</span></div>
              <div><strong>48h</strong><span>Typical response</span></div>
            </div>
            <div className="account-products-header">
              <div><span className="account-kicker">YOUR SHORTLIST</span><h3>Product details to review</h3></div>
              <span className="account-note">Save a piece, then add it to your enquiry.</span>
            </div>
            <div className="account-products">
              {products.map((product) => {
                const isSaved = savedProducts.includes(product.id)
                const isSelected = selectedProducts.includes(product.id)
                return (
                  <article className={`account-product ${isSaved ? 'is-saved' : ''}`} key={product.id}>
                    <div><span className="product-id">{product.id}</span><h4>{product.name}</h4><p>{product.detail}</p><small>{product.audience}</small></div>
                    <div className="account-product-actions">
                      <button className="save-product" type="button" onClick={() => toggleSaved(product.id)} aria-label={`${isSaved ? 'Remove' : 'Save'} ${product.name}`} title={`${isSaved ? 'Remove from' : 'Save to'} shortlist`}><Heart size={17} fill={isSaved ? 'currentColor' : 'none'} /></button>
                      <button className="account-select" type="button" onClick={() => toggleSelected(product.id)}>{isSelected ? 'Added' : 'Add to enquiry'}</button>
                    </div>
                  </article>
                )
              })}
            </div>
            <button className="account-save" type="button" onClick={saveWorkspace}>{saved ? 'Workspace saved' : 'Save workspace'} <ArrowUpRight size={16} /></button>
          </div>
        </div>
      </div>
    </section>
  )
}
