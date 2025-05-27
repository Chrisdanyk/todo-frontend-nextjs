import { deleteSession } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    await deleteSession()
    return NextResponse.json({ message: 'Logged out' }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Logout failed' }, { status: 500 })
  }
}
