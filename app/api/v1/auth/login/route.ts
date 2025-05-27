import { env } from '@/env'
import { createSession } from '@/lib/session'
import { LogInFormSchema } from '@/schemas'
import type { LoginErrorResponse, LoginSuccessResponse } from '@/types'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    let data

    try {
      data = await request.json()
    } catch (error) {
      console.error(error)
      return NextResponse.json<LoginErrorResponse>(
        {
          status: 'error',
          message: 'Invalid request body: Expected JSON'
        },
        { status: 400 }
      )
    }

    const validated = LogInFormSchema.safeParse(data)

    if (!validated.success) {
      return NextResponse.json<LoginErrorResponse>(
        {
          status: 'error',
          message: 'Invalid input data',
          errors: validated.error.flatten().fieldErrors
        },
        { status: 400 }
      )
    }

    const { email, password } = validated.data

    let response
    try {
      response = await fetch(
        `${env.NEXT_PUBLIC_EXTERNAL_API_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        }
      )
    } catch (error) {
      console.error('Network error during authentication:', error)
      return NextResponse.json<LoginErrorResponse>(
        {
          status: 'error',
          message: 'Failed to connect to authentication service'
        },
        { status: 503 }
      )
    }

    if (!response.ok) {
      let responseData
      try {
        responseData = await response.json()
      } catch (error) {
        console.error('Error parsing API response:', error)
        return NextResponse.json<LoginErrorResponse>(
          {
            status: 'error',
            message: 'Invalid response from authentication service'
          },
          { status: response.status }
        )
      }

      if (response.status === 401) {
        return NextResponse.json<LoginErrorResponse>(
          {
            status: 'error',
            message: responseData.message || 'Invalid credentials',
            errors: responseData.errors || undefined
          },
          { status: 401 }
        )
      }

      return NextResponse.json<LoginErrorResponse>(
        {
          status: 'error',
          message: responseData.message || 'Authentication failed',
          errors: responseData.errors || undefined
        },
        { status: response.status }
      )
    }

    let successData: LoginSuccessResponse
    try {
      successData = (await response.json()) as LoginSuccessResponse
    } catch (error) {
      console.error('Error parsing success response:', error)
      return NextResponse.json<LoginErrorResponse>(
        {
          status: 'error',
          message: 'Malformed response from authentication service'
        },
        { status: 500 }
      )
    }

    if (!successData.data?.token) {
      return NextResponse.json<LoginErrorResponse>(
        {
          status: 'error',
          message: 'No authentication token provided by server'
        },
        { status: 500 }
      )
    }

    try {
      await createSession(successData.data.token)
    } catch (error) {
      console.error('Session creation error:', error)
      return NextResponse.json<LoginErrorResponse>(
        {
          status: 'error',
          message: 'Failed to create session'
        },
        { status: 500 }
      )
    }

    return NextResponse.json<LoginSuccessResponse>(
      {
        status: 'success',
        message: 'Login successful',
        data: successData.data
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unexpected login error:', error)
    return NextResponse.json<LoginErrorResponse>(
      {
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred during login'
      },
      { status: 500 }
    )
  }
}
