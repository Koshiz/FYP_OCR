import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_SECRET,
})

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(50, '1 h'),
})

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl?.pathname // Add error checking here

    if (!pathname) {
      return NextResponse.json({ error: 'Internal Server Error' })
    }

    // Manage rate limiting
    if (pathname.startsWith('/api')) {
      const ip = req.ip ?? '127.0.0.1'
      try {
        const { success } = await ratelimit.limit(ip)

        if (!success) return NextResponse.json({ error: 'Too Many Requests' })
        return NextResponse.next()
      } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' })
      }
    }

    // Rest of the code
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*', '/api/:path*'],
}