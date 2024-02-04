
// {/* console.log(mapToken); */}
mapboxgl.accessToken =mapToken ;

const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v12',
        center: listing.geometry.coordinates, // starting position [lng, lat]
        zoom: 13 // starting zoom
});




const marker=new mapboxgl.Marker({ color: 'black', rotation: 45 })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset:25})
    .setHTML(`<br><h5><B>${listing.location},${listing.country}</b></h5><p>Exact location provided after booking</p>`)
    .addTo(map)
)
  .addTo(map);


