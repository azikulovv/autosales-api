import { Router } from 'express'
import { sellersController } from './sellers.controller'
import { asyncHandler } from '../../utils/asyncHandler'
import { allowRoles, authMiddleware } from '../../middlewares/auth.middleware'

const router = Router()

router.use(authMiddleware)
router.use(allowRoles('BUYER', 'SELLER', 'ADMIN'))

router.get('/profile', asyncHandler(sellersController.getMyProfile))
router.patch('/profile', asyncHandler(sellersController.updateMyProfile))

export default router
