import { DataTypes } from 'sequelize'
import db from './../config/db.js'

const Price = db.define('prices', {
  range: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

export default Price
