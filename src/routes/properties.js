import { Router } from 'express'
import { body } from 'express-validator'
import { csrfValidator, csrfValidatorDropzone } from './../middlewares/csrf.js'
import protectRoutes from './../middlewares/protectRoutes.js'
import upload from '../middlewares/uploadImage.js'
import {
  admin,
  createForm,
  create,
  addImage,
  uploadImage,
  editForm,
  edit
} from '../controllers/properties.js'

const router = Router()

router.get('/', protectRoutes, admin)

router.get('/create', protectRoutes, createForm)

router.post(
  '/create',
  protectRoutes,
  csrfValidator,
  body('title').notEmpty().withMessage('El título del anuncio es obligatorio'),
  body('description')
    .notEmpty()
    .withMessage('La descripción no puede ir vacía')
    .isLength({ max: 200 })
    .withMessage('La descripción es muy larga'),
  body('category').isNumeric().withMessage('Selecciona una categoría'),
  body('price').isNumeric().withMessage('Selecciona un rango de precios'),
  body('rooms')
    .isNumeric()
    .withMessage('Selecciona la cantidad de habitaciones'),
  body('wc').isNumeric().withMessage('Selecciona la cantidad de baños'),
  body('garages')
    .isNumeric()
    .withMessage('Selecciona la cantidad de estacionamientos'),
  body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
  create
)

router.get('/image/:id', protectRoutes, addImage)

router.post(
  '/image/:id',
  protectRoutes,
  csrfValidatorDropzone,
  upload.single('image'),
  uploadImage
)

router.get('/edit/:id', protectRoutes, editForm)

router.post(
  '/edit/:id',
  protectRoutes,
  csrfValidator,
  body('title').notEmpty().withMessage('El título del anuncio es obligatorio'),
  body('description')
    .notEmpty()
    .withMessage('La descripción no puede ir vacía')
    .isLength({ max: 200 })
    .withMessage('La descripción es muy larga'),
  body('category').isNumeric().withMessage('Selecciona una categoría'),
  body('price').isNumeric().withMessage('Selecciona un rango de precios'),
  body('rooms')
    .isNumeric()
    .withMessage('Selecciona la cantidad de habitaciones'),
  body('wc').isNumeric().withMessage('Selecciona la cantidad de baños'),
  body('garages')
    .isNumeric()
    .withMessage('Selecciona la cantidad de estacionamientos'),
  body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
  edit
)

export default router
