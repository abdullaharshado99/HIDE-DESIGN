const localApiUrl = 'http://localhost:3002'
const productionApiUrl = 'https://hide-design.onrender.com'

export function getApiUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '')
  }

  if (typeof window !== 'undefined' && (window.location.hostname === 'hidesdesign.com' || window.location.hostname === 'www.hidesdesign.com')) {
    return productionApiUrl
  }

  return localApiUrl
}