import { Router } from 'express'
import auth from './auth.js'
import users from './users.js'
import properties from './properties.js'

const apiRouter = (app) => {
  const router = Router()

  app.use('/', router)
  router.use('/auth', auth)
  router.use('/users', users)
  router.use('/properties', properties)
}

export default apiRouter
