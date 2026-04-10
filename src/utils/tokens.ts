import jwt from 'jsonwebtoken'
import type { Response } from 'express'
import { env } from '../config/env'
import type { JwtPayloadData } from '../types/auth.types'

const ACCESS_TOKEN_EXPIRES_IN = '15m'
const REFRESH_TOKEN_EXPIRES_IN = '7d'

export const generateAccessToken = (payload: JwtPayloadData) => {
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  })
}

export const generateRefreshToken = (payload: JwtPayloadData) => {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  })
}

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.jwtAccessSecret) as JwtPayloadData
}

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.jwtRefreshSecret) as JwtPayloadData
}

export const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
}
