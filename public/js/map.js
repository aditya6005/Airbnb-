maptilersdk.config.apiKey = mapToken;

// Only initialize if we have valid coordinates
if (typeof coordinates !== 'undefined' && coordinates.length === 2) {
    const map = new maptilersdk.Map({
        container: 'map',
        style: maptilersdk.MapStyle.STREETS,
        center: coordinates,
        zoom: 10
    });

    new maptilersdk.Marker({ color: "red" })
        .setLngLat(coordinates)
        .addTo(map);
} else {
    // Optional: Hide the map div if no coordinates exist
    document.getElementById('map').style.display = 'none';
}

// maptilersdk.config.apiKey = mapToken;

// const map = new maptilersdk.Map({
//     container: 'map', // div ID
//     style: maptilersdk.MapStyle.STREETS,
//     center: [77.2090, 28.6139], // Delhi coordinates
//     zoom: 9
// });

// const marker = new maptilersdk.Marker({ color: "red" })
//     .setLngLat([77.2090, 28.6139])
//     .addTo(map);

// --------------------------------------------------------

    // const mapToken = "<%= process.env.MAP_TOKEN %>";
    // maptilersdk.config.apiKey = mapToken;

    // const map = new maptilersdk.Map({
    //     container: 'map',
    //     style: maptilersdk.MapStyle.STREETS,
    //     // Pull actual coordinates from your database
    //     center: <%- JSON.stringify(listing.geometry.coordinates) %>,
    //     zoom: 9
    // });

    // const marker = new maptilersdk.Marker({ color: "red" })
    //     .setLngLat(<%- JSON.stringify(listing.geometry.coordinates) %>)
    //     .addTo(map);
