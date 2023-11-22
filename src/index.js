import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import cookieParser from 'cookie-parser'
import router from './routes/index.js'
import { csrfToken } from './middlewares/csrf.js'
import db from './config/db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT ?? 3000
const app = express()

// Enable JSON from POST
app.use(express.urlencoded({ extended: true }))

// Enable cookies
app.use(cookieParser())

// Enable CSRF
app.use(csrfToken)

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
app.set('views', path.join(__dirname, 'views'))

// Public folder
app.use(express.static('public'))

router(app)

app.listen(PORT, () => {
  console.log(`[server] Running on http://localhost:${PORT}`)
})
