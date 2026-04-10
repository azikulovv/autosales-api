import { z } from 'zod'

export const updateSellerProfileSchema = z.object({
  shopName: z
    .string()
    .trim()
    .min(2, 'Название магазина должно быть не короче 2 символов')
    .max(100, 'Название магазина слишком длинное')
    .optional(),

  description: z.string().trim().max(1000, 'Описание слишком длинное').optional().or(z.literal('')),

  city: z.string().trim().max(100, 'Название города слишком длинное').optional().or(z.literal('')),

  address: z.string().trim().max(255, 'Адрес слишком длинный').optional().or(z.literal('')),

  avatar: z.string().trim().url('Avatar должен быть ссылкой').optional().or(z.literal('')),
})

export type UpdateSellerProfileInput = z.infer<typeof updateSellerProfileSchema>
