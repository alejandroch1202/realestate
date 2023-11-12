import { Router } from 'express'
import { csrfValidator } from './../middlewares/csrf.js'
import { home, categories, notFound, search } from '../controllers/app.js'

const router = Router()

router.get('/', home)
router.get('/categories/:id', categories)
router.get('/404', notFound)
router.post('/search', csrfValidator, search)

export default router
