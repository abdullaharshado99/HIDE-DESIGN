'use client'

import { useEffect, useState, FormEvent } from 'react'
import { getApiUrl } from '../api-config'
import { toast } from 'sonner'

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'submitted' | 'error'>('idle')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('customer_token')
    if (!token) return

    fetch(`${getApiUrl()}/customers/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(user => {
        if (user) {
          if (user.name) setName(user.name)
          if (user.email) setEmail(user.email)
          if (user.phone) setPhone(user.phone)
        }
      })
      .catch(() => { })
  }, [])

  // useEffect(() => {
  //   const handleEnquiry = (event: Event) => {
  //     const detail = (
  //       event as CustomEvent<{
  //         name?: string
  //         company?: string
  //         products?: string[]
  //       }>
  //     ).detail

  //     const form = document.querySelector<HTMLFormElement>('.quote-form')
  //     if (!form) return

  //     const messageInput = form.elements.namedItem('message') as HTMLTextAreaElement | null

  //     if (messageInput && detail.products?.length) {
  //       messageInput.value =
  //         `I would like to discuss: ${detail.products.join(', ')}` +
  //         `${detail.company ? `\nCompany: ${detail.company}` : ''}`
  //     }
  //   }

  //   window.addEventListener('hide-design-enquiry', handleEnquiry)

  //   return () => {
  //     window.removeEventListener('hide-design-enquiry', handleEnquiry)
  //   }
  // }, [])

  const uploadImage = async (file: File) => {
    const data = new FormData()
    data.append('file', file)
    data.append('upload_preset', 'hide_design_uploads')
    data.append('cloud_name', 'gmqcr7ae')

    const res = await fetch(`https://api.cloudinary.com/v1_1/gmqcr7ae/image/upload`, {
      method: 'POST',
      body: data,
    })

    if (!res.ok) throw new Error('Image upload failed')
    const result = await res.json()
    return result.secure_url
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = Object.fromEntries(new FormData(form).entries())
    const apiUrl = getApiUrl()

    setUploading(true)
    try {
      let imageUrl = null
      if (file) {
        imageUrl = await uploadImage(file)
      }

      const payload = {
        ...formData,
        imageUrl
      }

      const response = await fetch(`${apiUrl}/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Quote submission failed')

      setStatus('submitted')
      setFile(null)
      form.reset()

      const token = localStorage.getItem('customer_token')
      if (token) {
        fetch(`${apiUrl}/customers/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => res.json()).then(user => {
          if (user) {
            setName(user.name || '')
            setEmail(user.email || '')
            setPhone(user.phone || '')
          }
        })
      }

      setTimeout(() => setStatus('idle'), 600000)
    } catch (err) {
      console.error(err)
      setStatus('error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <section className="contact-section" id="contact">
      <div className="container contact-grid">
        <div className="contact-copy">
          <span className="eyebrow">LET'S WORK TOGETHER</span>
          <h2>
            Request a <em>quote.</em>
          </h2>
          <p>
            Tell us what you are looking for and our team will get back to you
            with the next steps.
          </p>
          <div className="contact-details">
            <a href="tel:+923044885277">+92 304 488 5277</a>
            <a href="tel:+923434094678">+92 343 409 4678</a>
            <a href="tel:+923008441503">+92 300 844 1503</a>
            <a href="mailto:info@hidesdesign.com">info@hidesdesign.com</a>
            <span>Pakistan · Worldwide Export</span>
          </div>
        </div>
        <div className="contact-socials">
          <a href="https://www.facebook.com/profile.php?id=61592666757041" target="_blank" rel="noopener noreferrer" className="contact-social" aria-label="Facebook" title="Facebook">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 8h3V4h-3c-3.3 0-5 1.9-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1Z" fill="currentColor" />
            </svg>
          </a>
          <a href="https://www.instagram.com/hidedesign.official/?hl=en" target="_blank" rel="noopener noreferrer" className="contact-social" aria-label="Instagram" title="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
          </a>
          <a href="https://www.tiktok.com/@hide.design6" target="_blank" rel="noopener noreferrer" className="contact-social" aria-label="TikTok" title="TikTok">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M16.6 3h-3.2v11.6a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V8.8a5.8 5.8 0 1 0 5 5.8V8.9a7 7 0 0 0 4 1.3V7a4.1 4.1 0 0 1-4-4Z" fill="currentColor" />
            </svg>
          </a>
        </div>
        <form className="quote-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Full Name
              <input name="name" required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>Email
              <input type="email" name="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
          </div>

          <div className="form-row">
            <label>Phone
              <input name="phone" required placeholder="+92 ..." value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <label>Interested In
              <select name="category">
                <option>Men's Long Coats</option>
                <option>Women's Long Coats</option>
                <option>Leather Jackets</option>
                <option>Custom / Private Label</option>
                <option>Wholesale / Export</option>
              </select>
            </label>
          </div>

          <label>
            Message
            <textarea name="message" required rows={5} placeholder="Tell us about your requirements, quantity, fabric, sizes, or design..." />
          </label>

          <label>
            Reference Image (Optional)
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{
                border: '1px dashed var(--gold)',
                padding: '12px',
                background: 'rgba(201, 162, 77, 0.05)',
                borderRadius: '4px',
                color: 'var(--muted)',
                cursor: 'pointer',
                fontSize: '13px',
                marginTop: '4px'
              }}
            />
            {file && <span style={{ fontSize: '11px', color: 'var(--gold)', marginTop: '4px' }}>Selected: {file.name}</span>}
          </label>

          <button className="btn btn-gold form-submit" type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Send Request →'}
          </button>

          {status === 'submitted' && (
            <div className="form-success">
              <p>Thank you. Your request has been received.</p>
            </div>
          )}
          {status === 'error' && (
            <p className="form-success">We could not send your request. Please try again.</p>
          )}
        </form>
      </div>
    </section>
  )
}