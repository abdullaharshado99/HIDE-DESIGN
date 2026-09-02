'use client'

import { useSearchParams } from 'next/navigation'
import AdminPanel from './AdminPanel'

export default function AdminPanelWrapper() {
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')

  return <AdminPanel initialEditId={editId ? parseInt(editId) : null} />
}
