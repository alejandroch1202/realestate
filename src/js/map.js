;(function () {
  const lat = 10.3371022
  const lng = -68.7335184
  const map = L.map('map').setView([lat, lng], 13)
  let marker

  // Use provider and geocoder
  const geocoderService = L.esri.Geocoding.geocodeService()

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  // Add the pin
  marker = new L.marker([lat, lng], {
    draggable: true,
    autoPan: true
  }).addTo(map)

  // Detect the lat and lng of the marker
  marker.on('moveend', function (e) {
    marker = e.target
    const position = marker.getLatLng()
    map.panTo(new L.LatLng(position.lat, position.lng))

    // Get the streen info
    geocoderService
      .reverse()
      .latlng(position, 13)
      .run(function (error, result) {
        if (error) return console.error(error)
        marker.bindPopup(result.address.LongLabel)

        // Fill the fields
        document.querySelector('.street').textContent =
          result?.address?.Match_addr ?? ''
        document.querySelector('#street').value =
          result?.address?.Match_addr ?? ''
        document.querySelector('#lat').value = result?.latlng?.lat ?? ''
        document.querySelector('#lng').value = result?.latlng?.lng ?? ''
      })
  })
})()
