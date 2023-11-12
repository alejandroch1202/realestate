import { Router } from 'express'
import main from './app.js'
import api from './api.js'
import auth from './auth.js'
import users from './users.js'
import properties from './properties.js'

const apiRouter = (app) => {
  const router = Router()

  app.use('/', router)
  router.use('/', main)
  router.use('/api', api)
  router.use('/auth', auth)
  router.use('/users', users)
  router.use('/properties', properties)
}

export default apiRouter
