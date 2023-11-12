import { Category, Price } from './../models/index.js'

const home = async (req, res) => {
  const [categories, prices] = await Promise.all([
    Category.findAll({ raw: true }),
    Price.findAll({ raw: true })
  ])

  return res.render('home', {
    page: 'Inicio',
    categories,
    prices
  })
}

const categories = (req, res) => {}

const notFound = (req, res) => {}

const search = (req, res) => {}

export { home, categories, notFound, search }
