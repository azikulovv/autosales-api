import type { Request, Response } from 'express'
import { uploadsService } from './uploads.service'

export const uploadsController = {
  async uploadSingle(req: Request, res: Response) {
    const file = uploadsService.uploadSingle(req)

    res.status(201).json({
      success: true,
      message: 'Файл загружен',
      data: file,
    })
  },

  async uploadMany(req: Request, res: Response) {
    const files = uploadsService.uploadMany(req)

    res.status(201).json({
      success: true,
      message: 'Файлы загружены',
      data: files,
    })
  },
}
