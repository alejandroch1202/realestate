import { Router } from 'express'
import { home, categories, notFound, search } from '../controllers/app.js'

const router = Router()

router.get('/', home)
router.get('/categories/:id', categories)
router.get('/404', notFound)
router.post('/search', search)

export default router
