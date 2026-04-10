import { z } from 'zod'

const conditionEnum = z.enum(['NEW', 'USED'])

export const createProductSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Название товара должно быть не короче 2 символов')
    .max(150, 'Название товара слишком длинное'),

  description: z.string().trim().max(5000, 'Описание слишком длинное').optional().or(z.literal('')),

  price: z
    .number({
      error: 'Цена должна быть числом',
    })
    .int('Цена должна быть целым числом')
    .positive('Цена должна быть больше 0'),

  stock: z
    .number({
      error: 'Количество должно быть числом',
    })
    .int('Количество должно быть целым числом')
    .min(0, 'Количество не может быть отрицательным')
    .default(1),

  categoryId: z.string().trim().min(1, 'categoryId обязателен'),
  brandId: z.string().trim().min(1, 'brandId обязателен'),

  modelId: z.string().trim().optional().or(z.literal('')),
  article: z.string().trim().max(100, 'Артикул слишком длинный').optional().or(z.literal('')),

  condition: conditionEnum.optional().default('USED'),
  isPublished: z.boolean().optional().default(false),

  images: z
    .array(
      z.object({
        url: z.string().trim().url('Некорректная ссылка на изображение'),
        sortOrder: z.number().int().min(0).optional(),
      }),
    )
    .optional()
    .default([]),
})

export const updateProductSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Название товара должно быть не короче 2 символов')
    .max(150, 'Название товара слишком длинное')
    .optional(),

  description: z.string().trim().max(5000, 'Описание слишком длинное').optional().or(z.literal('')),

  price: z
    .number({
      error: 'Цена должна быть числом',
    })
    .int('Цена должна быть целым числом')
    .positive('Цена должна быть больше 0')
    .optional(),

  stock: z
    .number({
      error: 'Количество должно быть числом',
    })
    .int('Количество должно быть целым числом')
    .min(0, 'Количество не может быть отрицательным')
    .optional(),

  categoryId: z.string().trim().min(1, 'categoryId обязателен').optional(),
  brandId: z.string().trim().min(1, 'brandId обязателен').optional(),

  modelId: z.string().trim().optional().or(z.literal('')),
  article: z.string().trim().max(100, 'Артикул слишком длинный').optional().or(z.literal('')),

  condition: conditionEnum.optional(),
  isPublished: z.boolean().optional(),

  images: z
    .array(
      z.object({
        url: z.string().trim().url('Некорректная ссылка на изображение'),
        sortOrder: z.number().int().min(0).optional(),
      }),
    )
    .optional(),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
