mapboxgl.accessToken = 'pk.eyJ1IjoiZWxiZXJ0d2FuZyIsImEiOiJjajk3dmw4amUwYmV2MnFydzl3NDIyaGFpIn0.46xwSuceSuv2Fkeqyiy0JQ';
console.log("getting here?")
var map = new mapboxgl.Map({
    container: 'routesdiv',
    zoom: 13,
    center: [86.925278,27.988056],
    style: 'mapbox://styles/mapbox/satellite-v9',
    //style: 'mapbox://styles/mapbox/outdoors-v9',
    hash: false,
    //pitch: 60,
    //bearing: 30
});