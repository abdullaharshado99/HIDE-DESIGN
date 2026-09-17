const localApiUrl = 'http://localhost:4000'
const productionApiUrl = 'https://hide-design-q2o9.onrender.com'

export function getApiUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '')
  }

  if (typeof window !== 'undefined' && (window.location.hostname === 'hidesdesign.com' || window.location.hostname === 'www.hidesdesign.com')) {
    return productionApiUrl
  }

  return localApiUrl
}