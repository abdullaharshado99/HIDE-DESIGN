'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getApiUrl } from '../api-config'

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

export default function AdminAllProducts() {
  const apiUrl = getApiUrl()
  const router = useRouter()
  const [products, setProducts] = useState<Product[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState('')

  const redirectToLogin = useCallback(() => {
    localStorage.removeItem('admin_token')
    router.push('/admin')
  }, [router])

  useEffect(() => {
    if (!token) return

    let timeoutId = window.setTimeout(redirectToLogin, 5 * 60 * 1000)
    const resetInactivityTimer = () => {
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(redirectToLogin, 5 * 60 * 1000)
    }
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart']

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, resetInactivityTimer)
    })

    return () => {
      window.clearTimeout(timeoutId)
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, resetInactivityTimer)
      })
    }
  }, [redirectToLogin, token])

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token')
    if (!savedToken) {
      router.push('/admin')
      return
    }
    
    setToken(savedToken)
    fetch(`${apiUrl}/products/admin/all`, {
      headers: { Authorization: `Bearer ${savedToken}` }
    })
      .then((res) => {
        if (res.status === 401) {
          redirectToLogin()
          throw new Error('Admin session expired')
        }
        if (!res.ok) throw new Error('Could not load articles')
        return res.json()
      })
      .then((data) => setProducts(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [apiUrl, redirectToLogin, router])

  const removeProduct = async (id: number) => {
    if (!window.confirm('Delete this article?')) return
    try {
      await fetch(`${apiUrl}/products/${id}`, { 
        method: 'DELETE', 
        headers: { Authorization: `Bearer ${token}` } 
      })
      setProducts(products?.filter(p => p.id !== id) || null)
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  if (loading) return <div className="admin-shell"><p>Loading all products...</p></div>

  return (
    <main className="admin-shell">
      <div className="admin-header">
        <div>
          <span className="eyebrow">HIDE DESIGN · ADMIN</span>
          <h1>All Articles</h1>
          <p className="admin-intro">Full list of all products.</p>
        </div>
        <Link href="/admin" className="btn-quote">← Back to Admin</Link>
      </div>

      <div className="admin-list">
        {products?.map((product) => (
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
              <Link href={`/admin?edit=${product.id}`} className="btn-quote">Edit</Link>
              <button className="admin-delete" onClick={() => removeProduct(product.id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}