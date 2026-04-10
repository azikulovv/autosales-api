import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from './config/env'
import { errorMiddleware } from './middlewares/error.middleware'
import authRoutes from './modules/auth/auth.routes'
import sellersRoutes from './modules/sellers/sellers.routes'
import productsRoutes from './modules/products/products.routes'

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

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'AutoSales API is running',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/seller', sellersRoutes)
app.use('/api/seller/products', productsRoutes)

app.use(errorMiddleware)

export default app
