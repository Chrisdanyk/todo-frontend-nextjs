import { env } from '@/env'
import { cookie } from '@/lib/session'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  return proxyRequest(req, resolvedParams, 'GET')
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  return proxyRequest(req, resolvedParams, 'POST')
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  return proxyRequest(req, resolvedParams, 'PUT')
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  return proxyRequest(req, resolvedParams, 'DELETE')
}

async function proxyRequest(
  request: NextRequest,
  { path }: { path: string[] },
  method: HttpMethod
): Promise<NextResponse> {
  const token = (await cookies()).get(cookie.name)?.value

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  if (!env.NEXT_PUBLIC_EXTERNAL_API_URL) {
    return NextResponse.json(
      { message: 'API base URL is not configured' },
      { status: 500 }
    )
  }

  const apiPath = path.join('/')
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }

  const options: RequestInit = { method, headers }

  if (method !== 'GET') {
    try {
      const body = await request.json()
      options.body = JSON.stringify(body)
    } catch (error) {
      console.error(error)
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 }
      )
    }
  }

  const baseUrl = env.NEXT_PUBLIC_EXTERNAL_API_URL.endsWith('/')
    ? env.NEXT_PUBLIC_EXTERNAL_API_URL.slice(0, -1)
    : env.NEXT_PUBLIC_EXTERNAL_API_URL

  const url = `${baseUrl}/api/${apiPath}`

  try {
    const response = await fetch(url, options)
    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: 'Proxy failed' }, { status: 500 })
  }
}
