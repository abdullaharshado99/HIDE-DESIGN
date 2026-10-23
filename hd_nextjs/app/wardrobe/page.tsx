'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getApiUrl } from '../api-config'

interface WardrobeItem {
    id: number
    articleNumber: string
    name: string
    imageUrl: string
    material: string
    price: number | null
    currency: string
}

export default function WardrobePage() {
    const router = useRouter()
    const [items, setItems] = useState<WardrobeItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('customer_token')
        if (!token) {
            router.push('/login')
            return
        }

        fetch(`${getApiUrl()}/wardrobe`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to load wardrobe')
                return res.json()
            })
            .then((data) => setItems(data))
            .catch((err) => {
                console.error(err)
                toast.error('Could not load your wardrobe.')
            })
            .finally(() => setLoading(false))
    }, [router])

    const handleRemove = async (id: number) => {
        const token = localStorage.getItem('customer_token')
        if (!token) return

        try {
            const res = await fetch(`${getApiUrl()}/wardrobe/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            })
            if (!res.ok) throw new Error('Failed to remove')
            setItems((current) => current.filter((item) => item.id !== id))
            toast.success('Removed from wardrobe.')
            window.dispatchEvent(new CustomEvent('wardrobe-updated'))
        } catch {
            toast.error('Could not remove item.')
        }
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="wardrobe-page">
                    <p style={{ padding: '100px', textAlign: 'center' }}>Loading wardrobe...</p>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Navbar />
            <main className="wardrobe-page">
                <div className="container">
                    <div className="wardrobe-header">
                        <span className="eyebrow">MY WARDROBE</span>
                        <h1>Saved <em>Pieces.</em></h1>
                        <p>Your personal collection of saved products.</p>
                    </div>

                    {items.length === 0 ? (
                        <div className="wardrobe-empty">
                            <p>Your wardrobe is empty.</p>
                            <Link href="/" className="btn btn-gold">
                                Browse Collection
                            </Link>
                        </div>
                    ) : (
                        <div className="wardrobe-grid">
                            {items.map((item) => (
                                <article className="wardrobe-card" key={item.id}>
                                    <Link href={`/products/${item.articleNumber}`} className="wardrobe-image">
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.name}
                                            width={280}
                                            height={340}
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </Link>
                                    <div className="wardrobe-info">
                                        <span className="wardrobe-id">{item.articleNumber}</span>
                                        <h3>{item.name}</h3>
                                        <p>{item.material}</p>
                                        {item.price != null && (
                                            <span className="wardrobe-price">
                                                {item.currency} {item.price}
                                            </span>
                                        )}
                                        <button
                                            className="wardrobe-remove"
                                            onClick={() => handleRemove(item.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                    <Link href="/checkout" className="btn btn-gold" style={{ marginTop: '30px' }}>
                        Proceed to Checkout
                    </Link>
                </div>
            </main>
            <Footer />
        </>
    )
}