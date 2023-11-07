import db from './../src/config/db.js'
import Category from './../src/models/Category.js'
import Price from './../src/models/Price.js'
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
    await Promise.all([
      Category.destroy({ where: {}, truncate: true }),
      Price.destroy({ where: {}, truncate: true })
    ])
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
