const isSeller = (userId, propertyUserId) => {
  return userId === propertyUserId
}

const formatDate = (date) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  const dateString = new Date(date.toISOString().split('T')).toLocaleDateString(
    'es-ES',
    options
  )

  return dateString.charAt(0).toUpperCase() + dateString.slice(1)
}

const formatTime = (date) => {
  return date.toISOString().split('T')[1].split('.')[0]
}

export { isSeller, formatDate, formatTime }
