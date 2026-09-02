import type { Metadata } from 'next'
import ProductDetailView from '../../components/ProductDetailView'

export const metadata: Metadata = {
  title: 'Product Details | HIDE DESIGN Admin',
  description: 'View and manage product article details',
}

export default function ProductDetailPage() {
  return <ProductDetailView />
}
