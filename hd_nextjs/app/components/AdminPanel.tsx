'use client'

import { FormEvent, useState, useEffect } from 'react'
import Link from 'next/link'
import { getApiUrl } from '../api-config'
import { useRouter } from 'next/navigation'

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
const CLOUD_NAME = 'gmqcr7ae';
const UPLOAD_PRESET = 'hide_design_uploads';

interface AdminPanelProps {
  initialEditId?: number | null
}

export default function AdminPanel({ initialEditId }: AdminPanelProps) {
  const apiUrl = getApiUrl()
  const router = useRouter()
  const [token, setToken] = useState('')
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState<Omit<Product, 'id'>>(emptyProduct)
  const [editingId, setEditingId] = useState<number | null>(initialEditId ?? null)
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token')
    if (savedToken) {
      setToken(savedToken)
      loadProducts(savedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (token && products.length > 0 && initialEditId) {
      const productToEdit = products.find((p) => p.id === initialEditId)
      if (productToEdit) {
        setEditingId(productToEdit.id)
        setForm(productToEdit)
      }
    }
  }, [initialEditId, token, products])

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', UPLOAD_PRESET);
    data.append('cloud_name', CLOUD_NAME);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: data,
      });
      const result = await response.json();

      if (result.secure_url) {
        setForm({ ...form, imageUrl: result.secure_url });
        setMessage('Image uploaded successfully!');
      } else {
        setMessage('Cloudinary error: ' + (result.error?.message || 'Unknown error'));
      }
    } catch (error) {
      setMessage('Image upload failed. Check your Cloudinary details.');
    } finally {
      setUploading(false);
    }
  }

  async function loadProducts(accessToken: string) {
    try {
      const response = await fetch(`${apiUrl}/products/admin/all`, { headers: { Authorization: `Bearer ${accessToken}` } })
      if (!response.ok) throw new Error('Could not load articles')
      setProducts(await response.json())
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function login(event: FormEvent) {
    event.preventDefault()
    const response = await fetch(`${apiUrl}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) })
    if (!response.ok) return setMessage('Invalid admin credentials.')
    const result = await response.json()
    localStorage.setItem('admin_token', result.accessToken)
    setToken(result.accessToken)
    setIsLoading(true)
    await loadProducts(result.accessToken)
  }

  const handleSignOut = () => {
    localStorage.removeItem('admin_token')
    setToken('')
    setProducts([])
    setEditingId(null)
    setForm(emptyProduct)
    setMessage('')
  }

  async function saveProduct(event: FormEvent) {
    event.preventDefault()

    const productToSave = {
      ...form,
      price: form.price === null ? null : Number(form.price),
    };
    if (!productToSave.imageUrl.trim()) {
      setMessage('Please upload a product image before saving.')
      return
    }
    const endpoint = editingId ? `${apiUrl}/products/${editingId}` : `${apiUrl}/products`
    const response = await fetch(endpoint, {
      method: editingId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(productToSave)
    })
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
        <h1>Article portal</h1>
        <input type="email" placeholder="Admin email" required value={credentials.email} onChange={(event) => setCredentials({ ...credentials, email: event.target.value })} />
        <input type="password" placeholder="Password" required value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} />
        <button className="btn btn-gold" type="submit">Sign in</button>
        {message && <p>{message}</p>}
      </form>
    </main>
  )

  return (
    <main className="admin-shell">
      <div className="admin-header">
        <div>
          <span className="eyebrow">HIDE DESIGN · ADMIN</span>
          <h1>Article portal</h1>
          <p className="admin-intro">Upload and curate product articles for the public catalogue.</p>
        </div>
        <button className="btn-quote" onClick={handleSignOut}>Sign out</button>
      </div>

      <div className="admin-grid">
        <form className="admin-form" onSubmit={saveProduct}>
          <h2>{editingId ? 'Edit article' : 'New article'}</h2>

          <label>
            Article Number
            <input type="text" value={form.articleNumber} onChange={(e) => setForm({ ...form, articleNumber: e.target.value })} required />
          </label>

          <label>
            Product Name
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>

          <label>
            Price (e.g., 250)
            <input type="number" value={form.price ?? ''} onChange={(e) => setForm({ ...form, price: e.target.value ? Number(e.target.value) : null })} />
          </label>

          <label>
            Category
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="jackets">Jackets</option>
              <option value="coats">Coats</option>
            </select>
          </label>

          <label>
            Audience
            <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
          </label>

          <label>
            Material
            <input type="text" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} required />
          </label>

          <label>
            Description
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </label>

          <label>
            Upload Image
            <input type="file" accept="image/*" required={!editingId} onChange={uploadImage} />
            {uploading && <span>Uploading to Cloudinary...</span>}
            {form.imageUrl && (
              <img src={form.imageUrl} alt="Preview" style={{ width: '100px', height: 'auto', marginTop: '10px' }} />
            )}
          </label>

          <label className="admin-check">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Published
          </label>

          <button className="btn btn-gold" type="submit" disabled={uploading}>
            {editingId ? 'Publish changes' : 'Upload article'}
          </button>

          {editingId && <button type="button" className="btn-quote" onClick={() => { setEditingId(null); setForm(emptyProduct) }}>Cancel</button>}
          {message && <p>{message}</p>}
        </form>

        <section className="admin-list">
          <div className="admin-list-header">
            <h2>Published and draft articles</h2>
            {products.length > 5 && (
              <button className="btn-quote" onClick={() => router.push('/admin/all-products')}>
                Show More ({products.length})
              </button>
            )}
          </div>

          {/* Sirf pehle 5 products dikhayenge */}
          {products.slice(0, 5).map((product) => (
            <article className="admin-row" key={product.id}>
              <div className="admin-row-product">
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.name} className="admin-row-image" />
                )}
                <div className="admin-row-info">
                  <strong className="admin-row-article">{product.articleNumber}</strong>
                  <span className="admin-row-name">{product.name}</span>
                  <small className="admin-row-audience">
                    {product.audience} · {product.price ? `${product.currency} ${product.price}` : 'No Price'}
                  </small>
                </div>
              </div>
              <div className="admin-row-actions">
                <Link href={`/admin/${product.id}`} className="btn-quote" title="View full details">View</Link>
                <button className="btn-quote" onClick={() => { setEditingId(product.id); setForm(product) }}>Edit</button>
                <button className="admin-delete" onClick={() => removeProduct(product.id)}>Delete</button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}