import { Router } from 'express'
import protectRoutes from './../middlewares/protectRoutes.js'
import { showMessages } from '../controllers/messages.js'

const router = Router()

router.get('/:id', protectRoutes, showMessages)

export default router
