import nodemailer from 'nodemailer'

const emailSignup = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })
  const { email, name, token } = data

  // Send email
  await transport.sendMail({
    from: 'noreply@bienesraices.com',
    to: email,
    subject: 'Confirma tu cuenta en BienesRaices.com',
    text: 'Confirmar cuenta',
    html: `<p>Hola ${name}, comprueba tu cuenta en bienesraices.com</p>
          <p>Tu cuenta has sido creada, ahora debes confirmarla con el siguiente enlace:
          <a href="${process.env.BACKEND_URL}:${
      process.env.PORT ?? 3000
    }/auth/confirm/${token}">Confirmar cuenta</a></p>
          <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
          `
  })
}

const emailRecovery = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })
  const { email, name, token } = data

  // Send email
  await transport.sendMail({
    from: 'noreply@bienesraices.com',
    to: email,
    subject: 'Restablece tu contraseña en BienesRaices.com',
    text: 'Restablecer contraseña',
    html: `<p>Hola ${name}, solicitaste restablecer tu contraseña en bienesraices.com</p>
          <p>Haz click en el siguiente enlace para generar una nueva contraseña:
          <a href="${process.env.BACKEND_URL}:${
      process.env.PORT ?? 3000
    }/auth/recovery/${token}">Restablecer contraseña</a></p>
          <p>Si tu no solicitaste un cambio de contraseña, puedes ignorar este mensaje</p>
          `
  })
}

export { emailSignup, emailRecovery }
