import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import CategoryProducts from '../../components/CategoryProducts'

type CollectionConfig = {
  gender?: 'men' | 'women'
  category: 'jackets' | 'coats' | 'accessories'
  title: string
  eyebrow: string
}

const COLLECTIONS: Record<string, CollectionConfig> = {
  'men-jackets': {
    gender: 'men',
    category: 'jackets',
    title: "Men's Jackets",
    eyebrow: "THE MEN'S JACKET EDIT",
  },
  'men-coats': {
    gender: 'men',
    category: 'coats',
    title: "Men's Long Coats",
    eyebrow: "THE MEN'S COAT EDIT",
  },
  'women-jackets': {
    gender: 'women',
    category: 'jackets',
    title: "Women's Jackets",
    eyebrow: "THE WOMEN'S JACKET EDIT",
  },
  'women-coats': {
    gender: 'women',
    category: 'coats',
    title: "Women's Long Coats",
    eyebrow: "THE WOMEN'S COAT EDIT",
  },
  accessories: {
    category: 'accessories',
    title: 'Accessories',
    eyebrow: 'THE ACCESSORIES EDIT',
  },
}

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const collection = COLLECTIONS[slug]

  if (!collection) {
    return { title: 'Collection | HIDE DESIGN' }
  }

  return {
    title: `${collection.title} | HIDE DESIGN`,
    description: `Browse all ${collection.title} by HIDE DESIGN.`,
  }
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params
  const collection = COLLECTIONS[slug]

  if (!collection) {
    notFound()
  }

  return (
    <>
      <Navbar />

      <main>
        <CategoryProducts
          gender={collection.gender}
          category={collection.category}
          title={collection.title}
          eyebrow={collection.eyebrow}
        />
      </main>

      <Footer />
    </>
  )
}