import type { Metadata } from 'next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AuthForm from '../components/AuthForm'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Sign in | HIDE DESIGN',
  robots: { index: false },
}

export default function LoginPage() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
        <AuthForm mode="login" />
        <Footer />
      </Suspense>
    </>
  )
}