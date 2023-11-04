import { Router } from 'express'
import {
  loginForm,
  signupForm,
  confirmAccount,
  recoveryForm
} from './../controllers/auth.js'
import { createUser } from './../controllers/users.js'

const router = Router()

router.get('/login', loginForm)
router.get('/signup', signupForm)
router.post('/signup', createUser)
router.get('/confirm/:token', confirmAccount)
router.get('/recovery', recoveryForm)

export default router
