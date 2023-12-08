import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { unlink } from 'node:fs/promises'
import { validationResult } from 'express-validator'
import { Property, Category, Price, Message, Image } from './../models/index.js'
import { isSeller } from '../helpers/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const admin = async (req, res) => {
  // Read the query string
  const { page: currentPage } = req.query
  const regex = /^[1-9]$/
  if (!regex.test(currentPage)) {
    return res.redirect('/properties?page=1')
  }

  try {
    const { id } = req.user

    // Limit and offset
    const limit = 10
    const offset = currentPage * limit - limit

    const [properties, total] = await Promise.all([
      Property.findAll({
        limit,
        offset,
        where: { userId: id },
        include: [
          { model: Category, as: 'category' },
          { model: Price, as: 'price' },
          { model: Message, as: 'messages' }
        ]
      }),
      Property.count({
        where: { userId: id }
      })
    ])

    res.render('properties/admin', {
      page: 'Mis Propiedades',
      csrfToken: req.csrfToken(),
      properties,
      pages: Math.ceil(total / limit),
      currentPage: Number(currentPage),
      total,
      limit,
      offset
    })
  } catch (error) {
    console.log(error)
  }
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
    const images = req.files

    images.forEach(async (image) => {
      await Image.create({
        propertyId: id,
        url: image.filename
      })
    })

    property.image = images[0].filename
    property.published = 1
    await property.save()
    next()
  } catch (error) {
    console.log(error)
  }
}

const editForm = async (req, res) => {
  const { id } = req.params
  // Validate that the property exists
  const property = await Property.findByPk(id)
  if (!property) {
    return res.redirect('/properties')
  }

  // Validate that the user is owner of the property
  const user = req.user
  if (user.id.toString() !== property.userId.toString()) {
    return res.redirect('/properties')
  }

  // Query categories and prices
  const [categories, prices] = await Promise.all([
    Category.findAll(),
    Price.findAll()
  ])

  res.render('properties/edit', {
    page: `Editar propiedad: ${property.title}`,
    csrfToken: req.csrfToken(),
    categories,
    prices,
    data: property
  })
}

const edit = async (req, res) => {
  // Validation result
  const result = validationResult(req)
  if (!result.isEmpty()) {
    // Query categories and prices
    const [categories, prices] = await Promise.all([
      Category.findAll(),
      Price.findAll()
    ])

    return res.render('properties/edit', {
      page: 'Editar propiedad',
      csrfToken: req.csrfToken(),
      categories,
      prices,
      errors: result.array(),
      data: req.body
    })
  }

  const { id } = req.params
  // Validate that the property exists
  const property = await Property.findByPk(id)
  if (!property) {
    return res.redirect('/properties')
  }

  // Validate that the user is owner of the property
  const user = req.user
  if (user.id.toString() !== property.userId.toString()) {
    return res.redirect('/properties')
  }

  // Edit the entry
  try {
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

    property.set({
      title,
      description,
      categoryId,
      priceId,
      rooms,
      wc,
      garages,
      street,
      lat,
      lng
    })
    await property.save()

    res.redirect(`/properties/image/${id}`)
  } catch (error) {
    console.log(error)
  }
}

const remove = async (req, res) => {
  const { id } = req.params

  // Validate that the property exists
  const property = await Property.findByPk(id, {
    include: [{ model: Image, as: 'images' }]
  })
  if (!property) {
    return res.redirect('/properties')
  }

  // Validate that the user is owner of the property
  const user = req.user
  if (user.id.toString() !== property.userId.toString()) {
    return res.redirect('/properties')
  }

  // Delete associated images
  property.images.forEach(async (image) => {
    await unlink(path.join(__dirname, `./../../public/uploads/${image.url}`))
  })

  // Delete from the images table
  await Image.destroy({
    where: { propertyId: id }
  })

  // Delete the property
  await property.destroy()
  res.redirect('/properties')
}

const changeState = async (req, res) => {
  const { id } = req.params

  // Validate that the property exists
  const property = await Property.findByPk(id)
  if (!property) {
    return res.redirect('/properties')
  }

  // Validate that the user is owner of the property
  const user = req.user
  if (user.id.toString() !== property.userId.toString()) {
    return res.redirect('/properties')
  }

  // Change the state
  property.published = !property.published
  await property.save()

  res.json({ ok: true })
}

// Public routes
const showProperty = async (req, res) => {
  const { id } = req.params

  // Validate that the property exists
  const property = await Property.findByPk(id, {
    include: [
      { model: Category, as: 'category' },
      { model: Price, as: 'price' },
      { model: Image, as: 'images' }
    ]
  })
  if (!property) {
    return res.redirect('/404')
  }

  // Validate that the property is published
  if (!property.published) {
    return res.redirect('/404')
  }

  // Get all images from the property
  const images = property.images.map((image) => image.url)

  res.render('properties/show', {
    page: property.title,
    csrfToken: req.csrfToken(),
    property,
    images,
    user: req.user,
    isSeller: isSeller(req.user?.id, property.userId)
  })
}

const sendMessage = async (req, res) => {
  const { id } = req.params

  // Validate that the property exists
  const property = await Property.findByPk(id, {
    include: [
      { model: Category, as: 'category' },
      { model: Price, as: 'price' }
    ]
  })
  if (!property) {
    return res.redirect('/404')
  }

  // Validate that the property is published
  if (!property.published) {
    return res.redirect('/404')
  }

  // Validation result
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return res.render('properties/show', {
      page: property.title,
      csrfToken: req.csrfToken(),
      property,
      user: req.user,
      isSeller: isSeller(req.user?.id, property.userId),
      errors: result.array()
    })
  }

  // Save the message
  const { message } = req.body
  const { id: userId } = req.user
  const { id: propertyId } = property

  await Message.create({
    message,
    userId,
    propertyId
  })

  res.redirect('back')
}

export {
  admin,
  createForm,
  create,
  addImage,
  uploadImage,
  editForm,
  edit,
  remove,
  changeState,
  showProperty,
  sendMessage
}
