import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Alejandro',
    email: 'me@me.com',
    confirmed: 1,
    password: bcrypt.hashSync('123456', 10)
  }
]

export default users
