'use client'

import { FormEvent, useState } from 'react'

interface Product {
  id: number
  articleNumber: string
  name: string
  category: string
  audience: string
  material: string
  description: string
  price: number | null
  currency: string
  imageUrl: string
  published: boolean
}

const emptyProduct: Omit<Product, 'id'> = {
  articleNumber: '', name: '', category: 'jackets', audience: 'men',
  material: '', description: '', price: null, currency: 'USD', imageUrl: '', published: true,
}

export default function AdminPanel() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
  const [token, setToken] = useState('')
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState<Omit<Product, 'id'>>(emptyProduct)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [message, setMessage] = useState('')

  async function loadProducts(accessToken: string) {
    const response = await fetch(`${apiUrl}/products/admin/all`, { headers: { Authorization: `Bearer ${accessToken}` } })
    if (!response.ok) throw new Error('Could not load articles')
    setProducts(await response.json())
  }

  async function login(event: FormEvent) {
    event.preventDefault()
    const response = await fetch(`${apiUrl}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) })
    if (!response.ok) return setMessage('Invalid admin credentials.')
    const result = await response.json()
    setToken(result.accessToken)
    await loadProducts(result.accessToken)
  }

  async function saveProduct(event: FormEvent) {
    event.preventDefault()
    const endpoint = editingId ? `${apiUrl}/products/${editingId}` : `${apiUrl}/products`
    const response = await fetch(endpoint, { method: editingId ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) })
    if (!response.ok) return setMessage('Article could not be saved.')
    setMessage('Article saved.')
    setEditingId(null)
    setForm(emptyProduct)
    await loadProducts(token)
  }

  async function removeProduct(id: number) {
    if (!window.confirm('Delete this article?')) return
    await fetch(`${apiUrl}/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    await loadProducts(token)
  }

  if (!token) return (
    <main className="admin-shell">
      <form className="admin-login" onSubmit={login}>
        <span className="eyebrow">HIDE DESIGN · ADMIN</span>
        <h1>Catalogue access</h1>
        <input type="email" placeholder="Admin email" required value={credentials.email} onChange={(event) => setCredentials({ ...credentials, email: event.target.value })} />
        <input type="password" placeholder="Password" required value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} />
        <button className="btn btn-gold" type="submit">Sign in</button>
        {message && <p>{message}</p>}
      </form>
    </main>
  )

  return (
    <main className="admin-shell">
      <div className="admin-header"><div><span className="eyebrow">HIDE DESIGN · ADMIN</span><h1>Article catalogue</h1></div><button className="btn-quote" onClick={() => setToken('')}>Sign out</button></div>
      <div className="admin-grid">
        <form className="admin-form" onSubmit={saveProduct}>
          <h2>{editingId ? 'Edit article' : 'New article'}</h2>
          {Object.entries(form).map(([field, value]) => field === 'published' ? (
            <label key={field} className="admin-check"><input type="checkbox" checked={Boolean(value)} onChange={(event) => setForm({ ...form, published: event.target.checked })} /> Published</label>
          ) : (
            <label key={field}>{field.replace(/([A-Z])/g, ' $1')}<input type={field === 'price' ? 'number' : 'text'} value={String(value ?? '')} onChange={(event) => setForm({ ...form, [field]: field === 'price' ? (event.target.value ? Number(event.target.value) : null) : event.target.value })} required={['articleNumber', 'name', 'material', 'description', 'imageUrl'].includes(field)} /></label>
          ))}
          <button className="btn btn-gold" type="submit">{editingId ? 'Save changes' : 'Add article'}</button>
          {editingId && <button type="button" className="btn-quote" onClick={() => { setEditingId(null); setForm(emptyProduct) }}>Cancel</button>}
          {message && <p>{message}</p>}
        </form>
        <section className="admin-list"><h2>Published and draft articles</h2>{products.map((product) => <article className="admin-row" key={product.id}><div><strong>{product.articleNumber}</strong><span>{product.name} · {product.audience}</span></div><div><button className="btn-quote" onClick={() => { setEditingId(product.id); setForm(product) }}>Edit</button><button className="admin-delete" onClick={() => removeProduct(product.id)}>Delete</button></div></article>)}</section>
      </div>
    </main>
  )
}