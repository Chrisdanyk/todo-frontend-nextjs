import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

const authRouteRegex =
  /^\/(login|signup)$/

// Helper function to create a route matcher based on a regex
function createRouteMatcher(regex: RegExp) {
  return (req: NextRequest) => {
    const pathname = new URL(req.url).pathname
    return regex.test(pathname)
  }
}

const isAuthRoute = createRouteMatcher(authRouteRegex)

export default async function middleware(req: NextRequest) {
  const session = await getSession()

  if (!session && isAuthRoute(req)) {
    return NextResponse.next()
  }

  if (!session && !isAuthRoute(req)) {
    console.log('Redirecting to /login')
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (session && isAuthRoute(req)) {
    console.log('Redirecting to /')
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|api|trpc|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)'
  ]
}