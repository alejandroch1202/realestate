import Token from 'csrf'

const tokens = new Token()

const csrfToken = (req, res, next) => {
  const secret = process.env.CSRF_SECRET
  req.csrfToken = () => tokens.create(secret)
  next()
}

const csrfValidator = (req, res, next) => {
  const secret = process.env.CSRF_SECRET
  const { _csrf } = req.body
  const verify = tokens.verify(secret, _csrf)
  if (!verify) return res.status(422).send('Invalid token')
  next()
}

export { csrfToken, csrfValidator }
