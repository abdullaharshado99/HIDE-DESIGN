'use client'

import { useEffect, useState, FormEvent } from 'react'

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'submitted' | 'error'>('idle')
  const [whatsappLink, setWhatsappLink] = useState('')

  useEffect(() => {
    const handleEnquiry = (event: Event) => {
      const detail = (event as CustomEvent<{ name?: string; company?: string; products?: string[] }>).detail
      const form = document.querySelector<HTMLFormElement>('.quote-form')
      if (!form) return
      const nameInput = form.elements.namedItem('name') as HTMLInputElement | null
      const messageInput = form.elements.namedItem('message') as HTMLTextAreaElement | null
      if (nameInput && detail.name) nameInput.value = detail.name
      if (messageInput && detail.products?.length) messageInput.value = `I would like to discuss: ${detail.products.join(', ')}${detail.company ? `\nCompany: ${detail.company}` : ''}`
    }
    window.addEventListener('hide-design-enquiry', handleEnquiry)
    return () => window.removeEventListener('hide-design-enquiry', handleEnquiry)
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

    try {
      const response = await fetch(`${apiUrl}/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Quote submission failed')

      const adminPhone = '+923044885277'
      const messageBody = `New Quote Request\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nCategory: ${data.category}\nMessage: ${data.message}`
      const encodedMessage = encodeURIComponent(messageBody)
      const link = `https://wa.me/${adminPhone.replace('+', '')}?text=${encodedMessage}`

      setWhatsappLink(link)
      setStatus('submitted')
      form.reset()
      setTimeout(() => setStatus('idle'), 5000)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="contact-section" id="contact">
      <div className="container contact-grid">
        <div className="contact-copy">
          <span className="eyebrow">LET'S WORK TOGETHER</span>
          <h2>Request a <em>quote.</em></h2>
          <p>Tell us what you are looking for and our team will get back to you with the next steps.</p>
          <div className="contact-details">
            <a href="tel:+923044885277">+92 304 488 5277</a>
            <a href="tel:+923434094678">+92 343 409 4678</a>
            <a href="mailto:info@hidesdesign.com">info@hidesdesign.com</a>
            <span>Pakistan · Worldwide Export</span>
          </div>
        </div>

        <form className="quote-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              Full Name
              <input name="name" required placeholder="Your name" />
            </label>
            <label>
              Email
              <input type="email" name="email" required placeholder="you@example.com" />
            </label>
          </div>
          <div className="form-row">
            <label>
              Phone
              <input name="phone" required placeholder="+92 ..." />
            </label>
            <label>
              Interested In
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
          <button className="btn btn-gold form-submit" type="submit">
            Send Request <span>→</span>
          </button>

          {status === 'submitted' && (
            <div className="form-success">
              <p>Thank you. Your request has been received.</p>
              {whatsappLink && (
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ marginTop: '10px' }}>
                  📲 Send via WhatsApp
                </a>
              )}
            </div>
          )}
          {status === 'error' && <p className="form-success">We could not send your request. Please try again.</p>}
        </form>
      </div>
    </section>
  )
}