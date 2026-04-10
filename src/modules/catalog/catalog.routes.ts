import { Router } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import { catalogController } from './catalog.controller'

const router = Router()

router.get('/categories', asyncHandler(catalogController.getCategories))
router.get('/brands', asyncHandler(catalogController.getBrands))
router.get('/models', asyncHandler(catalogController.getModels))

export default router
