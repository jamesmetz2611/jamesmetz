let map;
let infowindow;

function initMap() {
    const locations = [
        { name: "Vanderbilt University", query: "Vanderbilt University, Nashville, TN", info: 'My alma mater. Beautiful campus and arboretum.'},
        { name: "Mother's Ruin", query: "Mother's Ruin, Nashville, TN", info: 'Local spot for a fun Friday night. Great food and drink!' },
        { name: "The Parthenon", query: "The Parthenon, Nashville, TN", info: 'Perfect spot for a Sunday stroll or game of grass volleyball.' },
        { name: "Lakeside Lounge", query: "Lakeside Lounge, Nashville, TN", info: 'Great spot for playing darts and pool!' },
        { name: "Tailgate Brewery", query: "Tailgate Brewery, Demonbruen", info: 'Always grab a group of friends for Thursday night trivia!' },
        { name: "Siam Cafe", query: "Siam Cafe, Nashville, TN", info: "Best pad thai in town!!!" },
        { name: "Crema Coffee", query: "Crema, Nashville, TN", info: "My go-to for all things coffee." },
        { name: "Greenhouse Bar", query: "Greenhouse Bar, Nashville, TN", info: 'Incredible botanical ambiance and great selection of cocktails!'}
    ];

    const nashville = new google.maps.LatLng(36.162834343438384, -86.78170545857678);
    
    infowindow = new google.maps.InfoWindow();
    map = new google.maps.Map(document.getElementById("map"), {
        center: nashville,
        zoom: 12,
    });

    locations.forEach(location => {
        const request = {
            query: location.query,
            fields: ["name", "geometry", "formatted_address", "rating", "photos"],
        };

        const service = new google.maps.places.PlacesService(map);
        service.findPlaceFromQuery(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                createMarker(results[0], location.info); // Pass the custom info field
            }
        });
    });
}

function createMarker(place, customInfo) {
    if (!place.geometry || !place.geometry.location) return;

    const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
    });

    google.maps.event.addListener(marker, "click", () => {
        const photoUrl = place.photos && place.photos.length > 0 
            ? place.photos[0].getUrl({ maxWidth: 300, maxHeight: 200 })
            : null;

        const content = `
            <div>
                <strong>${place.name || "No name available"}</strong><br>
                <p>Address: ${place.formatted_address || "No address available"}</p>
                <p>Rating: ${place.rating ? place.rating + " ★" : "No rating available"}</p>
                <p>${customInfo || "No additional info available"}</p>
                ${photoUrl ? `<img src="${photoUrl}" alt="${place.name}" style="width:100%; height:auto;"><br>` : ""}
            </div>
        `;
        infowindow.setContent(content);
        infowindow.setPosition(place.geometry.location);
        infowindow.open(map);
    });
}

window.initMap = initMap;
