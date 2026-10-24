'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getApiUrl } from '../api-config'
import { toast } from 'sonner'

export default function CheckoutPage() {
    const router = useRouter()
    const [wardrobeItems, setWardrobeItems] = useState<any[]>([])
    const [shippingAddress, setShippingAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Card'>('COD')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('customer_token')
        if (!token) {
            router.push('/login')
            return
        }

        fetch(`${getApiUrl()}/wardrobe`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setWardrobeItems(data))
            .catch(() => toast.error('Could not load wardrobe'))
    }, [router])

    const totalAmount = wardrobeItems.reduce(
        (sum, item) => sum + Number(item.price || 0),
        0
    )

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = localStorage.getItem('customer_token')
        if (!token) return router.push('/login')

        setLoading(true)
        try {
            const response = await fetch(`${getApiUrl()}/orders/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    items: wardrobeItems,
                    totalAmount,
                    paymentMethod,
                    shippingAddress,
                    phone,
                }),
            })

            if (!response.ok) throw new Error('Order failed')
            toast.success('Order placed successfully!')
            window.dispatchEvent(new CustomEvent('wardrobe-updated'))
            router.push('/')
        } catch (error) {
            console.error(error)
            toast.error('Could not place order. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Navbar />
            <main className="checkout-page">
                <div className="container">
                    <span className="eyebrow">CHECKOUT</span>
                    <h1>Complete Your Order</h1>

                    <form className="checkout-form" onSubmit={handlePlaceOrder}>
                        <label>
                            Shipping Address
                            <textarea
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                required
                                placeholder="House #, Street, City, Country"
                            />
                        </label>

                        <label>
                            Phone Number
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </label>

                        <div className="payment-methods">
                            <label>
                                <input
                                    type="radio"
                                    value="COD"
                                    checked={paymentMethod === 'COD'}
                                    onChange={() => setPaymentMethod('COD')}
                                />
                                Cash on Delivery
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="Card"
                                    checked={paymentMethod === 'Card'}
                                    onChange={() => setPaymentMethod('Card')}
                                />
                                Credit / Debit Card
                            </label>
                        </div>

                        {paymentMethod === 'Card' && (
                            <div className="card-fields">
                                <input placeholder="Card Number" required />
                                <input placeholder="MM/YY" required />
                                <input placeholder="CVV" required />
                            </div>
                        )}

                        <div className="checkout-summary">
                            <h3>Total: USD {totalAmount.toFixed(2)}</h3>
                        </div>

                        <button type="submit" className="btn btn-gold" disabled={loading}>
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    )
}