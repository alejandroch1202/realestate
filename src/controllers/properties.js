import { validationResult } from 'express-validator'
import { Property, Category, Price } from './../models/index.js'

const admin = (req, res) => {
  res.render('properties/admin', {
    page: 'Mis Propiedades',
    navigation: true
  })
}

const createForm = async (req, res) => {
  // Query categories and prices
  const [categories, prices] = await Promise.all([
    Category.findAll(),
    Price.findAll()
  ])

  res.render('properties/create', {
    page: 'Crear propiedad',
    csrfToken: req.csrfToken(),
    navigation: true,
    categories,
    prices,
    data: {}
  })
}

const create = async (req, res) => {
  // Validation result
  const result = validationResult(req)
  if (!result.isEmpty()) {
    // Query categories and prices
    const [categories, prices] = await Promise.all([
      Category.findAll(),
      Price.findAll()
    ])

    return res.render('properties/create', {
      page: 'Crear propiedad',
      csrfToken: req.csrfToken(),
      navigation: true,
      categories,
      prices,
      errors: result.array(),
      data: req.body
    })
  }
  // Create an entry
  const {
    title,
    description,
    category: categoryId,
    price: priceId,
    rooms,
    wc,
    garages,
    street,
    lat,
    lng
  } = req.body

  const { id: userId } = req.user

  try {
    const property = await Property.create({
      title,
      description,
      categoryId,
      priceId,
      rooms,
      wc,
      garages,
      street,
      lat,
      lng,
      userId,
      image: ''
    })
    const { id } = property
    res.redirect(`/properties/image/${id}`)
  } catch (error) {
    console.log(error)
  }
}

export { admin, createForm, create }
