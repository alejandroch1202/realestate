import { Router } from 'express'
import { csrfToken, csrfValidator } from './../middlewares/csrf.js'
import {
  loginForm,
  signupForm,
  confirmAccount,
  recoveryForm
} from './../controllers/auth.js'
import { createUser } from './../controllers/users.js'

const router = Router()

router.get('/login', loginForm)
router.get('/signup', csrfToken, signupForm)
router.post('/signup', csrfToken, csrfValidator, createUser)
router.get('/confirm/:token', confirmAccount)
router.get('/recovery', recoveryForm)

export default router
