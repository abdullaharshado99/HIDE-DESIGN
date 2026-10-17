'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [scrolled, setScrolled] = useState<boolean>(false)
  const [accountOpen, setAccountOpen] = useState<boolean>(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const accountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('customer_token')
    setIsLoggedIn(!!token)
  }, [])

  useEffect(() => {
    if (!accountOpen) return

    const handleClick = (event: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false)
      }
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAccountOpen(false)
    }

    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)

    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [accountOpen])

  const closeAll = () => {
    setIsOpen(false)
    setAccountOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('customer_token')
    localStorage.removeItem('customer_user')
    setIsLoggedIn(false)
    setAccountOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="wrap">
        <a href="/#top" className="brand">
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
          <a href="/#about" onClick={closeAll}>About</a>
          <a href="/#men-jackets" onClick={closeAll}>Men&apos;s Jackets</a>
          <a href="/#men-coats" onClick={closeAll}>Men&apos;s Coats</a>
          <a href="/#women-jackets" onClick={closeAll}>Women&apos;s Jackets</a>
          <a href="/#women-coats" onClick={closeAll}>Women&apos;s Coats</a>
          <a href="/#Accessories" onClick={closeAll}>Accessories</a>

          <div className="nav-account" ref={accountRef}>
            <a
              href={isLoggedIn ? '#' : '/login'}
              className="nav-account-btn"
              onClick={(event) => {
                event.preventDefault()
                // if (isLoggedIn) {
                setAccountOpen((open) => !open)
                // } else {
                //   router.push('/login')
                // }
              }}
              aria-expanded={accountOpen}
              aria-haspopup="true"
            >
              {isLoggedIn ? 'PROFILE' : 'MY ACCOUNT'}
            </a>

            {accountOpen && (
              <div className="nav-account-menu" role="menu">
                {isLoggedIn ? (
                  <>
                    <Link href="/profile" role="menuitem" onClick={closeAll}>
                      My Profile
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="nav-logout-btn"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" role="menuitem" onClick={closeAll}>
                      Sign in
                    </Link>
                    <Link href="/signup" role="menuitem" onClick={closeAll}>
                      Create account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <a href="/#contact" onClick={closeAll}>Contact Us</a>
        </nav>

        <div className="nav-right">
          <a className="btn-quote" href="/#contact">
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