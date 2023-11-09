import { Dropzone } from 'dropzone'

const token = document.querySelector('#csrf').getAttribute('value')

Dropzone.options.images = {
  dictDefaultMessage: 'Sube tus imágenes aquí',
  acceptedFiles: '.jpeg,.jpg,.png',
  maxFilesize: 5,
  maxFiles: 1,
  parallelUploads: 1,
  autoProcessQueue: false,
  addRemoveLinks: true,
  dictRemoveFile: 'Quitar imagen',
  dictMaxFilesExceeded: 'No puedes subir mas de una imagen',
  headers: {
    'CSRF-Token': token
  },
  paramName: 'image',
  init: function () {
    const dropzone = this
    const publishButton = document.querySelector('#publish')
    publishButton.addEventListener('click', function () {
      dropzone.processQueue()
    })
    dropzone.on('queuecomplete', function () {
      if (dropzone.getActiveFiles().length === 0) {
        window.location.href = '/properties'
      }
    })
  }
}
