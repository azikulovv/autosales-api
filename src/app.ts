import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from './config/env'
import { errorMiddleware } from './middlewares/error.middleware'

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

app.use(errorMiddleware)

export default app
