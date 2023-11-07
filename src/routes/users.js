import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  return res.status(501).send('We are working here...')
})

export default router
