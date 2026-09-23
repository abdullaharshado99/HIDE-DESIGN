"use client";

import { ArrowLeft, ArrowUpRight, Upload } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const categoryData: Record<
  string,
  {
    title: string;
    gender: string;
    productType: string;
  }
> = {
  "mens-jacket": {
    title: "Men's Jacket",
    gender: "Men",
    productType: "Jacket",
  },

  "womens-jacket": {
    title: "Women's Jacket",
    gender: "Women",
    productType: "Jacket",
  },

  "mens-long-coat": {
    title: "Men's Long Coat",
    gender: "Men",
    productType: "Long Coat",
  },

  "womens-long-coat": {
    title: "Women's Long Coat",
    gender: "Women",
    productType: "Long Coat",
  },
};

const productDetails = [
  "Bomber Jacket",
  "Denim Jacket",
  "Puffer Jacket",
  "Varsity Jacket",
  "Windbreaker",
  "Parka",
];

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
  "Cotton",
  "Polyester",
  "Cotton-Poly Blend",
  "Leather",
  "Denim",
  "Fleece",
  "Nylon",
  "Wool",
];

const fabricGsm = [
  "180 GSM",
  "220 GSM",
  "260 GSM",
  "300 GSM",
  "340 GSM",
  "400+ GSM",
];

const vintageEffects = [
  "None",
  "Stone Wash",
  "Acid Wash",
  "Distressed",
  "Enzyme Wash",
  "Garment Dye",
];

const fitStyles = [
  "Regular Fit",
  "Slim Fit",
  "Oversized Fit",
  "Relaxed Fit",
  "Cropped Fit",
  "Boxy Fit",
];

const printingTechniques = [
  "Screen Print",
  "DTF Print",
  "Embroidery",
  "Sublimation",
  "Puff Print",
  "Heat Transfer",
];

const rhinestones = [
  "None",
  "Hotfix Rhinestones",
  "Crystal Studs",
  "Custom Rhinestone Design",
];

const labels = [
  "Woven Label",
  "Printed Label",
  "Leather Patch",
  "Heat Transfer Label",
  "Custom Hang Tag",
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

export default function InquiryPage() {
  const router = useRouter();
  const params = useParams();

  const category =
    typeof params.category === "string"
      ? params.category
      : Array.isArray(params.category)
        ? params.category[0]
        : "";

  const product = categoryData[category];

  const [selectedProduct, setSelectedProduct] = useState("");
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
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!product) {
    return (
      <main className="inquiry-page">
        <div className="inquiry-shell">
          <h1>Collection Not Found</h1>

          <button
            className="btn btn-gold"
            onClick={() => router.push("/account")}
          >
            Back to Collection
          </button>
        </div>
      </main>
    );
  }

  const toggleSize = (size: string) => {
    setSelectedSizes((current) =>
      current.includes(size)
        ? current.filter((item) => item !== size)
        : [...current, size],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    setSubmitError("");

    try {
      const inquiryData = {
        category,
        productCategory: product.title,
        productDetail: selectedProduct,
        color: selectedColor,
        fabricType,
        gsm,
        vintageEffect,
        fitStyle,
        printingTechnique,
        rhinestone,
        label,
        sizes: selectedSizes,
        quantity,
        fileName: file?.name || "",
        notes,
      };

      console.log("Sending inquiry:", inquiryData);

      const response = await fetch(`${API_URL}/inquiries`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(inquiryData),
      });

      if (!response.ok) {
        const errorText = await response.text();

        console.error("Inquiry API error:", errorText);

        throw new Error(
          `Failed to submit inquiry (${response.status})`,
        );
      }

      const savedInquiry = await response.json();

      console.log("Inquiry saved successfully:", savedInquiry);

      setSubmitted(true);
    } catch (error) {
      console.error("Inquiry submission failed:", error);

      setSubmitError(
        "We could not submit your inquiry. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="inquiry-page">
        <div className="inquiry-shell">
          <div className="inquiry-success">
            <span className="eyebrow">INQUIRY RECEIVED</span>

            <h1>
              Thank You for
              <em> Your Interest.</em>
            </h1>

            <p>
              Your sample inquiry for {product.title} has been
              submitted successfully. Our team can review your
              requirements and get back to you with the next steps.
            </p>

            <div className="inquiry-success-actions">
              <button
                className="btn btn-gold"
                onClick={() =>
                  router.push(`/collection/${category}`)
                }
              >
                Back to Collection
                <ArrowUpRight size={16} />
              </button>

              <button
                className="btn btn-outline"
                onClick={() => router.push("/")}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="inquiry-page">
      <div className="inquiry-shell">
        <button
          type="button"
          className="inquiry-back"
          onClick={() =>
            router.push(`/collection/${category}`)
          }
        >
          <ArrowLeft size={16} />
          Back to {product.title}
        </button>

        <header className="inquiry-hero">
          <span className="eyebrow">CUSTOM SAMPLE ORDER</span>

          <h1>
            Tell Us About
            <em> Your Design.</em>
          </h1>

          <p>
            Share your product requirements below and our team will
            use these details to understand your sample request.
          </p>

          <div className="inquiry-category">
            <span>{product.gender}</span>
            <strong>{product.productType}</strong>
          </div>
        </header>

        <form
          className="inquiry-form"
          onSubmit={handleSubmit}
        >
          {/* 01 PRODUCT */}

          <section className="inquiry-section">
            <div className="inquiry-section-head">
              <span>01</span>

              <div>
                <span className="eyebrow">
                  PRODUCT DETAILS
                </span>

                <h2>Choose Your Product</h2>
              </div>
            </div>

            <div className="inquiry-option-grid">
              {productDetails.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`inquiry-option ${
                    selectedProduct === item ? "active" : ""
                  }`}
                  onClick={() =>
                    setSelectedProduct(item)
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          {/* 02 COLOR */}

          <section className="inquiry-section">
            <div className="inquiry-section-head">
              <span>02</span>

              <div>
                <span className="eyebrow">COLOR</span>

                <h2>Select Your Color</h2>
              </div>
            </div>

            <div className="inquiry-color-grid">
              {colors.map((color) => (
                <button
                  type="button"
                  key={color}
                  className={`inquiry-color ${
                    selectedColor === color ? "active" : ""
                  }`}
                  onClick={() =>
                    setSelectedColor(color)
                  }
                >
                  {color}
                </button>
              ))}
            </div>
          </section>

          {/* 03 FABRIC */}

          <section className="inquiry-section">
            <div className="inquiry-section-head">
              <span>03</span>

              <div>
                <span className="eyebrow">
                  FABRIC & FINISH
                </span>

                <h2>Material Specifications</h2>
              </div>
            </div>

            <div className="inquiry-spec-grid">
              <label className="inquiry-field">
                <span>Fabric Type</span>

                <select
                  value={fabricType}
                  onChange={(e) =>
                    setFabricType(e.target.value)
                  }
                >
                  <option value="">
                    Select fabric type
                  </option>

                  {fabricTypes.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="inquiry-field">
                <span>Fabric GSM</span>

                <select
                  value={gsm}
                  onChange={(e) =>
                    setGsm(e.target.value)
                  }
                >
                  <option value="">
                    Select GSM
                  </option>

                  {fabricGsm.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="inquiry-field">
                <span>Vintage Effect</span>

                <select
                  value={vintageEffect}
                  onChange={(e) =>
                    setVintageEffect(e.target.value)
                  }
                >
                  <option value="">
                    Select effect
                  </option>

                  {vintageEffects.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="inquiry-field">
                <span>Fit Style</span>

                <select
                  value={fitStyle}
                  onChange={(e) =>
                    setFitStyle(e.target.value)
                  }
                >
                  <option value="">
                    Select fit
                  </option>

                  {fitStyles.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          {/* 04 CUSTOMIZATION */}

          <section className="inquiry-section">
            <div className="inquiry-section-head">
              <span>04</span>

              <div>
                <span className="eyebrow">
                  CUSTOMIZATION
                </span>

                <h2>Branding & Details</h2>
              </div>
            </div>

            <div className="inquiry-spec-grid">
              <label className="inquiry-field">
                <span>Printing Technique</span>

                <select
                  value={printingTechnique}
                  onChange={(e) =>
                    setPrintingTechnique(
                      e.target.value,
                    )
                  }
                >
                  <option value="">
                    Select technique
                  </option>

                  {printingTechniques.map(
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
                <span>Rhinestones</span>

                <select
                  value={rhinestone}
                  onChange={(e) =>
                    setRhinestone(e.target.value)
                  }
                >
                  <option value="">
                    Select option
                  </option>

                  {rhinestones.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="inquiry-field">
                <span>Labels & Branding</span>

                <select
                  value={label}
                  onChange={(e) =>
                    setLabel(e.target.value)
                  }
                >
                  <option value="">
                    Select label
                  </option>

                  {labels.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          {/* 05 SIZES */}

          <section className="inquiry-section">
            <div className="inquiry-section-head">
              <span>05</span>

              <div>
                <span className="eyebrow">
                  SIZING
                </span>

                <h2>Select Sizes</h2>
              </div>
            </div>

            <div className="inquiry-size-grid">
              {sizes.map((size) => (
                <button
                  type="button"
                  key={size}
                  className={`inquiry-size ${
                    selectedSizes.includes(size)
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    toggleSize(size)
                  }
                >
                  {size}
                </button>
              ))}
            </div>
          </section>

          {/* 06 QUANTITY */}

          <section className="inquiry-section">
            <div className="inquiry-section-head">
              <span>06</span>

              <div>
                <span className="eyebrow">
                  QUANTITY
                </span>

                <h2>How Many Units?</h2>
              </div>
            </div>

            <div className="inquiry-quantity-grid">
              {quantities.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`inquiry-quantity ${
                    quantity === item
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setQuantity(item)
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          {/* 07 FILE & NOTES */}

          <section className="inquiry-section">
            <div className="inquiry-section-head">
              <span>07</span>

              <div>
                <span className="eyebrow">
                  ADDITIONAL INFORMATION
                </span>

                <h2>Share Your Requirements</h2>
              </div>
            </div>

            <div className="inquiry-upload">
              <Upload size={22} />

              <div>
                <strong>
                  Upload Design / Reference
                </strong>

                <p>
                  Add artwork, sketches, reference
                  images or other useful files.
                </p>
              </div>

              <label>
                Choose File

                <input
                  type="file"
                  onChange={(e) =>
                    setFile(
                      e.target.files?.[0] || null,
                    )
                  }
                />
              </label>

              {file && (
                <small>{file.name}</small>
              )}
            </div>

            <label className="inquiry-notes">
              <span>Additional Notes</span>

              <textarea
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                placeholder="Tell us anything else about your design, measurements, branding or requirements..."
                rows={6}
              />
            </label>
          </section>

          {/* ERROR */}

          {submitError && (
            <div className="inquiry-error">
              {submitError}
            </div>
          )}

          {/* SUBMIT */}

          <div className="inquiry-submit">
            <div>
              <span className="eyebrow">
                READY TO START?
              </span>

              <p>
                Submit your requirements and
                continue with your custom sample
                inquiry.
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-gold"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit Sample Inquiry"}

              {!submitting && (
                <ArrowUpRight size={17} />
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}