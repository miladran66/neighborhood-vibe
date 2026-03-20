'use client'
import { useEffect } from 'react'

export default function ResultPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const address = params.get('address') || ''
    if (address) {
      window.location.href = `https://vibemap.ca/?address=${encodeURIComponent(address)}`
    } else {
      window.location.href = 'https://vibemap.ca'
    }
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-[rgba(255,255,255,0.1)] border-t-[#c8f542] rounded-full animate-spin" />
    </main>
  )
}