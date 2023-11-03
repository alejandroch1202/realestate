import { Router } from 'express'
import { loginForm, signupForm, recoveryForm } from './../controllers/auth.js'

const router = Router()

router.get('/login', loginForm)
router.get('/signup', signupForm)
router.get('/recovery', recoveryForm)

export default router
