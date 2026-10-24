import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hidesdesign.com'
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hide-design-q2o9.onrender.com'
const PAGE_SIZE = 500

type ProductRecord = {
  articleNumber?: string
}

async function getProducts(): Promise<ProductRecord[]> {
  try {
    const response = await fetch(`${apiBaseUrl}/products`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) return []
    const products = (await response.json()) as ProductRecord[]
    return Array.isArray(products) ? products : []
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts()

  const baseRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/admin`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/collections/men-jackets`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/collections/men-coats`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/collections/women-jackets`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/collections/women-coats`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/collections/accessories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  ]

  const productRoutes: MetadataRoute.Sitemap = products
    .filter((product) => Boolean(product.articleNumber))
    .map((product) => ({
      url: `${siteUrl}/products/${encodeURIComponent(product.articleNumber ?? '')}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

  return [...baseRoutes, ...productRoutes]
}