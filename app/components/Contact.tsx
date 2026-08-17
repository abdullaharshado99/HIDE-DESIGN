'use client'

import { useState, FormEvent } from 'react'

export default function Contact() {
  const [submitted, setSubmitted] = useState<boolean>(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
    ;(e.target as HTMLFormElement).reset()
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <section className="contact-section" id="contact">
      <div className="container contact-grid">
        <div className="contact-copy">
          <span className="eyebrow">LET'S WORK TOGETHER</span>
          <h2>Request a <em>quote.</em></h2>
          <p>Tell us what you are looking for and our team will get back to you with the next steps.</p>
          <div className="contact-details">
            <a href="tel:+923137318089">+92 313 7318089</a>
            <a href="tel:+923434094678">+92 343 4094678</a>
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
              <input name="phone" placeholder="+92 ..." />
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
          {submitted && <p className="form-success">Thank you. Your request has been received.</p>}
        </form>
      </div>
    </section>
  )
}