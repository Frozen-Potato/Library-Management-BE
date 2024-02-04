import { z } from 'zod'

export const userSchema = z.object({
  firstName: z
    .string({
      required_error: 'First name is required',
    })
    .min(1, 'First name cannot be empty.'),
  lastName: z
    .string({
      required_error: 'Last name is required',
    })
    .min(1, 'Last name cannot be empty.'),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .min(1, 'Email cannot be empty.')
    .email('Not a valid email'),
  address: z
    .string({
      required_error: 'Address is required',
    })
    .min(1, 'Address cannot be empty.'),
  avatar: z.string().url().min(1).default('https://placehold.co/600x400'),
  phoneNumber: z
    .string({
      required_error: 'Phone number is required',
    })
    .min(1, 'Phone number cannot be empty.'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(1, 'Password cannot be empty.'),
})

export const userCreateSchema = userSchema
  .merge(
    z.object({
      confirmPassword: z
        .string({
          required_error: 'Confirm password is required',
        })
        .min(1, 'Confirm password can not be empty'),
    })
  )
  .refine(
    (values) => {
      return values.password === values.confirmPassword
    },
    {
      message: 'Passwords must match!',
      path: ['confirmPassword'],
    }
  )
export const userUpdateSchema = z.object({
  body: userSchema.partial(),
})
