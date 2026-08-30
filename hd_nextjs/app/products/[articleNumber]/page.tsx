import ProductDetails from '../../components/ProductDetails'

interface ProductPageProps {
  params: Promise<{
    articleNumber: string
  }>
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { articleNumber } = await params

  return (
    <ProductDetails articleNumber={articleNumber} />
  )
}