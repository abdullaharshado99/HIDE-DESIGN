'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getApiUrl } from '../api-config'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'

interface CustomerUser {
    id?: number
    name: string
    email: string
    phone: string
}

export default function ProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState<CustomerUser | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('customer_token')

        if (!token) {
            router.push('/login')
            return
        }

        fetch(`${getApiUrl()}/customers/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to load profile')
                return res.json()
            })
            .then(data => {
                setUser(data)
                setName(data.name || '')
                setEmail(data.email || '')
                setPhone(data.phone || '')
            })
            .catch(err => {
                console.error(err)
                toast.error('Could not load profile. Please login again.')
                localStorage.removeItem('customer_token')
                router.push('/login')
            })
            .finally(() => setLoading(false))
    }, [router])

    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault()
        const token = localStorage.getItem('customer_token')
        if (!token) return

        setSaving(true)
        try {
            const response = await fetch(`${getApiUrl()}/customers/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    password: password.trim() || undefined,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                throw new Error(errorData?.message || 'Failed to update profile')
            }

            const updatedUser = await response.json()
            setUser(updatedUser)
            setPassword('')
            toast.success('Profile updated successfully!')
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || 'Could not update profile.')
        } finally {
            setSaving(false)
        }
    }

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
                        <p>View and update your account details.</p>
                    </div>

                    <form className="profile-form" onSubmit={handleUpdate}>
                        <div className="profile-grid">
                            <label className="profile-field">
                                <span>Full Name</span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                />
                            </label>

                            <label className="profile-field">
                                <span>Email Address</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                />
                            </label>

                            <label className="profile-field">
                                <span>Phone Number</span>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+92 ..."
                                />
                            </label>
                        </div>

                        <div className="profile-divider" />

                        <label className="profile-field">
                            <span>New Password (Optional)</span>
                            <div className="auth-password" style={{ width: '100%' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Leave blank to keep current password"
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    className="auth-eye"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </label>

                        <div className="profile-actions">
                            <button type="submit" className="btn btn-gold" disabled={saving}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <Link href="/wardrobe" className="btn btn-outline">
                                View Wardrobe
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    )
}