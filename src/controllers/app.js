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

const categories = async (req, res) => {
  const { id } = req.params
  const category = await Category.findByPk(id)

  // Validate that the category exists
  if (!category) {
    return res.redirect('/404')
  }

  // Get the properties of the category
  const properties = await Property.findAll({
    where: { categoryId: id },
    include: [{ model: Price, as: 'price' }]
  })

  res.render('category', {
    page: `${category.name}${
      category.name === 'Almacen' ? 'es' : 's'
    } en Venta`,
    properties
  })
}

const notFound = (req, res) => {
  res.render('404', {
    page: 'No encontrado'
  })
}

const search = (req, res) => {}

export { home, categories, notFound, search }
