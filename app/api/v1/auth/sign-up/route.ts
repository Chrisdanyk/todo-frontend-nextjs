import { NextResponse } from 'next/server'
import { aj } from '@/lib/configs/arcjet-config'
import { SignUpFormSchema } from '@/schemas'

export async function POST(request: Request) {
  const values = await request.json()
  const validationResult = SignUpFormSchema.safeParse(values)

  if (!validationResult.success) {
    return NextResponse.json({
      errors: validationResult.error.flatten().fieldErrors
    })
  }

  const data = validationResult.data

  const decision = await aj.protect(request, {
    email: data.email
  })

  try {
    if (decision.isDenied()) {
      if (decision.reason.isEmail()) {
        return NextResponse.json(
          {
            message: 'Invalid email',
            reason: decision.reason
          },
          { status: 400 }
        )
      } else {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
      }
    } else {
      //implement the logic of sending data to the backend

      return NextResponse.json({
        message: 'Success',
        data: { email: data.email }
      })
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
