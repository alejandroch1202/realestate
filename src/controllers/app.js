import { Category, Price, Property } from './../models/index.js'

const home = async (req, res) => {
  const [categories, prices, houses, apartments] = await Promise.all([
    Category.findAll({ raw: true }),
    Price.findAll({ raw: true }),
    Property.findAll({
      limit: 3,
      where: { categoryId: 1 },
      include: [{ model: Price, as: 'price' }],
      order: [['createdAt', 'DESC']]
    }),
    Property.findAll({
      limit: 3,
      where: { categoryId: 2 },
      include: [{ model: Price, as: 'price' }],
      order: [['createdAt', 'DESC']]
    })
  ])

  return res.render('home', {
    page: 'Inicio',
    categories,
    prices,
    houses,
    apartments
  })
}

const categories = (req, res) => {}

const notFound = (req, res) => {}

const search = (req, res) => {}

export { home, categories, notFound, search }
