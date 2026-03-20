import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get('address')
  if (!address) {
    return NextResponse.json({ error: 'Address required' }, { status: 400 })
  }

  const res = await fetch(
    `https://vibemap.ca/api/neighborhood?address=${encodeURIComponent(address)}`,
    { cache: 'no-store' }
  )

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}