import express from 'express'
import path from 'node:path'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from './config/env'
import { errorMiddleware } from './middlewares/error.middleware'
import authRoutes from './modules/auth/auth.routes'
import sellersRoutes from './modules/sellers/sellers.routes'
import productsRoutes from './modules/products/products.routes'
import catalogRoutes from './modules/catalog/catalog.routes'
import publicProductsRoutes from './modules/products/public-products.routes'

const app = express()

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/uploads', express.static(path.resolve('uploads')))

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'AutoSales API is running',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/seller', sellersRoutes)
app.use('/api/seller/products', productsRoutes)
app.use('/api/catalog', catalogRoutes)
app.use('/api/products', publicProductsRoutes)

app.use(errorMiddleware)

export default app
