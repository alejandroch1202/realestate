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

const recoveryForm = (req, res) => {
  res.render('auth/recovery', {
    page: 'Recuperar contraseña'
  })
}

export { loginForm, signupForm, recoveryForm }
