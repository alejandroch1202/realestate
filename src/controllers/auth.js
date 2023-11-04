import User from './../models/User.js'

const loginForm = (req, res) => {
  res.render('auth/login', {
    page: 'Iniciar sesión'
  })
}

const signupForm = (req, res) => {
  res.render('auth/signup', {
    page: 'Crear cuenta'
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
    page: 'Recuperar contraseña'
  })
}

export { loginForm, signupForm, confirmAccount, recoveryForm }
