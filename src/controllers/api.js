import { Property, Category, Price } from './../models/index.js'

const properties = async (req, res) => {
  const properties = await Property.findAll({
    where: { published: 1 },
    include: [
      { model: Category, as: 'category' },
      { model: Price, as: 'price' }
    ]
  })

  res.json(properties)
  return properties
}

export { properties }
