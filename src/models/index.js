import Property from './Property.js'
import Category from './Category.js'
import Message from './Message.js'
import Price from './Price.js'
import User from './User.js'

// A property has one price
Property.belongsTo(Price)

// A property has one category
Property.belongsTo(Category)

// A property has one user
Property.belongsTo(User)

// A property has many messages
Property.hasMany(Message)

// A message has one property related
Message.belongsTo(Property)

// A message has one user
Message.belongsTo(User)

export { Property, Category, Price, User, Message }
