;(function () {
  const changeStatusProperty = async (e) => {
    try {
      const token = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute('content')
      const { propertyId: id } = e.target.dataset
      const url = `/properties/${id}`
      const options = {
        method: 'PATCH',
        headers: {
          'CSRF-Token': token
        }
      }
      const response = await fetch(url, options)
      const result = await response.json()

      // document.location.reload()

      if (result.ok) {
        if (e.target.classList.contains('bg-yellow-100')) {
          e.target.classList.remove('bg-yellow-100', 'text-yellow-800')
          e.target.classList.add('bg-green-100', 'text-green-800')
          e.target.textContent = 'Publicado'
        } else {
          e.target.classList.remove('bg-green-100', 'text-green-800')
          e.target.classList.add('bg-yellow-100', 'text-yellow-800')
          e.target.textContent = 'No publicado'
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const changeStatusButtons = document.querySelectorAll('.change-status')

  changeStatusButtons.forEach((button) => {
    button.addEventListener('click', changeStatusProperty)
  })
})()
