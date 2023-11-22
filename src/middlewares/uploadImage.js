import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'
import { generateId } from './../helpers/token.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, './../../public/uploads'))
  },
  filename: (req, file, cb) => {
    cb(null, generateId() + path.extname(file.originalname))
  }
})

const upload = multer({ storage })

export default upload
