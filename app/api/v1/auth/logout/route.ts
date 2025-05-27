import { env } from '@/env'
import { deleteSession } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = await fetch(
      `${env.NEXT_PUBLIC_EXTERNAL_API_URL}/api/v1/auth/logout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      }
    )

    await deleteSession()
    return NextResponse.json({ message: 'Logged out' }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Logout failed' }, { status: 500 })
  }
}
