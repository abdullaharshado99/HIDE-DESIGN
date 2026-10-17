'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

interface CustomerUser {
    name: string
    email: string
    phone: string
}

export default function ProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState<CustomerUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('customer_token')
        const savedUser = localStorage.getItem('customer_user')

        if (!token) {
            router.push('/login')
            return
        }

        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser))
            } catch {
                router.push('/login')
            }
        }
        setLoading(false)
    }, [router])

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="profile-page">
                    <p style={{ textAlign: 'center', padding: '100px' }}>Loading...</p>
                </main>
                <Footer />
            </>
        )
    }

    if (!user) return null

    return (
        <>
            <Navbar />
            <main className="profile-page">
                <div className="profile-container">
                    <div className="profile-header">
                        <span className="eyebrow">MY ACCOUNT</span>
                        <h1>Your <em>Profile.</em></h1>
                        <p>View your account details and manage your information.</p>
                    </div>

                    <div className="profile-grid">
                        <div className="profile-card">
                            <span className="profile-label">Full Name</span>
                            <p className="profile-value">{user.name || 'Not provided'}</p>
                        </div>

                        <div className="profile-card">
                            <span className="profile-label">Email Address</span>
                            <p className="profile-value">{user.email || 'Not provided'}</p>
                        </div>

                        <div className="profile-card">
                            <span className="profile-label">Phone Number</span>
                            <p className="profile-value">{user.phone || 'Not provided'}</p>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <Link href="/collection" className="btn btn-gold">
                            Start an Inquiry
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}