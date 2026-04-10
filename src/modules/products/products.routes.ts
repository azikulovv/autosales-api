import { Router } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import { allowRoles, authMiddleware } from '../../middlewares/auth.middleware'
import { productsController } from './products.controller'

const router = Router()

router.use(authMiddleware)
router.use(allowRoles('SELLER', 'ADMIN'))

router.post('/', asyncHandler(productsController.create))
router.get('/', asyncHandler(productsController.getMyProducts))
router.get('/:id', asyncHandler(productsController.getMyProductById))
router.patch('/:id', asyncHandler(productsController.update))
router.delete('/:id', asyncHandler(productsController.remove))

export default router
