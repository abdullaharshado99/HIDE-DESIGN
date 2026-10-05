"use client";

import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  FileText,
  Package,
  Palette,
  Ruler,
  Scissors,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const colors = [
  "Black",
  "Brown",
  "Gray",
  "Blue",
  "White",
  "Green",
  "Red",
  "Tan",
];

const fabricTypes = [
  "Goat Leather",
  "Buffalo Leather",
  "Sheep Leather",
  "Cow Leather",
  "Wool Tweed",
];

const fabricGsm = [
  "180 GSM",
  "220 GSM",
  "260 GSM",
  "300 GSM",
  "340 GSM",
  "400+ GSM",
  "None",
];

const fitStyles = [
  "Regular Fit",
  "Slim Fit",
  "Oversized Fit",
  "Relaxed Fit",
  "Cropped Fit",
  "Boxy Fit",
];

const labels = [
  "Company Label",
  "Custom Label",
];

const sizes = [
  "XXS",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "3XL",
];

const quantities = [
  "Sample",
  "10 Units",
  "20 Units",
  "30 Units",
  "50 Units",
  "100 Units",
];

const productCategories = [
  "Men's Jacket",
  "Women's Jacket",
  "Men's Coat",
  "Women's Coat",
  "Accessories",
];

interface Article {
  id?: string;
  articleNumber: string;
  name: string;
  category?: string;
  audience?: string;
  material?: string;
  description?: string;
  imageUrl?: string;
}

interface CartItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  articleNumber: string;
  articleName: string;
  productCategory: string;
  color: string;
  fabricType: string;
  gsm: string;
  fitStyle: string;
  label: string;
  sizes: string[];
  quantity: string;
  notes: string;
  fileName: string;
}

export default function CollectionPage() {
  const router = useRouter();

  /* =========================================================
     ARTICLES
  ========================================================= */

  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedArticle, setSelectedArticle] = useState("");

  /* =========================================================
     FORM STATES
  ========================================================= */

  const [selectedColor, setSelectedColor] = useState("");
  const [fabricType, setFabricType] = useState("");
  const [gsm, setGsm] = useState("");
  const [vintageEffect, setVintageEffect] = useState("");
  const [fitStyle, setFitStyle] = useState("");
  const [printingTechnique, setPrintingTechnique] = useState("");
  const [rhinestone, setRhinestone] = useState("");
  const [label, setLabel] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [quantity, setQuantity] = useState("");
  const [customQuantity, setCustomQuantity] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [notes, setNotes] = useState("");

  /* =========================================================
     SUBMISSION
  ========================================================= */

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  /* =========================================================
     CART
  ========================================================= */

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  /* =========================================================
     LOAD ARTICLES FROM DATABASE
  ========================================================= */

  useEffect(() => {
    const loadArticles = async () => {
      setLoadingArticles(true);

      try {
        const response = await fetch(`${API_URL}/products`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Failed to load products (${response.status})`,
          );
        }

        const data = await response.json();

        const productList = Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
            ? data.products
            : [];

        setArticles(productList);
      } catch (error) {
        console.error("Failed to load articles:", error);
        setArticles([]);
      } finally {
        setLoadingArticles(false);
      }
    };

    loadArticles();
  }, []);

  /* =========================================================
     FILTER ARTICLES BY SELECTED CATEGORY
  ========================================================= */

  const filteredArticles = useMemo(() => {
    if (!selectedProduct) {
      return [];
    }

    return articles.filter((article) => {
      const audience = String(article.audience || "")
        .trim()
        .toLowerCase();

      const articleCategory = String(article.category || "")
        .trim()
        .toLowerCase();

      if (selectedProduct === "Men's Jacket") {
        return (
          audience === "men" &&
          (
            articleCategory === "jacket" ||
            articleCategory === "jackets"
          )
        );
      }

      if (selectedProduct === "Women's Jacket") {
        return (
          audience === "women" &&
          (
            articleCategory === "jacket" ||
            articleCategory === "jackets"
          )
        );
      }

      if (selectedProduct === "Men's Coat") {
        return (
          audience === "men" &&
          (
            articleCategory === "coat" ||
            articleCategory === "coats" ||
            articleCategory === "long coat" ||
            articleCategory === "long coats"
          )
        );
      }

      if (selectedProduct === "Women's Coat") {
        return (
          audience === "women" &&
          (
            articleCategory === "coat" ||
            articleCategory === "coats" ||
            articleCategory === "long coat" ||
            articleCategory === "long coats"
          )
        );
      }

      if (selectedProduct === "Accessories") {
        return (
          articleCategory === "accessory" ||
          articleCategory === "accessories"
        );
      }

      return false;
    });
  }, [articles, selectedProduct]);

  /* =========================================================
     FINAL QUANTITY
  ========================================================= */

  const finalQuantity = customQuantity.trim()
    ? `${customQuantity.trim()} Units`
    : quantity;

  /* =========================================================
     SELECTED ARTICLE DATA
  ========================================================= */

  const selectedArticleData =
    articles.find(
      (article) =>
        article.articleNumber === selectedArticle,
    ) || null;

  /* =========================================================
     TOGGLE SIZE
  ========================================================= */

  const toggleSize = (size: string) => {
    setSelectedSizes((current) =>
      current.includes(size)
        ? current.filter((item) => item !== size)
        : [...current, size],
    );
  };

  /* =========================================================
     PRODUCT CATEGORY SELECT
  ========================================================= */

  const handleProductCategory = (item: string) => {
    setSelectedProduct(item);
    setSelectedArticle("");
    setSubmitError("");
  };

  /* =========================================================
     PRESET QUANTITY
  ========================================================= */

  const handlePresetQuantity = (item: string) => {
    setQuantity(item);
    setCustomQuantity("");
  };

  /* =========================================================
     CUSTOM QUANTITY
  ========================================================= */

  const handleCustomQuantity = (value: string) => {
    const cleanedValue = value.replace(/\D/g, "");

    setCustomQuantity(cleanedValue);

    if (cleanedValue) {
      setQuantity("");
    }
  };

  /* =========================================================
     RESET FORM AFTER ADD TO CART
  ========================================================= */

  const resetForm = () => {
    setSelectedProduct("");
    setSelectedArticle("");
    setSelectedColor("");
    setFabricType("");
    setGsm("");
    setVintageEffect("");
    setFitStyle("");
    setPrintingTechnique("");
    setRhinestone("");
    setLabel("");
    setSelectedSizes([]);
    setQuantity("");
    setCustomQuantity("");
    setFile(null);
    setName("");
    setPhone("");
    setEmail("");
    setNotes("");
    setSubmitError("");
  };

  /* =========================================================
     ADD TO CART / SUBMIT INQUIRY
  ========================================================= */

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    setSubmitError("");

    if (!selectedProduct) {
      setSubmitError(
        "Please select a product category first.",
      );
      return;
    }

    if (!selectedArticle) {
      setSubmitError(
        "Please select an article first.",
      );
      return;
    }

    if (!finalQuantity) {
      setSubmitError(
        "Please select or enter a quantity.",
      );
      return;
    }

    if (!selectedArticleData) {
      setSubmitError(
        "Selected article could not be found.",
      );
      return;
    }

    setSubmitting(true);

    try {
      const inquiryData = {
        name,
        phone,
        email,

        category: selectedProduct,

        productCategory: selectedProduct,

        productDetail: selectedArticleData.name,

        articleNumber:
          selectedArticleData.articleNumber,

        articleName:
          selectedArticleData.name,

        color: selectedColor,

        fabricType,

        gsm,

        vintageEffect,

        fitStyle,

        printingTechnique,

        rhinestone,

        label,

        sizes: selectedSizes,

        quantity: finalQuantity,

        fileName: file?.name || "",

        notes,
      };

      console.log(
        "Sending inquiry:",
        inquiryData,
      );

      const response = await fetch(
        `${API_URL}/inquiries`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(inquiryData),
        },
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        console.error(
          "Inquiry API error:",
          errorText,
        );

        throw new Error(
          `Failed to submit inquiry (${response.status})`,
        );
      }

      const savedInquiry =
        await response.json();

      console.log(
        "Inquiry saved successfully:",
        savedInquiry,
      );

      /* -----------------------------------------
         ADD COMPLETED ARTICLE TO CART
      ----------------------------------------- */

      const cartItem: CartItem = {
        id: `${selectedArticle}-${Date.now()}`,

        name,
        phone,
        email,

        articleNumber:
          selectedArticleData.articleNumber,

        articleName:
          selectedArticleData.name,

        productCategory:
          selectedProduct,

        color: selectedColor,

        fabricType,

        gsm,

        fitStyle,

        label,

        sizes: [...selectedSizes],

        quantity: finalQuantity,

        notes,

        fileName: file?.name || "",
      };

      setCartItems((current) => [
        ...current,
        cartItem,
      ]);

      /* -----------------------------------------
         RESET FORM
      ----------------------------------------- */

      resetForm();
    } catch (error) {
      console.error(
        "Inquiry submission failed:",
        error,
      );

      setSubmitError(
        "We could not add this article to your cart. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     REMOVE CART ITEM
  ========================================================= */

  const removeCartItem = (id: string) => {
    setCartItems((current) =>
      current.filter(
        (item) => item.id !== id,
      ),
    );
  };

  return (
    <main className="inquiry-page">
      <div className="inquiry-shell">

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <button
          type="button"
          className="inquiry-back"
          onClick={() => router.back()}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* =================================================
            HERO
        ================================================= */}

        <header className="inquiry-hero">
          <span className="eyebrow">
            CUSTOM SAMPLE ORDER
          </span>

          <h1>
            Tell Us About
            <em> Your Design.</em>
          </h1>

          <p>
            Share your product requirements
            below and our team will use these
            details to understand your sample
            request.
          </p>

          <div className="inquiry-category">
            <span>
              HIDE DESIGN
            </span>

            <strong>
              CUSTOM OUTERWEAR
            </strong>
          </div>
        </header>

        {/* =================================================
            MAIN TWO COLUMN AREA
        ================================================= */}

        <div className="inquiry-layout">

          {/* =================================================
              LEFT FORM
          ================================================= */}

          <form
            className="inquiry-form"
            onSubmit={handleSubmit}
          >

            {/* =================================================
                01 PRODUCT
            ================================================= */}

            <section className="inquiry-section">

              <div className="inquiry-section-head">
                <div>

                  <span className="eyebrow">
                   PRODUCT DETAILS
                  </span>

                  <h2>
                    Choose Your Product
                  </h2>

                  <p>
                    Select a product category
                    to view available articles.
                  </p>

                </div>
              </div>

              {/* FIVE CATEGORY CARDS */}

              <div className="inquiry-product-category-grid">

                {productCategories.map(
                  (item) => (
                    <button
                      type="button"
                      key={item}
                      className={`inquiry-product-category ${
                        selectedProduct === item
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        handleProductCategory(
                          item,
                        )
                      }
                    >
                      {selectedProduct ===
                        item && (
                        <Check size={13} />
                      )}

                      <span>
                        {item}
                      </span>
                    </button>
                  ),
                )}

              </div>

              {/* ARTICLES */}

              {selectedProduct && (
                <div className="inquiry-articles-area">

                  <div className="inquiry-articles-heading">

                    <span className="eyebrow">
                      AVAILABLE ARTICLES
                    </span>

                    <h3>
                      {selectedProduct}
                    </h3>

                  </div>

                  {loadingArticles ? (
                    <div className="inquiry-article-message">
                      Loading articles...
                    </div>
                  ) : filteredArticles.length >
                    0 ? (
                    <div className="inquiry-article-grid">

                      {filteredArticles.map(
                        (article) => (
                          <button
                            type="button"
                            key={
                              article.articleNumber
                            }
                            className={`inquiry-article-card ${
                              selectedArticle ===
                              article.articleNumber
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              setSelectedArticle(
                                article.articleNumber,
                              )
                            }
                          >

                            <div className="inquiry-article-content">

                              <span className="inquiry-article-number">
                                {
                                  article.articleNumber
                                }
                              </span>

                              <strong>
                                {article.name}
                              </strong>

                              {article.material && (
                                <span className="inquiry-article-material">
                                  {
                                    article.material
                                  }
                                </span>
                              )}

                            </div>

                            <span className="inquiry-article-check">

                              {selectedArticle ===
                              article.articleNumber ? (
                                <Check
                                  size={13}
                                />
                              ) : null}

                            </span>

                          </button>
                        ),
                      )}

                    </div>
                  ) : (
                    <div className="inquiry-article-message">
                      No articles are available
                      for this category yet.
                    </div>
                  )}

                </div>
              )}

            </section>

            {/* =================================================
                02 COLOR
            ================================================= */}

            <section className="inquiry-section">

              <div className="inquiry-section-head">

                <div>

                  <span className="eyebrow">
                  COLOR
                  </span>

                  <h2>
                    Select Your Color
                  </h2>

                  <p>
                    Choose your preferred base
                    color.
                  </p>

                </div>

              </div>

              <div className="inquiry-color-grid">

                {colors.map(
                  (color) => (
                    <button
                      type="button"
                      key={color}
                      className={`inquiry-color ${
                        selectedColor === color
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedColor(
                          color,
                        )
                      }
                    >

                      {selectedColor ===
                        color && (
                        <Check size={13} />
                      )}

                      <span>
                        {color}
                      </span>

                    </button>
                  ),
                )}

              </div>

            </section>

            {/* =================================================
                03 FABRIC
            ================================================= */}

            <section className="inquiry-section">

              <div className="inquiry-section-head">

                <div>

                  <span className="eyebrow">
                 FABRIC & FINISH
                  </span>

                  <h2>
                    Material Specifications
                  </h2>

                  <p>
                    Define the material and
                    construction requirements.
                  </p>

                </div>

              </div>

              <div className="inquiry-spec-grid">

                <label className="inquiry-field">

                  <span>
                    Fabric Type
                  </span>

                  <select
                    value={fabricType}
                    onChange={(e) =>
                      setFabricType(
                        e.target.value,
                      )
                    }
                  >

                    <option value="">
                      Select fabric type
                    </option>

                    {fabricTypes.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      ),
                    )}

                  </select>

                </label>

                <label className="inquiry-field">

                  <span>
                    Fabric GSM
                  </span>

                  <select
                    value={gsm}
                    onChange={(e) =>
                      setGsm(
                        e.target.value,
                      )
                    }
                  >

                    <option value="">
                      Select GSM
                    </option>

                    {fabricGsm.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      ),
                    )}

                  </select>

                </label>

                <label className="inquiry-field">

                  <span>
                    Fit Style
                  </span>

                  <select
                    value={fitStyle}
                    onChange={(e) =>
                      setFitStyle(
                        e.target.value,
                      )
                    }
                  >

                    <option value="">
                      Select fit
                    </option>

                    {fitStyles.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      ),
                    )}

                  </select>

                </label>

              </div>

            </section>

            {/* =================================================
                04 CUSTOMIZATION
            ================================================= */}

            <section className="inquiry-section">

              <div className="inquiry-section-head">

                <div>

                  <span className="eyebrow">
                   CUSTOMIZATION
                  </span>

                  <h2>
                    Branding & Details
                  </h2>

                  <p>
                    Add your branding and
                    customization preferences.
                  </p>

                </div>

              </div>

              <div className="inquiry-spec-grid">

                <label className="inquiry-field">

                  <span>
                    Labels & Branding
                  </span>

                  <select
                    value={label}
                    onChange={(e) =>
                      setLabel(
                        e.target.value,
                      )
                    }
                  >

                    <option value="">
                      Select label
                    </option>

                    {labels.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      ),
                    )}

                  </select>

                </label>

              </div>

            </section>

            {/* =================================================
                05 SIZES
            ================================================= */}

            <section className="inquiry-section">

              <div className="inquiry-section-head">

                <div>

                  <span className="eyebrow">
                  SIZING
                  </span>

                  <h2>
                    Select Sizes
                  </h2>

                  <p>
                    Select one or more sizes
                    for your sample or
                    production.
                  </p>

                </div>

              </div>

              <div className="inquiry-size-grid">

                {sizes.map(
                  (size) => (
                    <button
                      type="button"
                      key={size}
                      className={`inquiry-size ${
                        selectedSizes.includes(
                          size,
                        )
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        toggleSize(size)
                      }
                    >

                      {selectedSizes.includes(
                        size,
                      ) && (
                        <Check size={12} />
                      )}

                      <span>
                        {size}
                      </span>

                    </button>
                  ),
                )}

              </div>

            </section>

            {/* =================================================
                06 QUANTITY
            ================================================= */}

            <section className="inquiry-section">

              <div className="inquiry-section-head">

                <div>

                  <span className="eyebrow">
                   QUANTITY
                  </span>

                  <h2>
                    How Many Units?
                  </h2>

                  <p>
                    Select a preset quantity
                    or enter your own quantity.
                  </p>

                </div>

              </div>

              {/* PRESET QUANTITIES */}

              <div className="inquiry-quantity-grid">

                {quantities.map(
                  (item) => (
                    <button
                      type="button"
                      key={item}
                      className={`inquiry-quantity ${
                        quantity === item &&
                        !customQuantity
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        handlePresetQuantity(
                          item,
                        )
                      }
                    >

                      {quantity === item &&
                        !customQuantity && (
                          <Check size={13} />
                        )}

                      <span>
                        {item}
                      </span>

                    </button>
                  ),
                )}

              </div>

              {/* CUSTOM QUANTITY */}

              <div className="inquiry-custom-quantity">

                <label className="inquiry-field">

                  <span>
                    Custom Quantity
                  </span>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={customQuantity}
                    onChange={(e) =>
                      handleCustomQuantity(
                        e.target.value,
                      )
                    }
                    placeholder="Enter number of units"
                  />

                </label>

                <small>
                  Example: 250 → 250 Units
                </small>

              </div>

            </section>

            {/* =================================================
                07 ADDITIONAL INFORMATION
            ================================================= */}

            <section className="inquiry-section">
                  <div className="inquiry-section-head">

                    <div>
                      <span className="eyebrow">
                       CONTACT INFORMATION
                      </span>

                      <h2>
                        Your Contact Details
                      </h2>

                      <p>
                        Please provide your contact details so our
                        team can get back to you about your inquiry.
                      </p>

                    </div>

                  </div>

                  <div className="inquiry-spec-grid">

                    <label className="inquiry-field">
                      <span>
                        Name
                      </span>

                      <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                        placeholder="Enter your name"
                        required
                      />
                    </label>

                    <label className="inquiry-field">
                      <span>
                        Phone Number
                      </span>

                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) =>
                          setPhone(e.target.value)
                        }
                        placeholder="Enter your phone number"
                        required
                      />
                    </label>

                    <label className="inquiry-field">
                      <span>
                        Email
                      </span>

                      <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        placeholder="Enter your email address"
                        required
                      />
                    </label>

                  </div>
                </section>

                <section className="inquiry-section">

              <div className="inquiry-section-head">

                <div>

                  <span className="eyebrow">
                    ADDITIONAL INFORMATION
                  </span>

                  <h2>
                    Share Your Requirements
                  </h2>

                  <p>
                    Tell us anything else we
                    should know about your
                    requirements.
                  </p>

                </div>

              </div>

              <div className="inquiry-extra-grid">

                <label className="inquiry-field inquiry-notes-field">

                  <span>
                    Additional Notes
                  </span>

                  <textarea
                    value={notes}
                    onChange={(e) =>
                      setNotes(
                        e.target.value,
                      )
                    }
                    placeholder="Tell us about your design, finish, branding or any special requirements..."
                    rows={6}
                  />

                </label>

              </div>

            </section>

            {/* =================================================
                ERROR
            ================================================= */}

            {submitError && (
              <div className="inquiry-error">
                {submitError}
              </div>
            )}

            {/* =================================================
                ADD TO CART
            ================================================= */}

            <div className="inquiry-submit">

              <div>

                <span className="eyebrow">
                  ADD TO YOUR INQUIRY
                </span>

                <p>
                  Complete the details above
                  and add this article to your
                  inquiry cart.
                </p>

              </div>

              <button
                type="submit"
                className="btn btn-gold"
                disabled={submitting}
              >

                {submitting
                  ? "Adding..."
                  : "Add to Cart"}

                {!submitting && (
                  <ArrowUpRight
                    size={17}
                  />
                )}

              </button>

            </div>

          </form>

          {/* =================================================
              RIGHT SIDE CART
          ================================================= */}

          <aside className="inquiry-summary">

            <div className="summary-sticky">

              {/* CART HEADER */}

              <div className="summary-header">

                <div>

                  <span className="eyebrow">
                    YOUR CART
                  </span>

                  <h2>
                    Selected Articles
                  </h2>

                </div>

                <span className="summary-count">
                  {cartItems.length}
                </span>

              </div>

              {/* EMPTY CART */}

              {cartItems.length === 0 ? (

                <div className="summary-empty">

                  <div>
                    <Package size={22} />
                  </div>

                  <p>
                    Your selected articles
                    will appear here after
                    you add them to your cart.
                  </p>

                </div>

              ) : (

                /* =================================================
                   CART ITEMS
                ================================================= */

                <div className="inquiry-cart">

                  {cartItems.map(
                    (item, index) => (
                      <div
                        className="inquiry-cart-item"
                        key={item.id}
                      >

                        {/* ITEM HEADER */}

                        <div className="inquiry-cart-item-top">

                          <div>

                            <span className="inquiry-cart-number">
                              ARTICLE{" "}
                              {index + 1}
                            </span>

                            <h3>
                              {
                                item.articleName
                              }
                            </h3>

                            <span className="inquiry-cart-article">
                              {
                                item.articleNumber
                              }
                            </span>

                          </div>

                          <button
                            type="button"
                            className="inquiry-cart-remove"
                            onClick={() =>
                              removeCartItem(
                                item.id,
                              )
                            }
                            aria-label="Remove article"
                          >
                            <X size={14} />
                          </button>

                        </div>

                        {/* CATEGORY */}

                        <div className="inquiry-cart-category">
                          {
                            item.productCategory
                          }
                        </div>

                        {/* DETAILS */}

                        <div className="inquiry-cart-details">

                          {item.color && (
                            <div>

                              <span>
                                Color
                              </span>

                              <strong>
                                {
                                  item.color
                                }
                              </strong>

                            </div>
                          )}

                          {item.fabricType && (
                            <div>

                              <span>
                                Fabric
                              </span>

                              <strong>
                                {
                                  item.fabricType
                                }
                              </strong>

                            </div>
                          )}

                          {item.gsm && (
                            <div>

                              <span>
                                GSM
                              </span>

                              <strong>
                                {item.gsm}
                              </strong>

                            </div>
                          )}

                          {item.fitStyle && (
                            <div>

                              <span>
                                Fit
                              </span>

                              <strong>
                                {
                                  item.fitStyle
                                }
                              </strong>

                            </div>
                          )}

                          {item.label && (
                            <div>

                              <span>
                                Label
                              </span>

                              <strong>
                                {
                                  item.label
                                }
                              </strong>

                            </div>
                          )}

                          {item.sizes.length >
                            0 && (
                            <div className="inquiry-cart-full">

                              <span>
                                Sizes
                              </span>

                              <strong>
                                {item.sizes.join(
                                  ", ",
                                )}
                              </strong>

                            </div>
                          )}

                          <div className="inquiry-cart-full">

                            <span>
                              Quantity
                            </span>

                            <strong>
                              {
                                item.quantity
                              }
                            </strong>

                          </div>

                        </div>

                        {/* NOTES */}

                        {item.notes && (
                          <div className="inquiry-cart-notes">

                            <span>
                              Notes
                            </span>

                            <p>
                              {item.notes}
                            </p>

                          </div>
                        )}

                      </div>
                    ),
                  )}

                </div>
              )}

              {/* CART FOOTER */}

              <div className="summary-footer">

                <span>
                  HIDE DESIGN
                </span>

                <strong>
                  {cartItems.length}{" "}
                  {cartItems.length === 1
                    ? "ARTICLE"
                    : "ARTICLES"}
                </strong>

              </div>

            </div>

          </aside>

        </div>
      </div>
    </main>
  );
}