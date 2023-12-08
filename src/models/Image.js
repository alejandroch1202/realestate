import { DataTypes } from 'sequelize'
import db from './../config/db.js'

const Image = db.define('images', {
  url: {
    type: DataTypes.STRING(200),
    allowNull: false
  }
})

export default Image
