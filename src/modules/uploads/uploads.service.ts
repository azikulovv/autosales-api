import type { Request } from 'express'
import { ApiError } from '../../utils/ApiError'

const buildFileUrl = (req: Request, filename: string) => {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`
}

export const uploadsService = {
  uploadSingle(req: Request) {
    const file = req.file

    if (!file) {
      throw new ApiError(400, 'Файл не был загружен')
    }

    return {
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: `/uploads/${file.filename}`,
      url: buildFileUrl(req, file.filename),
    }
  },

  uploadMany(req: Request) {
    const files = req.files as Express.Multer.File[] | undefined

    if (!files || files.length === 0) {
      throw new ApiError(400, 'Файлы не были загружены')
    }

    return files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: `/uploads/${file.filename}`,
      url: buildFileUrl(req, file.filename),
    }))
  },
}
