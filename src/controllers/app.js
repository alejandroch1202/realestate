const home = (req, res) => {
  return res.render('home', {
    page: 'Inicio'
  })
}

const categories = (req, res) => {}

const notFound = (req, res) => {}

const search = (req, res) => {}

export { home, categories, notFound, search }
