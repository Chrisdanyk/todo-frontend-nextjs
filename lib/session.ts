import 'server-only'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const cookie = {
  name: 'auth-session',
  options: { httpOnly: true, secure: true, sameSite: 'lax', path: '/' },
  duration: 60 * 60 * 24 * 1000
}

export async function createSession(token: string) {
  const expires = Date.now() + cookie.duration
  const sessionData = JSON.stringify({ token, expires })
  const cookieStore = await cookies()

  cookieStore.set(cookie.name, sessionData, {
    httpOnly: true,
    expires: new Date(expires),
    path: '/'
  })
}

export async function verifySession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(cookie.name)?.value

  if (!sessionCookie) {
    redirect('/auth/login')
  }

  try {
    const { token, expires } = JSON.parse(sessionCookie)
    if (!token || !expires || Date.now() > expires) {
      await deleteSession()
      redirect('/auth/login')
    }
    return { token }
  } catch (error) {
    console.error('Invalid session data:', error)
    redirect('/auth/login')
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(cookie.name)
}

export async function getSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(cookie.name)?.value

  if (!sessionCookie) {
    return null
  }

  try {
    const { token, expires } = JSON.parse(sessionCookie)

    if (!token || !expires || Date.now() > expires) {
      await deleteSession()
      return null
    }
    return { session: token }
  } catch (error) {
    console.error('Invalid session data:', error)
    return null
  }
}