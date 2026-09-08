'use client'

import { FormEvent, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getApiUrl } from '../api-config'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Product {
  id: number
  articleNumber: string
  name: string
  category: string
  audience: string
  sizes: string[]
  colors: string[]
  material: string
  description: string
  price: number | null
  currency: string
  imageUrl: string
  published: boolean
}

const emptyProduct: Omit<Product, 'id'> = {
  articleNumber: '',
  name: '',
  category: 'jackets',
  audience: 'men',
  sizes: [],
  colors: [],
  material: '',
  description: '',
  price: null,
  currency: 'USD',
  imageUrl: '',
  published: true,
}

const CLOUD_NAME = 'gmqcr7ae'
const UPLOAD_PRESET = 'hide_design_uploads'

interface AdminPanelProps {
  initialEditId?: number | null
}

/* ---------- HELPERS ---------- */

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

function optionsToText(
  value: string[] | undefined
): string {
  return Array.isArray(value)
    ? value.join(', ')
    : ''
}

/* ---------- COMPONENT ---------- */

export default function AdminPanel({
  initialEditId,
}: AdminPanelProps) {
  const apiUrl = getApiUrl()
  const router = useRouter()

  // ---------- LOADING STATES ----------
  const [loginLoading, setLoginLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] =
    useState<number | null>(null)

  // ---------- MAIN STATES ----------
  const [token, setToken] = useState('')

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  })

  const [products, setProducts] = useState<Product[]>([])

  const [form, setForm] = useState<Omit<Product, 'id'>>(
    emptyProduct
  )

  const [editingId, setEditingId] =
    useState<number | null>(
      initialEditId ?? null
    )

  const [uploading, setUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // ---------- LOAD PRODUCTS ----------
  async function loadProducts(accessToken: string) {
    try {
      const response = await fetch(
        `${apiUrl}/products/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (response.status === 401) {
        localStorage.removeItem('admin_token')
        setToken('')

        toast.error(
          'Your session has expired. Please login again.'
        )

        router.push('/admin')
        return
      }

      if (!response.ok) {
        throw new Error('Could not load articles')
      }

      const loadedProducts =
        await response.json()

      const normalizedProducts: Product[] =
        loadedProducts.map(
          (product: Product) => ({
            ...product,

            sizes: normalizeOptions(
              product.sizes
            ),

            colors: normalizeOptions(
              product.colors
            ),
          })
        )

      setProducts(normalizedProducts)
    } catch (error) {
      console.error(
        'Error loading products:',
        error
      )

      toast.error(
        'Could not load articles.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  // ---------- CHECK SAVED LOGIN ----------
  useEffect(() => {
    const savedToken =
      localStorage.getItem('admin_token')

    if (savedToken) {
      setToken(savedToken)
      loadProducts(savedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  // ---------- OPEN INITIAL EDIT ----------
  useEffect(() => {
    if (
      token &&
      products.length > 0 &&
      initialEditId
    ) {
      const productToEdit =
        products.find(
          (product) =>
            product.id === initialEditId
        )

      if (productToEdit) {
        setEditingId(productToEdit.id)

        setForm({
          articleNumber:
            productToEdit.articleNumber,

          name:
            productToEdit.name,

          category:
            productToEdit.category,

          audience:
            productToEdit.audience,

          sizes:
            normalizeOptions(
              productToEdit.sizes
            ),

          colors:
            normalizeOptions(
              productToEdit.colors
            ),

          material:
            productToEdit.material,

          description:
            productToEdit.description,

          price:
            productToEdit.price,

          currency:
            productToEdit.currency,

          imageUrl:
            productToEdit.imageUrl,

          published:
            productToEdit.published,
        })
      }
    }
  }, [
    initialEditId,
    token,
    products,
  ])

  // ---------- IMAGE UPLOAD ----------
  async function uploadImage(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0]

    if (!file) return

    setUploading(true)

    const data = new FormData()

    data.append('file', file)
    data.append(
      'upload_preset',
      UPLOAD_PRESET
    )
    data.append(
      'cloud_name',
      CLOUD_NAME
    )

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: data,
        }
      )

      const result =
        await response.json()

      if (result.secure_url) {
        setForm((previousForm) => ({
          ...previousForm,
          imageUrl:
            result.secure_url,
        }))

        toast.success(
          'Image uploaded successfully!'
        )
      } else {
        toast.error(
          'Cloudinary error: ' +
            (
              result.error?.message ||
              'Unknown error'
            )
        )
      }
    } catch (error) {
      console.error(
        'Image upload error:',
        error
      )

      toast.error(
        'Image upload failed. Please check your Cloudinary details.'
      )
    } finally {
      setUploading(false)
    }
  }

  // ---------- LOGIN ----------
  async function login(
    event: FormEvent
  ) {
    event.preventDefault()

    setLoginLoading(true)

    try {
      const response = await fetch(
        `${apiUrl}/auth/login`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify(
            credentials
          ),
        }
      )

      if (!response.ok) {
        toast.error(
          'Invalid admin credentials.'
        )

        return
      }

      const result =
        await response.json()

      localStorage.setItem(
        'admin_token',
        result.accessToken
      )

      setToken(
        result.accessToken
      )

      toast.success(
        'Login successful!'
      )

      setIsLoading(true)

      await loadProducts(
        result.accessToken
      )
    } catch (error) {
      console.error(
        'Login error:',
        error
      )

      toast.error(
        'Unable to login. Please try again.'
      )
    } finally {
      setLoginLoading(false)
    }
  }

  // ---------- SIGN OUT ----------
  const handleSignOut =
    useCallback(() => {
      localStorage.removeItem(
        'admin_token'
      )

      setToken('')
      setProducts([])
      setEditingId(null)
      setForm(emptyProduct)

      toast.success(
        'Signed out successfully.'
      )

      router.push('/admin')
    }, [router])

  // ---------- AUTO SIGN OUT ----------
  useEffect(() => {
    if (!token) return

    let timeoutId =
      window.setTimeout(
        handleSignOut,
        5 * 60 * 1000
      )

    const resetInactivityTimer =
      () => {
        window.clearTimeout(
          timeoutId
        )

        timeoutId =
          window.setTimeout(
            handleSignOut,
            5 * 60 * 1000
          )
      }

    const activityEvents = [
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
    ]

    activityEvents.forEach(
      (eventName) => {
        window.addEventListener(
          eventName,
          resetInactivityTimer
        )
      }
    )

    return () => {
      window.clearTimeout(
        timeoutId
      )

      activityEvents.forEach(
        (eventName) => {
          window.removeEventListener(
            eventName,
            resetInactivityTimer
          )
        }
      )
    }
  }, [
    handleSignOut,
    token,
  ])

  // ---------- SAVE / UPDATE ----------
  async function saveProduct(
    event: FormEvent
  ) {
    event.preventDefault()

    if (!form.imageUrl.trim()) {
      toast.error(
        'Please upload a product image before saving.'
      )

      return
    }

    if (form.sizes.length === 0) {
      toast.error(
        'Please enter at least one size.'
      )

      return
    }

    if (form.colors.length === 0) {
      toast.error(
        'Please enter at least one color.'
      )

      return
    }

    setSaving(true)

    try {
      const productToSave = {
        ...form,

        sizes:
          normalizeOptions(
            form.sizes
          ),

        colors:
          normalizeOptions(
            form.colors
          ),

        price:
          form.price === null
            ? null
            : Number(form.price),
      }

      const endpoint = editingId
        ? `${apiUrl}/products/${editingId}`
        : `${apiUrl}/products`

      const response = await fetch(
        endpoint,
        {
          method:
            editingId
              ? 'PATCH'
              : 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(
            productToSave
          ),
        }
      )

      if (!response.ok) {
        const errorBody =
          await response
            .json()
            .catch(() => null)

        const validationMessage =
          Array.isArray(
            errorBody?.message
          )
            ? errorBody.message.join(
                ', '
              )
            : errorBody?.message

        toast.error(
          validationMessage ||
            'Article could not be saved.'
        )

        return
      }

      if (editingId) {
        toast.success(
          'Article updated successfully!'
        )
      } else {
        toast.success(
          'Article uploaded successfully!'
        )
      }

      setEditingId(null)
      setForm(emptyProduct)

      await loadProducts(token)
    } catch (error) {
      console.error(
        'Save product error:',
        error
      )

      toast.error(
        'Something went wrong while saving the article.'
      )
    } finally {
      setSaving(false)
    }
  }

  // ---------- DELETE ----------
  async function removeProduct(
    id: number
  ) {
    if (
      !window.confirm(
        'Delete this article?'
      )
    ) {
      return
    }

    setDeletingId(id)

    try {
      const response =
        await fetch(
          `${apiUrl}/products/${id}`,
          {
            method: 'DELETE',

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        )

      if (!response.ok) {
        toast.error(
          'Article could not be deleted.'
        )

        return
      }

      toast.success(
        'Article deleted successfully!'
      )

      await loadProducts(token)
    } catch (error) {
      console.error(
        'Delete error:',
        error
      )

      toast.error(
        'Something went wrong while deleting the article.'
      )
    } finally {
      setDeletingId(null)
    }
  }

  // ---------- LOGIN SCREEN ----------
  if (!token) {
    return (
      <main className="admin-shell">
        <form
          className="admin-login"
          onSubmit={login}
        >
          <span className="eyebrow">
            HIDE DESIGN · ADMIN
          </span>

          <h1>
            Article portal
          </h1>

          <input
            type="email"
            placeholder="Admin email"
            required
            value={
              credentials.email
            }
            onChange={(event) =>
              setCredentials({
                ...credentials,
                email:
                  event.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={
              credentials.password
            }
            onChange={(event) =>
              setCredentials({
                ...credentials,
                password:
                  event.target.value,
              })
            }
          />

          <button
            className="btn btn-gold"
            type="submit"
            disabled={loginLoading}
          >
            {loginLoading ? (
              <>
                <span className="admin-spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </main>
    )
  }

  // ---------- ADMIN PANEL ----------
  return (
    <main className="admin-shell">

      {/* HEADER */}
      <div className="admin-header">
        <div>
          <span className="eyebrow">
            HIDE DESIGN · ADMIN
          </span>

          <h1>
            Article portal
          </h1>

          <p className="admin-intro">
            Upload and curate product
            articles for the public
            catalogue.
          </p>
        </div>

        <button
          className="btn btn-gold"
          onClick={
            handleSignOut
          }
        >
          Sign out
        </button>
      </div>

      <div className="admin-grid">

        {/* PRODUCT FORM */}
        <form
          className="admin-form"
          onSubmit={
            saveProduct
          }
        >
          <h2>
            {editingId
              ? 'Edit article'
              : 'New article'}
          </h2>

          {/* ARTICLE NUMBER */}
          <label>
            Article Number

            <input
              type="text"
              value={
                form.articleNumber
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  articleNumber:
                    e.target.value,
                })
              }
              required
            />
          </label>

          {/* PRODUCT NAME */}
          <label>
            Product Name

            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name:
                    e.target.value,
                })
              }
              required
            />
          </label>

          {/* PRICE */}
          <label>
            Price (e.g., 250)

            <input
              type="number"
              value={
                form.price ?? ''
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  price:
                    e.target.value
                      ? Number(
                          e.target.value
                        )
                      : null,
                })
              }
            />
          </label>

          {/* CATEGORY */}
          <label>
            Category

            <select
              value={
                form.category
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  category:
                    e.target.value,
                })
              }
            >
              <option value="jackets">
                Jackets
              </option>

              <option value="coats">
                Coats
              </option>
            </select>
          </label>

          {/* AUDIENCE */}
          <label>
            Audience

            <select
              value={
                form.audience
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  audience:
                    e.target.value,
                })
              }
            >
              <option value="men">
                Men
              </option>

              <option value="women">
                Women
              </option>
            </select>
          </label>

          {/* MULTIPLE SIZES */}
          <label>
            Sizes

            <input
              type="text"
              value={optionsToText(
                form.sizes
              )}
              onChange={(e) =>
                setForm({
                  ...form,
                  sizes:
                    normalizeOptions(
                      e.target.value
                    ),
                })
              }
              placeholder="e.g. S, M, L, XL"
              required
            />

            <small>
              Enter multiple sizes separated
              by commas.
            </small>
          </label>

          {/* MULTIPLE COLORS */}
          <label>
            Colors

            <input
              type="text"
              value={optionsToText(
                form.colors
              )}
              onChange={(e) =>
                setForm({
                  ...form,
                  colors:
                    normalizeOptions(
                      e.target.value
                    ),
                })
              }
              placeholder="e.g. BLK, BRN, TAN"
              required
            />

            <small>
              Enter multiple colors separated
              by commas.
            </small>
          </label>

          {/* MATERIAL */}
          <label>
            Material

            <input
              type="text"
              value={
                form.material
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  material:
                    e.target.value,
                })
              }
              required
            />
          </label>

          {/* DESCRIPTION */}
          <label>
            Description

            <textarea
              value={
                form.description
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value,
                })
              }
              required
            />
          </label>

          {/* IMAGE UPLOAD */}
          <label>
            Upload Image

            <input
              type="file"
              accept="image/*"
              required={
                !editingId
              }
              disabled={
                uploading ||
                saving
              }
              onChange={
                uploadImage
              }
            />

            {uploading && (
              <span className="admin-upload-status">
                <span className="admin-spinner"></span>
                Uploading to Cloudinary...
              </span>
            )}

            {form.imageUrl && (
              <img
                src={
                  form.imageUrl
                }
                alt="Preview"
                style={{
                  width: '100px',
                  height: 'auto',
                  marginTop:
                    '10px',
                }}
              />
            )}
          </label>

          {/* PUBLISHED */}
          <label className="admin-check">
            <input
              type="checkbox"
              checked={
                form.published
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  published:
                    e.target.checked,
                })
              }
            />

            Published
          </label>

          {/* SAVE */}
          <button
            className="btn btn-gold"
            type="submit"
            disabled={
              uploading ||
              saving
            }
          >
            {saving ? (
              <>
                <span className="admin-spinner"></span>

                {editingId
                  ? 'Saving changes...'
                  : 'Uploading article...'}
              </>
            ) : editingId ? (
              'Publish changes'
            ) : (
              'Upload article'
            )}
          </button>

          {/* CANCEL */}
          {editingId && (
            <button
              type="button"
              className="btn-quote"
              disabled={saving}
              onClick={() => {
                setEditingId(
                  null
                )

                setForm(
                  emptyProduct
                )

                toast.info(
                  'Editing cancelled.'
                )
              }}
            >
              Cancel
            </button>
          )}
        </form>

        {/* PRODUCT LIST */}
        <section className="admin-list">

          <div className="admin-list-header">
            <h2>
              Published and draft
              articles
            </h2>

            {products.length >
              5 && (
              <button
                className="btn-quote"
                onClick={() =>
                  router.push(
                    '/admin/all-products'
                  )
                }
              >
                Show More (
                {products.length}
                )
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="admin-loading">
              <span className="admin-spinner"></span>
              Loading articles...
            </div>
          ) : (
            products
              .slice(0, 5)
              .map((product) => (
                <article
                  className="admin-row"
                  key={product.id}
                >
                  <div className="admin-row-product">

                    {product.imageUrl && (
                      <img
                        src={
                          product.imageUrl
                        }
                        alt={
                          product.name
                        }
                        className="admin-row-image"
                      />
                    )}

                    <div className="admin-row-info">

                      <strong className="admin-row-article">
                        {
                          product.articleNumber
                        }
                      </strong>

                      <span className="admin-row-name">
                        {
                          product.name
                        }
                      </span>

                      <small className="admin-row-audience">
                        {
                          product.audience
                        }{' '}
                        ·{' '}
                        {product.price
                          ? `${product.currency} ${product.price}`
                          : 'No Price'}
                      </small>

                    </div>
                  </div>

                  <div className="admin-row-actions">

                    {/* VIEW */}
                    <Link
                      href={`/admin/${product.id}`}
                      className="btn-quote"
                      title="View full details"
                    >
                      View
                    </Link>

                    {/* EDIT */}
                    <button
                      className="btn btn-gold"
                      disabled={
                        saving ||
                        deletingId !==
                          null
                      }
                      onClick={() => {
                        setEditingId(
                          product.id
                        )

                        setForm({
                          articleNumber:
                            product.articleNumber,

                          name:
                            product.name,

                          category:
                            product.category,

                          audience:
                            product.audience,

                          sizes:
                            normalizeOptions(
                              product.sizes
                            ),

                          colors:
                            normalizeOptions(
                              product.colors
                            ),

                          material:
                            product.material,

                          description:
                            product.description,

                          price:
                            product.price,

                          currency:
                            product.currency,

                          imageUrl:
                            product.imageUrl,

                          published:
                            product.published,
                        })

                        toast.info(
                          `Editing ${product.name}`
                        )
                      }}
                    >
                      Edit
                    </button>

                    {/* DELETE */}
                    <button
                      className="admin-delete"
                      disabled={
                        deletingId ===
                          product.id ||
                        deletingId !==
                          null
                      }
                      onClick={() =>
                        removeProduct(
                          product.id
                        )
                      }
                    >
                      {deletingId ===
                      product.id ? (
                        <>
                          <span className="admin-spinner"></span>
                          Deleting...
                        </>
                      ) : (
                        'Delete'
                      )}
                    </button>

                  </div>
                </article>
              ))
          )}
        </section>
      </div>
    </main>
  )
}