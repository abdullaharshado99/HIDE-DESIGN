'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight, Check, Heart, UserRound } from 'lucide-react'
import { getApiUrl } from '../api-config'
import ProductInquiryForm from './ProductInquiryForm'

interface Product {
  id: string
  name: string
  detail: string
  audience: string
  imageUrl?: string
  description?: string
  colors: string[]
  sizes: string[]
}

interface ProductSelection {
  colors: string[]
  sizes: string[]
}

const SAVED_KEY = 'hide-design-shortlist'
const PROFILE_KEY = 'hide-design-client-profile'
const SELECTIONS_KEY = 'hide-design-product-selections'

function normalizeOptions(
  value: string[] | string | null | undefined
): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => item.trim())
      .filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

export default function AccountDashboard() {
  const [products, setProducts] = useState<Product[]>([])

  const [savedProducts, setSavedProducts] = useState<string[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const [productSelections, setProductSelections] =
    useState<Record<string, ProductSelection>>({})

  const [name, setName] = useState('')
  const [company, setCompany] = useState('')

  const [saved, setSaved] = useState(false)
  const [showAllProducts, setShowAllProducts] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [showInquiry, setShowInquiry] = useState(false)

  useEffect(() => {
    // Load saved workspace data
    try {
      const shortlist = JSON.parse(
        localStorage.getItem(SAVED_KEY) ?? '[]'
      )

      const profile = JSON.parse(
        localStorage.getItem(PROFILE_KEY) ?? '{}'
      )

      const selections = JSON.parse(
        localStorage.getItem(SELECTIONS_KEY) ?? '{}'
      )

      if (Array.isArray(shortlist)) {
        setSavedProducts(shortlist)
      }

      if (typeof profile.name === 'string') {
        setName(profile.name)
      }

      if (typeof profile.company === 'string') {
        setCompany(profile.company)
      }

      if (
        selections &&
        typeof selections === 'object' &&
        !Array.isArray(selections)
      ) {
        setProductSelections(selections)
      }
    } catch {
      // Ignore invalid localStorage data
    }

    // Load products ONLY from database
    const apiUrl = getApiUrl()

    fetch(`${apiUrl}/products`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load products')
        }

        return response.json()
      })
      .then(
        (
          remoteProducts: Array<{
            id?: number
            articleNumber?: string
            name?: string
            material?: string
            audience?: string
            description?: string
            imageUrl?: string
            sizes?: string[] | string | null
            colors?: string[] | string | null
          }>
        ) => {
          const mappedProducts: Product[] = remoteProducts
            .filter(
              (product) =>
                product.articleNumber &&
                product.name
            )
            .map((product) => ({
              id: product.articleNumber as string,
              name: product.name as string,
              detail: product.material ?? '',
              audience: product.audience ?? '',
              imageUrl: product.imageUrl,
              description: product.description ?? '',
              colors: normalizeOptions(product.colors),
              sizes: normalizeOptions(product.sizes),
            }))

          setProducts(mappedProducts)
        }
      )
      .catch((error) => {
        console.error(
          'Failed to load products:',
          error
        )

        // No hard-coded products.
        setProducts([])
      })
      .finally(() => {
        setLoadingProducts(false)
      })
  }, [])

  function toggleSaved(id: string) {
    setSavedProducts((current) => {
      const next = current.includes(id)
        ? current.filter(
            (productId) => productId !== id
          )
        : [...current, id]

      localStorage.setItem(
        SAVED_KEY,
        JSON.stringify(next)
      )

      return next
    })
  }

  function toggleSelected(id: string) {
    setSelectedProducts((current) =>
      current.includes(id)
        ? current.filter(
            (productId) => productId !== id
          )
        : [...current, id]
    )
  }

  function getSelection(
    id: string
  ): ProductSelection {
    return (
      productSelections[id] ?? {
        colors: [],
        sizes: [],
      }
    )
  }

  function toggleOption(
    productId: string,
    type: 'colors' | 'sizes',
    value: string
  ) {
    setProductSelections((current) => {
      const currentSelection =
        current[productId] ?? {
          colors: [],
          sizes: [],
        }

      const currentValues =
        currentSelection[type]

      const nextValues =
        currentValues.includes(value)
          ? currentValues.filter(
              (item) => item !== value
            )
          : [...currentValues, value]

      const next = {
        ...current,
        [productId]: {
          ...currentSelection,
          [type]: nextValues,
        },
      }

      localStorage.setItem(
        SELECTIONS_KEY,
        JSON.stringify(next)
      )

      return next
    })
  }

  function saveWorkspace() {
    localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify({
        name,
        company,
      })
    )

    localStorage.setItem(
      SAVED_KEY,
      JSON.stringify(savedProducts)
    )

    localStorage.setItem(
      SELECTIONS_KEY,
      JSON.stringify(productSelections)
    )

    setSaved(true)

    window.setTimeout(() => {
      setSaved(false)
    }, 2500)
  }

  function startEnquiry() {
    const enquiryProductIds =
      selectedProducts.length > 0
        ? selectedProducts
        : savedProducts

    const chosen = products.filter(
      (product) =>
        enquiryProductIds.includes(product.id)
    )

    if (chosen.length === 0) {
      return
    }

    setShowInquiry(true)

    window.dispatchEvent(
      new CustomEvent('hide-design-enquiry', {
        detail: {
          name,
          company,

          // Existing product names
          products: chosen.map(
            (product) => product.name
          ),

          // Product-wise colors and sizes
          productDetails: chosen.map(
            (product) => ({
              id: product.id,
              name: product.name,
              colors:
                getSelection(product.id).colors,
              sizes:
                getSelection(product.id).sizes,
            })
          ),
        },
      })
    )

    window.setTimeout(() => {
      document
        .querySelector('#product-inquiry')
        ?.scrollIntoView({
          behavior: 'smooth',
        })
    }, 0)
  }

  const enquiryProducts = products.filter((product) =>
    (selectedProducts.length > 0 ? selectedProducts : savedProducts).includes(product.id)
  )

  return (
    <section
      className="account-section"
      id="account"
    >
      <div className="container">

        {/* ---------- HEADING ---------- */}

        <div className="account-heading">
          <div>
            <span className="eyebrow">
              PRIVATE CLIENT DESK
            </span>

            <h2>
              Your product <em>workspace.</em>
            </h2>
          </div>

          <span className="account-status">
            <Check size={14} />
            Private workspace preview
          </span>
        </div>

        <div className="account-layout">

          {/* ---------- PROFILE ---------- */}

          <aside className="account-profile">

            <div className="account-avatar">
              <UserRound size={24} />
            </div>

            <span className="account-kicker">
              CLIENT PROFILE
            </span>

            <h3>
              Build your next collection.
            </h3>

            <p>
              Save pieces, add your details, and
              send one clear product enquiry to
              the atelier.
            </p>

            <label>
              Your name

              <input
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
              />
            </label>

            <label>
              Company or studio

              <input
                value={company}
                onChange={(event) =>
                  setCompany(event.target.value)
                }
              />
            </label>

            <button
              className="btn btn-gold"
              type="button"
              onClick={startEnquiry}
            >
              Start an enquiry
              <ArrowUpRight size={16} />
            </button>

            {enquiryProducts.length > 0 && (
              <p className="account-profile-hint">
                {selectedProducts.length > 0
                  ? 'Your selected products are ready for a custom sample brief.'
                  : 'Your saved products are ready for a custom sample brief.'}
              </p>
            )}

          </aside>

          {/* ---------- MAIN ---------- */}

          <div className="account-main">

            {/* ---------- SUMMARY ---------- */}

            <div className="account-summary">

              <div>
                <strong>
                  {savedProducts.length}
                </strong>

                <span>
                  Saved products
                </span>
              </div>

              <div>
                <strong>
                  {selectedProducts.length}
                </strong>

                <span>
                  In enquiry
                </span>
              </div>

              <div>
                <strong>
                  48h
                </strong>

                <span>
                  Typical response
                </span>
              </div>

            </div>

            {/* ---------- PRODUCTS HEADER ---------- */}

            <div className="account-products-header">

              <div>
                <span className="account-kicker">
                  YOUR SHORTLIST
                </span>

                <h3>
                  Product details to review
                </h3>
              </div>

              <span className="account-note">
                Save a piece, then add it to your
                enquiry.
              </span>

            </div>

            {/* ---------- PRODUCTS ---------- */}

            <div className="account-products">

              {loadingProducts ? (

                <div className="account-product">
                  <div>
                    <p>
                      Loading products...
                    </p>
                  </div>
                </div>

              ) : products.length === 0 ? (

                <div className="account-product">
                  <div>
                    <h4>
                      No products available
                    </h4>

                    <p>
                      Products could not be loaded
                      from the database.
                    </p>
                  </div>
                </div>

              ) : (

                (
                  showAllProducts
                    ? products
                    : products.slice(0, 4)
                ).map((product) => {

                  const isSaved =
                    savedProducts.includes(
                      product.id
                    )

                  const isSelected =
                    selectedProducts.includes(
                      product.id
                    )

                  return (
                    <article
                      className={`account-product ${
                        isSaved
                          ? 'is-saved'
                          : ''
                      }`}
                      key={product.id}
                    >

                      {/* ---------- PRODUCT INFO ---------- */}

                      <div>

                        <span className="product-id">
                          {product.id}
                        </span>

                        <h4>
                          {product.name}
                        </h4>

                        <p>
                          {product.detail}
                        </p>

                        <small>
                          {product.audience}
                        </small>

                      </div>

                      {/* ---------- ACTIONS ---------- */}

                      <div className="account-product-actions">

                        {/* HEART */}

                        <button
                          className="save-product"
                          type="button"
                          onClick={() =>
                            toggleSaved(
                              product.id
                            )
                          }
                          aria-label={`${
                            isSaved
                              ? 'Remove'
                              : 'Save'
                          } ${product.name}`}
                          title={`${
                            isSaved
                              ? 'Remove from'
                              : 'Save to'
                          } shortlist`}
                        >

                          <Heart
                            size={17}
                            fill={
                              isSaved
                                ? 'currentColor'
                                : 'none'
                            }
                          />

                        </button>

                        {/* ADD TO ENQUIRY */}

                        <button
                          className="account-select"
                          type="button"
                          onClick={() =>
                            toggleSelected(
                              product.id
                            )
                          }
                        >
                          {isSelected
                            ? 'Added'
                            : 'Add to enquiry'}
                        </button>

                      </div>

                    </article>
                  )
                })

              )}

            </div>

            {/* ---------- SEE MORE ---------- */}

            {products.length > 4 && (
              <button
                className="account-see-more"
                type="button"
                onClick={() =>
                  setShowAllProducts(
                    (current) => !current
                  )
                }
              >
                {showAllProducts
                  ? 'Show Less'
                  : 'See More'}

                <ArrowUpRight size={16} />
              </button>
            )}

            {/* ---------- SAVE WORKSPACE ---------- */}

            <button
              className="account-save"
              type="button"
              onClick={saveWorkspace}
            >
              {saved
                ? 'Workspace saved'
                : 'Save workspace'}

              <ArrowUpRight size={16} />
            </button>

            {showInquiry && enquiryProducts.length > 0 && (
              <div id="product-inquiry" className="account-inquiry-shell">
                <ProductInquiryForm
                  products={enquiryProducts}
                  initialProductId={enquiryProducts[0]?.id}
                  clientName={name}
                  company={company}
                />
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  )
}

