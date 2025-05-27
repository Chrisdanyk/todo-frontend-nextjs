import { env } from '@/env'
import { createSession } from '@/lib/session'
import {
  LoginErrorResponse,
  LoginSuccessResponse,
  LogInFormSchema,
} from '@/types'
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
          message: 'Invalid request body: Expected JSON',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 400 }
      )
    }

    const validated = LogInFormSchema.safeParse(data)

    if (!validated.success) {
      return NextResponse.json<LoginErrorResponse>(
        {
          message: 'Invalid input data',
          error: Object.values(validated.error.flatten().fieldErrors)
            .flat()
            .filter(Boolean)
            .join(', ') || 'Invalid input data',
        },
        { status: 400 }
      )
    }

    const { email, password } = validated.data

    let response
    try {
      response = await fetch(
        `${env.NEXT_PUBLIC_EXTERNAL_API_URL}/api/v1/auth/login`,
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
          message: 'Failed to connect to authentication service',
          error: error instanceof Error ? error.message : 'Unknown network error'
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
            message: 'Invalid response from authentication service',
            error: error instanceof Error ? error.message : 'Unknown error'
          },
          { status: response.status }
        )
      }

      if (response.status === 401) {
        return NextResponse.json<LoginErrorResponse>(
          {
            error: responseData.message || 'Invalid credentials',
            message: responseData.message || 'Authentication failed',
          },
          { status: 401 }
        )
      }

      return NextResponse.json<LoginErrorResponse>(
        {
          message: responseData.message || 'Authentication failed',
          error: responseData.error || undefined
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
          message: 'Malformed response from authentication service',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      )
    }

    if (!successData?.access_token) {
      return NextResponse.json<LoginErrorResponse>(
        {
          error: 'No authentication token provided by server',
          message: 'No authentication token provided by server'
        },
        { status: 500 }
      )
    }

    try {
      await createSession(successData.access_token)
    } catch (error) {
      console.error('Session creation error:', error)
      return NextResponse.json<LoginErrorResponse>(
        {
          error: 'Failed to create session',
          message: 'Failed to create session'
        },
        { status: 500 }
      )
    }

    return NextResponse.json<LoginSuccessResponse>(
      {

        id: successData.id,
        email: successData.email,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unexpected login error:', error)
    return NextResponse.json<LoginErrorResponse>(
      {
        error: 'Unexpected error occurred',
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred during login'
      },
      { status: 500 }
    )
  }
}
