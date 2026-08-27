'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [scrolled, setScrolled] = useState<boolean>(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="wrap">
        <a href="#top" className="brand">
          <Image
            src="/images/logo.png"
            alt="Hide Design logo"
            width={38}
            height={38}
            style={{ width: 'auto' }}
          />
          <span className="brand-text">
            <span className="name">HIDE DESIGN</span>
            <span className="sub">Leather &amp; Long Coats</span>
          </span>
        </a>

        <nav className={`primary-links ${isOpen ? 'open' : ''}`}>
          <a href="#men" onClick={() => setIsOpen(false)}>Men</a>
          <a href="#women" onClick={() => setIsOpen(false)}>Women</a>
          <a href="#leather" onClick={() => setIsOpen(false)}>Leather</a>
          <a href="#custom" onClick={() => setIsOpen(false)}>Custom</a>
          <a href="#account" onClick={() => setIsOpen(false)}>My account</a>
          <a href="#about" onClick={() => setIsOpen(false)}>About</a>
          <a href="#contact" onClick={() => setIsOpen(false)}>Contact Us</a>
        </nav>

        <div className="nav-right">
          <a className="btn-quote" href="#contact">
            <span className="txt">Request a Quote</span> ↗
          </a>
          <button
            className="hamburger"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  )
}