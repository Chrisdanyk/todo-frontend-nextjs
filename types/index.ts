import z from "zod"

export const passwordSchema = z
  .string({
    required_error: 'Password can not be empty.'
  })
// .regex(/^.{6,20}$/, {
//   message: 'Minimum 6 and maximum 20 characters.'
// })
// .regex(/(?=.*[A-Z])/, {
//   message: 'At least one uppercase character.'
// })
// .regex(/(?=.*[a-z])/, {
//   message: 'At least one lowercase character.'
// })
// .regex(/(?=.*\d)/, {
//   message: 'At least one digit.'
// })

export const LogInFormSchema = z.object({
  password: passwordSchema,
  email: z.string().email({ message: 'Email address not correct' })
})

export type LogInFormType = z.infer<typeof LogInFormSchema>

export const LoginResponseSchema = z.object({
  statusCode: z.number().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
  access_token: z.string().optional(),
  refresh_token: z.string().optional(),
  id: z.string().optional(),
  email: z.string().email().optional(),
})
export type LoginResponse = z.infer<typeof LoginResponseSchema>

export const LoginSuccessResponseSchema = LoginResponseSchema.omit({
  error: true,
  message: true,
  statusCode: true,
})

export type LoginSuccessResponse = z.infer<typeof LoginSuccessResponseSchema>

export const LoginErrorResponseSchema = LoginResponseSchema.pick({
  error: true,
  message: true,
  statusCode: true,
})

export type LoginErrorResponse = z.infer<typeof LoginErrorResponseSchema>






