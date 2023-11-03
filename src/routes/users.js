import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json({ ok: true, message: 'Users' })
})

router.post('/', (req, res) => {
  res.status(201).json({ ok: true, message: 'Endpoint to create users' })
})

export default router
