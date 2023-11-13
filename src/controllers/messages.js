import { Property, Message, User } from './../models/index.js'
import { formatDate, formatTime } from '../helpers/index.js'

const showMessages = async (req, res) => {
  const { id } = req.params

  // Validate that the property exists
  const property = await Property.findByPk(id, {
    include: [
      {
        model: Message,
        as: 'messages',
        include: [{ model: User.scope('cleanSensible'), as: 'user' }]
      }
    ]
  })

  if (!property) {
    return res.redirect('/properties')
  }

  // Validate that the property is owned by the user
  if (property.userId.toString() !== req.user.id.toString()) {
    return res.redirect('/properties')
  }

  res.render('properties/messages', {
    page: 'Mensajes',
    messages: property.messages,
    formatDate,
    formatTime
  })
}

export { showMessages }
