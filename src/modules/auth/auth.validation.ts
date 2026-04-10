import { z } from 'zod'

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Имя должно быть не короче 2 символов')
    .max(50, 'Имя слишком длинное'),

  email: z
    .string()
    .trim()
    .email('Некорректный email')
    .transform((value) => value.toLowerCase()),

  phone: z
    .string()
    .trim()
    .min(5, 'Некорректный номер телефона')
    .max(30, 'Некорректный номер телефона')
    .optional()
    .or(z.literal('')),

  password: z
    .string()
    .min(6, 'Пароль должен быть не короче 6 символов')
    .max(100, 'Пароль слишком длинный'),

  role: z.enum(['BUYER', 'SELLER']).optional(),
})

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Некорректный email')
    .transform((value) => value.toLowerCase()),

  password: z.string().min(1, 'Пароль обязателен'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
