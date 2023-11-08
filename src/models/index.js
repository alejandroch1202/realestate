import Property from './Property.js'
import Category from './Category.js'
import Price from './Price.js'
import User from './User.js'

// A property has one price
Price.hasOne(Property) // OR Property.belongsTo(Price)

// A property has one category
Category.hasOne(Property) // OR Property.belongsTo(Category)

// A property has one user
User.hasOne(Property) // OR Property.belongsTo(User) ?

export { Property, Category, Price, User }
