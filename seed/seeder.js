import db from './../src/config/db.js'
import { User, Category, Price } from './../src/models/index.js'
import users from './users.js'
import categories from './categories.js'
import prices from './prices.js'

const importData = async () => {
  try {
    // Authenticate in the database
    await db.authenticate()

    // Generate columns
    await db.sync()

    // Insert data
    await Promise.all([
      User.bulkCreate(users),
      Category.bulkCreate(categories),
      Price.bulkCreate(prices)
    ])
    console.log('Data sucessfully imported')
    process.exit()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

const deleteData = async () => {
  try {
    // Delete data
    // await Promise.all([
    //   Category.destroy({ where: {}, truncate: true }),
    //   Price.destroy({ where: {}, truncate: true })
    // ])
    await db.sync({ force: true })
    console.log('Data sucessfully deleted')
    process.exit()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

if (process.argv[2] === '-i') {
  importData()
}

if (process.argv[2] === '-d') {
  deleteData()
}
