import type { Metadata } from 'next'
import ProductDetails from '../../components/ProductDetails'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hidesdesign.com'
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hide-design.onrender.com'

interface ProductPageProps {
  params: Promise<{
    articleNumber: string
  }>
}

type ProductFromApi = {
  articleNumber?: string
  name?: string
  description?: string
  imageUrl?: string
}

async function getProduct(articleNumber: string): Promise<ProductFromApi | null> {
  try {
    const response = await fetch(
      `${apiBaseUrl}/products/${encodeURIComponent(articleNumber)}`,
      { next: { revalidate: 3600 } },
    )

    if (!response.ok) {
      return null
    }

    return (await response.json()) as ProductFromApi
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { articleNumber } = await params
  const product = await getProduct(articleNumber)
  const canonicalUrl = `${siteUrl}/products/${encodeURIComponent(articleNumber)}`
  const productTitle = product?.name ? `${product.name} | HIDE DESIGN` : 'Product | HIDE DESIGN'
  const productDescription = product?.description || 'Premium HIDE DESIGN product.'
  const imageUrl = product?.imageUrl || `${siteUrl}/file.svg`

  return {
    title: productTitle,
    description: productDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: productTitle,
      description: productDescription,
      url: canonicalUrl,
      siteName: 'HIDE DESIGN',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product?.name || 'HIDE DESIGN product',
        },
      ],
    },
  }
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { articleNumber } = await params

  return (
    <ProductDetails articleNumber={articleNumber} />
  )
}