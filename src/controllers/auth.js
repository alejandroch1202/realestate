import { check, validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import User from './../models/User.js'
import { generateId, generateJWT } from '../helpers/token.js'
import { emailRecovery } from '../helpers/emails.js'

const loginForm = (req, res) => {
  res.render('auth/login', {
    page: 'Iniciar sesión',
    csrfToken: req.csrfToken()
  })
}

const login = async (req, res) => {
  // Validation
  await check('email')
    .isEmail()
    .withMessage('El correo es obligatorio')
    .run(req)
  await check('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
    .run(req)

  const result = validationResult(req)

  // Verify result is empty
  if (!result.isEmpty()) {
    return res.render('auth/login', {
      page: 'Iniciar sesión',
      csrfToken: req.csrfToken(),
      errors: result.array(),
      user: {
        email: req.body.email
      }
    })
  }
  const { email, password } = req.body

  // Check if the user exists
  const user = await User.findOne({ where: { email } })
  if (!user) {
    return res.render('auth/login', {
      page: 'Iniciar sesión',
      csrfToken: req.csrfToken(),
      errors: [{ msg: 'El usuario no existe' }],
      user: {
        email: req.body.email
      }
    })
  }

  // Check if the user is confirmed
  if (!user.confirmed) {
    return res.render('auth/login', {
      page: 'Iniciar sesión',
      csrfToken: req.csrfToken(),
      errors: [{ msg: 'Su cuenta no ha sido confirmada' }],
      user: {
        email: req.body.email
      }
    })
  }

  // Check if the password is correct
  const auth = await bcrypt.compare(password, user.password)
  if (!auth) {
    return res.render('auth/login', {
      page: 'Iniciar sesión',
      csrfToken: req.csrfToken(),
      errors: [{ msg: 'El usuario o la contraseña son incorrectos' }],
      user: {
        email: req.body.email
      }
    })
  }
  // Authenticate the user
  const token = generateJWT({ id: user.id, name: user.name })
  return res.cookie('_token', token, { httpOnly: true }).redirect('/properties')
}

const signupForm = (req, res) => {
  res.render('auth/signup', {
    page: 'Crear cuenta',
    csrfToken: req.csrfToken()
  })
}

const confirmAccount = async (req, res) => {
  const { token } = req.params

  // Verify if the token is valid
  const user = await User.findOne({ where: { token } })

  if (!user) {
    return res.render('auth/confirm', {
      page: 'Error al confirmar cuenta',
      message: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
      error: true
    })
  }

  // Confirm account

  user.token = null
  user.confirmed = true
  await user.save()

  return res.render('auth/confirm', {
    page: 'Cuenta confirmada',
    message: 'Su cuenta ha sido confirmada correctamente'
  })
}

const recoveryForm = (req, res) => {
  res.render('auth/recovery', {
    page: 'Recuperar contraseña',
    csrfToken: req.csrfToken()
  })
}

const recovery = async (req, res) => {
  // Validation
  await check('email').isEmail().withMessage('Coloca un correo válido').run(req)

  const result = validationResult(req)

  // Verify result is empty
  if (!result.isEmpty()) {
    return res.render('auth/recovery', {
      page: 'Recuperar contraseña',
      csrfToken: req.csrfToken(),
      errors: result.array()
    })
  }

  // Validate if the email exists
  const { email } = req.body
  const user = await User.findOne({ where: { email } })
  if (!user) {
    return res.render('auth/recovery', {
      page: 'Recuperar contraseña',
      csrfToken: req.csrfToken(),
      errors: [{ msg: 'El email no pertenece a ningún usuario' }]
    })
  }

  // Generate token and send to the user
  user.token = generateId()
  await user.save()

  // Send confirmation email
  emailRecovery({
    name: user.name,
    email: user.email,
    token: user.token
  })

  res.render('templates/message', {
    page: 'Recuperar contraseña',
    message: 'Hemos enviado un correo con las instrucciones'
  })
}

const checkToken = async (req, res) => {
  const { token } = req.params
  const user = await User.findOne({ where: { token } })

  if (!user) {
    return res.render('auth/confirm', {
      page: 'Recuperar contraseña',
      message: 'Hubo un error al validar tu información, intenta de nuevo',
      error: true
    })
  }

  // Show form to change password
  res.render('auth/reset', {
    page: 'Restablecer contraseña',
    csrfToken: req.csrfToken()
  })
}

const newPassword = async (req, res) => {
  // Validation
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
    return res.render('auth/reset', {
      page: 'Restablecer contraseña',
      csrfToken: req.csrfToken(),
      errors: result.array()
    })
  }

  // Check user token
  const { token } = req.params
  const user = await User.findOne({ where: { token } })

  // Hash new password
  const { password } = req.body
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(password, salt)
  user.token = null

  await user.save()

  return res.render('auth/confirm', {
    page: 'Contraseña restablecida',
    message: 'Tu contraseña ha sido cambiada correctamente'
  })
}

export {
  loginForm,
  login,
  signupForm,
  confirmAccount,
  recoveryForm,
  recovery,
  checkToken,
  newPassword
}
