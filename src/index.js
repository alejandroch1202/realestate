import express from 'express'
import router from './routes/index.js'
import db from './config/db.js'

const PORT = process.env.PORT ?? 3000
const app = express()

// Enable JSON from POST
app.use(express.urlencoded({ extended: true }))

// DB connection
try {
  await db.authenticate()
  db.sync()
  console.log('[mysql] Connection established')
} catch (error) {
  console.log(error)
}

// Enable Pug
app.set('view engine', 'pug')
app.set('views', './src/views')

// Public folder
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Welcome to the server' })
})

router(app)

app.listen(PORT, () => {
  console.log(`[server] Running on http://localhost:${PORT}`)
})
