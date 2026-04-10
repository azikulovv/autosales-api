import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'

const uploadsDir = path.resolve('uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir)
  },

  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    const baseName = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9-_]/gi, '-')
      .replace(/-+/g, '-')

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${baseName}-${uniqueSuffix}${ext}`)
  },
})

const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    cb(new Error('Разрешены только изображения JPG, PNG, WEBP'))
    return
  }

  cb(null, true)
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
})
