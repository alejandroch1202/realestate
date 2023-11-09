import { validationResult } from 'express-validator'
import { Property, Category, Price } from './../models/index.js'

const admin = (req, res) => {
  res.render('properties/admin', {
    page: 'Mis Propiedades'
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

const addImage = async (req, res) => {
  const { id } = req.params
  // Validate that the property exists
  const property = await Property.findByPk(id)
  if (!property) {
    return res.redirect('/properties')
  }

  // Validate that the property is not published
  if (property.published) {
    return res.redirect('/properties')
  }

  // Validate that the property is owned by the user
  if (property.userId.toString() !== req.user.id.toString()) {
    return res.redirect('/properties')
  }

  res.render('properties/image', {
    page: `Agregar imagen: ${property.title}`,
    csrfToken: req.csrfToken(),
    property
  })
}

const uploadImage = async (req, res, next) => {
  const { id } = req.params
  // Validate that the property exists
  const property = await Property.findByPk(id)
  if (!property) {
    return res.redirect('/properties')
  }

  // Validate that the property is not published
  if (property.published) {
    return res.redirect('/properties')
  }

  // Validate that the property is owned by the user
  if (property.userId.toString() !== req.user.id.toString()) {
    return res.redirect('/properties')
  }
  try {
    // Store the image and publish the property
    property.image = req.file.filename
    property.published = 1
    await property.save()
    next()
  } catch (error) {
    console.log(error)
  }
}

export { admin, createForm, create, addImage, uploadImage }
