import jwt from 'jsonwebtoken'

const generateId = () => {
  return Math.random().toString(32).substring(2) + Date.now().toString(32)
}

const generateJWT = (data) => {
  const secret = process.env.JWT_SECRET
  return jwt.sign(
    {
      sub: data.id,
      name: data.name
    },
    secret,
    {
      expiresIn: '1d'
    }
  )
}

export { generateId, generateJWT }
