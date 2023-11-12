import { Router } from 'express'
import protectRoutes from './../middlewares/protectRoutes.js'
import { properties } from './../controllers/api.js'

const router = Router()

router.get('/properties', protectRoutes, properties)

export default router
