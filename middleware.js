import rateLimit from './lib/ratelimit'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  // If method is not POST, return with `Forbidden Access`
  if (request.method !== 'POST') return new NextResponse('Bad Request.', { status: 400 })
  // Clone the request headers and read the ip
  const requestHeaders = new Headers(request.headers)
  const ip = requestHeaders.get('x-forwarded-for')
  if (ip) {
    // Check the Rate Limit
    const success = await rateLimit(ip.split(',')[0])
    // If within rate limit, send to the function logic
    if (success) return NextResponse.next()
    // If exceeded, return with a 401
    else return new NextResponse('Rate Limit Exceeded.', { status: 401 })
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/chat', '/api/model'],
}
