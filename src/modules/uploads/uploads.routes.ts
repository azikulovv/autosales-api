import { Router } from 'express'
import { authMiddleware, allowRoles } from '../../middlewares/auth.middleware'
import { upload } from '../../middlewares/upload.middleware'
import { uploadsController } from './uploads.controller'
import { asyncHandler } from '../../utils/asyncHandler'

const router = Router()

router.use(authMiddleware)
router.use(allowRoles('SELLER', 'ADMIN'))

router.post('/single', upload.single('file'), asyncHandler(uploadsController.uploadSingle))

router.post('/multiple', upload.array('files', 10), asyncHandler(uploadsController.uploadMany))

export default router
