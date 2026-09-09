'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import Image from 'next/image'
import { getApiUrl } from '../api-config'

interface InquiryProduct {
  id: string
  name: string
  detail: string
  imageUrl?: string
  colors: string[]
  sizes: string[]
}

interface ProductInquiryFormProps {
  products: InquiryProduct[]
  initialProductId?: string
  clientName?: string
  company?: string
}

const ACCEPTED_FILE_TYPES = '.pdf,.jpg,.jpeg,.png,.ai,application/pdf,image/jpeg,image/png,application/postscript'

type SubmitStatus = 'idle' | 'uploading' | 'submitting' | 'success' | 'error'

export default function ProductInquiryForm({
  products,
  initialProductId,
  clientName = '',
  company = '',
}: ProductInquiryFormProps) {
  const [selectedProductId, setSelectedProductId] = useState(initialProductId ?? products[0]?.id ?? '')
  const [step, setStep] = useState(1)
  const [name, setName] = useState(clientName)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [fabricType, setFabricType] = useState('')
  const [fabricGsm, setFabricGsm] = useState('')
  const [fitStyle, setFitStyle] = useState('')
  const [printingTechnique, setPrintingTechnique] = useState('')
  const [rhinestones, setRhinestones] = useState('')
  const [labelsBranding, setLabelsBranding] = useState('')
  const [vintageEffects, setVintageEffects] = useState('')
  const [customSpecifications, setCustomSpecifications] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('pieces')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [designFile, setDesignFile] = useState<File | null>(null)
  const [designFileUrl, setDesignFileUrl] = useState('')
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const selectedProduct = products.find((product) => product.id === selectedProductId)
  const progress = `${(step / 5) * 100}%`

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'application/postscript']
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!allowed.includes(file.type) && extension !== 'ai') {
      setErrorMessage('Please choose a PDF, JPG, PNG, or AI file.')
      setStatus('error')
      return
    }

    setDesignFile(file)
    setErrorMessage('')
    setStatus('idle')
  }

  async function uploadDesign(file: File) {
    const cloudinaryData = new FormData()
    cloudinaryData.append('file', file)
    cloudinaryData.append('upload_preset', 'hide_design_uploads')
    cloudinaryData.append('cloud_name', 'gmqcr7ae')

    const response = await fetch('https://api.cloudinary.com/v1_1/gmqcr7ae/auto/upload', {
      method: 'POST',
      body: cloudinaryData,
    })

    if (!response.ok) {
      throw new Error('Design upload failed')
    }

    const result = await response.json() as { secure_url?: string }
    if (!result.secure_url) {
      throw new Error('Cloudinary did not return a file URL')
    }

    return result.secure_url
  }

  function validateStep() {
    if (step === 1 && !selectedProduct) return 'Please select a product.'
    if (step === 4 && (!quantity || Number(quantity) < 1)) return 'Please enter a valid quantity.'
    return ''
  }

  function nextStep() {
    const message = validateStep()
    if (message) {
      setErrorMessage(message)
      setStatus('error')
      return
    }

    setErrorMessage('')
    setStatus('idle')
    setStep((current) => Math.min(5, current + 1))
  }

  function previousStep() {
    setErrorMessage('')
    setStatus('idle')
    setStep((current) => Math.max(1, current - 1))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const message = validateStep()
    if (message || !selectedProduct) {
      setErrorMessage(message || 'Please select a product.')
      setStatus('error')
      return
    }

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage('Please complete your name, email, and phone number.')
      setStatus('error')
      return
    }

    try {
      let uploadedFileUrl = designFileUrl
      if (designFile && !uploadedFileUrl) {
        setStatus('uploading')
        uploadedFileUrl = await uploadDesign(designFile)
        setDesignFileUrl(uploadedFileUrl)
      }

      setStatus('submitting')
      const response = await fetch(`${getApiUrl()}/workspace-inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          company: company.trim() || undefined,
          productName: selectedProduct.name,
          articleNumber: selectedProduct.id,
          color: selectedProduct.colors.join(', ') || 'Not specified',
          fabricType,
          fabricGsm,
          sizes: selectedProduct.sizes,
          quantity: Number(quantity),
          unit,
          additionalNotes: [
            company ? `Company: ${company}` : '',
            additionalNotes,
          ].filter(Boolean).join('\n'),
          designFileUrl: uploadedFileUrl || undefined,
          specifications: JSON.stringify({
            fitStyle,
            printingTechnique,
            rhinestones,
            labelsBranding,
            vintageEffects,
            customSpecifications,
          }),
        }),
      })

      if (!response.ok) {
        throw new Error('Inquiry submission failed')
      }

      setStatus('success')
      setErrorMessage('')
    } catch (error) {
      console.error('Custom inquiry error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'We could not send your inquiry.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="inquiry-success">
        <span className="account-kicker">INQUIRY RECEIVED</span>
        <h3>Thank you, we have your brief.</h3>
        <p>Our team will review the product, specifications, and design file and respond within 48 hours.</p>
        <button className="btn btn-gold" type="button" onClick={() => setStatus('idle')}>
          Send another inquiry
        </button>
      </div>
    )
  }

  return (
    <form className="product-inquiry" onSubmit={handleSubmit}>
      <div className="inquiry-header">
        <div>
          <span className="account-kicker">CUSTOM SAMPLE / PRODUCT INQUIRY</span>
          <h3>Build your sample brief.</h3>
        </div>
        <span className="inquiry-step-count">{step} / 5</span>
      </div>

      <div className="inquiry-progress" aria-hidden="true"><span style={{ width: progress }} /></div>

      <div className="inquiry-step-labels" aria-hidden="true">
        {['Product', 'Design', 'Specs', 'Quantity', 'Notes'].map((label, index) => (
          <span className={index + 1 === step ? 'is-active' : ''} key={label}>{index + 1}. {label}</span>
        ))}
      </div>

      {step === 1 && (
        <div className="inquiry-step">
          <span className="inquiry-kicker">01 / PRODUCT DETAILS</span>
          <h4>Choose the product for this brief.</h4>
          <div className="inquiry-contact-grid">
            <label>Name<input value={name} onChange={(event) => setName(event.target.value)} required /></label>
            <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
            <label>Phone<input value={phone} onChange={(event) => setPhone(event.target.value)} required placeholder="+92 ..." /></label>
          </div>
          <div className="inquiry-product-picker">
            {products.map((product) => (
              <button
                type="button"
                className={product.id === selectedProductId ? 'inquiry-product is-selected' : 'inquiry-product'}
                key={product.id}
                onClick={() => setSelectedProductId(product.id)}
              >
                <span className="inquiry-product-image">
                  {product.imageUrl ? <Image src={product.imageUrl} alt="" fill sizes="96px" /> : null}
                </span>
                <span><strong>{product.name}</strong><small>{product.id}</small></span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="inquiry-step">
          <span className="inquiry-kicker">02 / UPLOAD YOUR DESIGN</span>
          <h4>Bring the artwork for your sample.</h4>
          <label className="inquiry-upload">
            <input type="file" accept={ACCEPTED_FILE_TYPES} onChange={handleFileChange} />
            <strong>{designFile ? designFile.name : 'Choose your design file'}</strong>
            <span>PDF, JPG, PNG, or AI · optional</span>
          </label>
        </div>
      )}

      {step === 3 && (
        <div className="inquiry-step">
          <span className="inquiry-kicker">03 / SPECIFICATIONS</span>
          <h4>Tell us how the sample should be made.</h4>
          <div className="inquiry-fields-grid">
            <label>Fabric type<select value={fabricType} onChange={(event) => setFabricType(event.target.value)}><option value="">Select fabric type</option><option>Leather</option><option>Cotton</option><option>Polyester</option><option>Wool</option><option>Fleece</option><option>Custom</option></select></label>
            <label>Fabric GSM<input value={fabricGsm} onChange={(event) => setFabricGsm(event.target.value)} placeholder="e.g. 220 GSM" /></label>
            <label>Fit style<select value={fitStyle} onChange={(event) => setFitStyle(event.target.value)}><option value="">Select fit</option><option>Regular fit</option><option>Oversized</option><option>Slim fit</option><option>Custom</option></select></label>
            <label>Printing technique<select value={printingTechnique} onChange={(event) => setPrintingTechnique(event.target.value)}><option value="">Select technique</option><option>Screen printing</option><option>Embroidery</option><option>DTF</option><option>None</option><option>Custom</option></select></label>
            <label>Rhinestones<select value={rhinestones} onChange={(event) => setRhinestones(event.target.value)}><option value="">Select option</option><option>None</option><option>Required</option><option>Custom</option></select></label>
            <label>Labels &amp; branding<input value={labelsBranding} onChange={(event) => setLabelsBranding(event.target.value)} placeholder="Neck label, hangtag, etc." /></label>
            <label>Vintage effects<input value={vintageEffects} onChange={(event) => setVintageEffects(event.target.value)} placeholder="Optional finish" /></label>
            <label>Other specifications<input value={customSpecifications} onChange={(event) => setCustomSpecifications(event.target.value)} placeholder="Any special construction details" /></label>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="inquiry-step">
          <span className="inquiry-kicker">04 / QUANTITY</span>
          <h4>How many units should we quote?</h4>
          <div className="inquiry-quantity-row"><label>Quantity<input type="number" min="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} required /></label><label>Unit<select value={unit} onChange={(event) => setUnit(event.target.value)}><option value="pieces">Pieces</option><option value="sets">Sets</option><option value="dozens">Dozens</option></select></label></div>
        </div>
      )}

      {step === 5 && (
        <div className="inquiry-step">
          <span className="inquiry-kicker">05 / ADDITIONAL NOTES</span>
          <h4>Anything else our production team should know?</h4>
          <label>Notes<textarea value={additionalNotes} onChange={(event) => setAdditionalNotes(event.target.value)} rows={7} placeholder="Add measurements, deadlines, packaging notes, or other instructions..." /></label>
        </div>
      )}

      {errorMessage && <p className="inquiry-error" role="alert">{errorMessage}</p>}
      <div className="inquiry-actions">
        {step > 1 && <button className="inquiry-secondary" type="button" onClick={previousStep}>Back</button>}
        {step < 5 ? <button className="btn btn-gold" type="button" onClick={nextStep}>Continue <span>→</span></button> : <button className="btn btn-gold" type="submit" disabled={status === 'uploading' || status === 'submitting'}>{status === 'uploading' ? 'Uploading design...' : status === 'submitting' ? 'Sending inquiry...' : 'Submit inquiry'} <span>→</span></button>}
      </div>
    </form>
  )
}
