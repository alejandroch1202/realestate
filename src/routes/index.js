import { Router } from 'express'
import auth from './auth.js'
import users from './users.js'

const apiRouter = (app) => {
  const router = Router()

  app.use('/', router)
  router.use('/auth', auth)
  router.use('/users', users)
}

export default apiRouter
