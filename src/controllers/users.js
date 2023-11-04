import { check, validationResult } from 'express-validator'
import User from './../models/User.js'
import { generateId } from '../helpers/token.js'
import { emailSignup } from '../helpers/emails.js'

const createUser = async (req, res) => {
  // Validation
  await check('name')
    .notEmpty()
    .withMessage('El nombre no puede ir vacio')
    .run(req)
  await check('email').isEmail().withMessage('Coloca un correo valido').run(req)
  await check('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe ser al menos de 6 caracteres')
    .run(req)
  await check('repeat_password')
    .equals(req.body.password)
    .withMessage('Las contraseñas no son iguales')
    .run(req)

  const result = validationResult(req)

  // Verify result is empty
  if (!result.isEmpty()) {
    return res.render('auth/signup', {
      page: 'Crear cuenta',
      errors: result.array(),
      user: {
        name: req.body.name,
        email: req.body.email
      }
    })
  }
  const { name, email, password } = req.body

  // Not duplicated emails verify
  const isDuplicated = await User.findOne({ where: { email } })
  if (isDuplicated) {
    return res.render('auth/signup', {
      page: 'Crear cuenta',
      errors: [{ msg: 'El correo ya existe' }],
      user: {
        name: req.body.name,
        email: req.body.email
      }
    })
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    token: generateId()
  })

  // Send confirmation email
  emailSignup({
    name: user.name,
    email: user.email,
    token: user.token
  })

  // Show confirm message
  res.render('templates/message', {
    page: 'Cuenta creada',
    message: 'Hemos enviado un correo de confirmacion'
  })
}

export { createUser }
