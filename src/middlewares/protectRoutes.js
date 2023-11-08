import jwt from 'jsonwebtoken'
import { User } from './../models/index.js'

const protectRoutes = async (req, res, next) => {
  // Verify if there is a token
  const { _token } = req.cookies
  if (!_token) {
    return res.redirect('/auth/login')
  }

  // Verify token
  try {
    const decoded = jwt.verify(_token, process.env.JWT_SECRET)
    const user = await User.scope('cleanSensible').findByPk(decoded.sub)
    // Add user to the req
    if (user) {
      req.user = user
    } else {
      return res.redirect('/auth/login')
    }
    return next()
  } catch (error) {
    return res.clearCookie('_token').redirect('/auth/login')
  }
}

export default protectRoutes
