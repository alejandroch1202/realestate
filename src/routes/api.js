import { Router } from 'express'
import { properties } from './../controllers/api.js'

const router = Router()

router.get('/properties', properties)

export default router
