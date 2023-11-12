import jwt from 'jsonwebtoken'
import User from './../models/User.js'

const identifyUser = async (req, res, next) => {
  // Identify if is there a cookie
  const { _token } = req.cookies
  if (!_token) {
    req.user = null
    return next()
  }

  // Check the token
  try {
    const decoded = jwt.verify(_token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.sub)
    req.user = user
    next()
  } catch (error) {
    console.log(error)
    return res.clearCookie('_token').redirect('/auth/login')
  }
}

export default identifyUser
