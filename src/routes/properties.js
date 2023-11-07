import { Router } from 'express'
import { admin, createForm } from '../controllers/properties.js'

const router = Router()

router.get('/', admin)
router.get('/create', createForm)

export default router
