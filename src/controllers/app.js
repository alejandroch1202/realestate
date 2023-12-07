import { Op } from 'sequelize'
import { Category, Price, Property } from './../models/index.js'

const home = async (req, res) => {
  const [categories, prices, houses, apartments] = await Promise.all([
    Category.findAll({ raw: true }),
    Price.findAll({ raw: true }),
    Property.findAll({
      limit: 3,
      where: { categoryId: 1, published: 1 },
      include: [{ model: Price, as: 'price' }],
      order: [['createdAt', 'DESC']]
    }),
    Property.findAll({
      limit: 3,
      where: { categoryId: 2, published: 1 },
      include: [{ model: Price, as: 'price' }],
      order: [['createdAt', 'DESC']]
    })
  ])

  return res.render('home', {
    page: 'Inicio',
    csrfToken: req.csrfToken(),
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
    where: { categoryId: id, published: 1 },
    include: [{ model: Price, as: 'price' }]
  })

  res.render('category', {
    page: `${category.name}${
      category.name === 'Galpon' || category.name === 'Local' ? 'es' : 's'
    } en Venta`,
    csrfToken: req.csrfToken(),
    properties
  })
}

const notFound = (req, res) => {
  res.render('404', {
    page: 'No encontrado',
    csrfToken: req.csrfToken()
  })
}

const search = async (req, res) => {
  // Validate that term is not void
  const { term } = req.body
  if (!term.trim()) {
    return res.redirect('back')
  }

  // Get the properties
  const properties = await Property.findAll({
    where: {
      published: 1,
      title: {
        [Op.like]: '%' + term + '%'
      }
    },
    include: [{ model: Price, as: 'price' }]
  })

  res.render('search', {
    page: 'Resultados de la búsqueda',
    csrfToken: req.csrfToken(),
    properties
  })
}

export { home, categories, notFound, search }
