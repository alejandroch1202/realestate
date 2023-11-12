;(function () {
  const lat = 10.3371022
  const lng = -68.7335184
  const map = L.map('map-home').setView([lat, lng], 13)
  let markers = new L.FeatureGroup().addTo(map)
  let properties = []

  // Filters
  const filters = {
    category: '',
    price: ''
  }

  const categories = document.querySelector('#categories')
  const prices = document.querySelector('#prices')

  categories.addEventListener('change', (e) => {
    filters.category = Number(e.target.value)
    filterProperties()
  })
  prices.addEventListener('change', (e) => {
    filters.price = Number(e.target.value)
    filterProperties()
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  const listProperties = async () => {
    try {
      const url = '/api/properties'
      const result = await fetch(url)
      properties = await result.json()
      showProperties(properties)
    } catch (error) {
      console.log(error)
    }
  }

  const showProperties = async (properties) => {
    // Clean previous markers
    markers.clearLayers()

    properties.forEach((property) => {
      // Add pins
      const marker = new L.marker([property?.lat, property?.lng], {
        autoPan: true
      }).addTo(map).bindPopup(`
      <p class="text-indigo-600 font-bold">${property.category.name}</p>
        <h1 class="text-xl font-extrabold uppercase my-2">${property?.title}</h1>
        <img src="/uploads/${property?.image}" alt="Imagen de ${property.title}">
        <p class="text-gray-600 font-bold">${property.price.range}</p>
        <a href="/properties/${property?.id}" class="block bg-indigo-600 hover:bg-indigo-700 text-center font-bold uppercase py-2 px-4 rounded-md">Ver Propiedad</a>
        `)

      markers.addLayer(marker)
    })
  }

  const filterProperties = () => {
    const result = properties.filter(filterByCategory).filter(filterByPrice)
    showProperties(result)
  }

  const filterByCategory = (property) => {
    return filters.category
      ? property.categoryId === filters.category
      : property
  }

  const filterByPrice = (property) => {
    return filters.price ? property.priceId === filters.price : property
  }

  listProperties()
})()
