import type { Metadata } from 'next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AuthForm from '../components/AuthForm'

export const metadata: Metadata = {
  title: 'Create account | HIDE DESIGN',
  robots: { index: false },
}

export default function SignupPage() {
  return (
    <>
      <Navbar />
      <AuthForm mode="signup" />
      <Footer />
    </>
  )
}