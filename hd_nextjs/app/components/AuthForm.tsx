'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { getApiUrl } from '../api-config'
import { toast } from 'sonner'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const isSignup = mode === 'signup'

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')

    if (isSignup) {
      if (form.password.length < 8) {
        setError('Password must be at least 8 characters.')
        return
      }

      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match.')
        return
      }
    }

    setSubmitting(true)

    try {
      const apiUrl = getApiUrl()

      const endpoint = isSignup
        ? `${apiUrl}/customers/register`
        : `${apiUrl}/customers/login`

      const body = isSignup
        ? {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
        }
        : {
          email: form.email.trim(),
          password: form.password,
        }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null)

        const message = Array.isArray(errorBody?.message)
          ? errorBody.message.join(', ')
          : errorBody?.message

        setError(
          message ||
          (isSignup
            ? 'Could not create your account. Please try again.'
            : 'Invalid email or password.')
        )
        return
      }

      const result = await response.json()

      try {
        localStorage.setItem('customer_token', result.accessToken)
        if (result.user) {
          localStorage.setItem('customer_user', JSON.stringify({
            id: result.user.id,
            name: result.user.name || '',
            email: result.user.email || '',
            phone: result.user.phone || '',
          }))
        }
      } catch { }

      toast.success(
        isSignup
          ? 'Account created successfully!'
          : 'Signed in successfully!'
      )

      router.push('/')
      router.refresh()
    } catch (err) {
      console.error('Auth error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <form
        className="auth-card"
        onSubmit={handleSubmit}
        noValidate={false}
      >
        <span className="eyebrow">
          {isSignup ? 'CREATE ACCOUNT' : 'WELCOME BACK'}
        </span>

        <h1>
          {isSignup ? (
            <>
              Join <em>HIDE DESIGN.</em>
            </>
          ) : (
            <>
              Sign <em>in.</em>
            </>
          )}
        </h1>

        <p className="auth-intro">
          {isSignup
            ? 'Create an account to track your inquiries and sample orders.'
            : 'Sign in to view your inquiries and sample orders.'}
        </p>

        {isSignup && (
          <label className="auth-field">
            <span>Full Name</span>
            <input
              type="text"
              autoComplete="name"
              required
              placeholder="Your name"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
            />
          </label>
        )}

        <label className="auth-field">
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </label>

        {isSignup && (
          <label className="auth-field">
            <span>Phone</span>
            <input
              type="tel"
              autoComplete="tel"
              required
              placeholder="+92 ..."
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
            />
          </label>
        )}

        <label className="auth-field">
          <span>Password</span>

          <div className="auth-password">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              required
              minLength={isSignup ? 8 : undefined}
              placeholder={
                isSignup
                  ? 'Create your password'
                  : 'Your password'
              }
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
            />

            <button
              type="button"
              className="auth-eye"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={
                showPassword ? 'Hide password' : 'Show password'
              }
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </label>

        {isSignup && (
          <label className="auth-field">
            <span>Confirm Password</span>
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={(e) =>
                update('confirmPassword', e.target.value)
              }
            />
          </label>
        )}

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-gold auth-submit"
          disabled={submitting}
        >
          {submitting
            ? isSignup
              ? 'Creating account...'
              : 'Signing in...'
            : isSignup
              ? 'Create account'
              : 'Sign in'}
        </button>

        <p className="auth-switch">
          {isSignup ? (
            <>
              Already have an account?{' '}
              <Link href="/login">Sign in</Link>
            </>
          ) : (
            <>
              New to HIDE DESIGN?{' '}
              <Link href="/signup">Create an account</Link>
            </>
          )}
        </p>
      </form>
    </main>
  )
}