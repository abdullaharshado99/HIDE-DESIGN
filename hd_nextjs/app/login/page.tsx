import type { Metadata } from 'next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AuthForm from '../components/AuthForm'

export const metadata: Metadata = {
  title: 'Sign in | HIDE DESIGN',
  robots: { index: false },
}

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <AuthForm mode="login" />
      <Footer />
    </>
  )
}