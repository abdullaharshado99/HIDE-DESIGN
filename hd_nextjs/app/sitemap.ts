import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hidesdesign.com'
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hide-design.onrender.com'
const PAGE_SIZE = 500

type ProductRecord = {
  articleNumber?: string
}

async function getProducts(): Promise<ProductRecord[]> {
  try {
    const response = await fetch(`${apiBaseUrl}/products`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return []
    }

    const products = (await response.json()) as ProductRecord[]
    return Array.isArray(products) ? products : []
  } catch {
    return []
  }
}

export async function generateSitemaps(): Promise<Array<{ id: number }>> {
  const products = await getProducts()
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE))
  return Array.from({ length: totalPages }, (_, index) => ({ id: index }))
}

export default async function sitemap({
  id,
}: {
  id?: number
} = {}): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts()
  const currentPage = id ?? 0
  const start = currentPage * PAGE_SIZE
  const end = start + PAGE_SIZE
  const currentProducts = products.slice(start, end)

  const baseRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/admin`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  const productRoutes: MetadataRoute.Sitemap = currentProducts
    .filter((product) => Boolean(product.articleNumber))
    .map((product) => ({
      url: `${siteUrl}/products/${encodeURIComponent(product.articleNumber ?? '')}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

  return [...baseRoutes, ...productRoutes]
}
