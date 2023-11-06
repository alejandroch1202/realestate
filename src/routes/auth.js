import { Router } from 'express'
import { csrfValidator } from './../middlewares/csrf.js'
import {
  loginForm,
  login,
  signupForm,
  confirmAccount,
  recoveryForm,
  recovery,
  checkToken,
  newPassword
} from './../controllers/auth.js'
import { createUser } from './../controllers/users.js'

const router = Router()

router.get('/login', loginForm)
router.post('/login', csrfValidator, login)
router.get('/signup', signupForm)
router.post('/signup', csrfValidator, createUser)
router.get('/confirm/:token', confirmAccount)
router.get('/recovery', recoveryForm)
router.post('/recovery', csrfValidator, recovery)
router.get('/recovery/:token', checkToken)
router.post('/recovery/:token', csrfValidator, newPassword)

export default router
