import { Router } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import { catalogController } from '../catalog/catalog.controller'

const router = Router()

router.get('/', asyncHandler(catalogController.getProducts))
router.get('/:id', asyncHandler(catalogController.getProductById))

export default router
