const admin = (req, res) => {
  res.render('properties/admin', {
    page: 'Mis Propiedades',
    navigation: true
  })
}

const createForm = (req, res) => {
  res.render('properties/create', {
    page: 'Crear propiedad',
    navigation: true
  })
}

export { admin, createForm }
