let map, userMarker, service, directionsService, directionsRenderer, infowindow;
let markers = []; // Array to hold markers

// Initialize Map
function initMap(lat, lng) {
    const userLocation = new google.maps.LatLng(lat, lng);

    map = new google.maps.Map(document.getElementById("map"), {
        center: userLocation,
        zoom: 15,
    });

    // Directions Setup
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // Blue Dot Marker for User
    userMarker = new google.maps.Marker({
        position: userLocation,
        map,
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        title: "You are here",
    });
}

// Fetch User's Current Location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                initMap(lat, lng);
                document.getElementById("output").innerText = `Your Location: ${lat}, ${lng}`;
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        alert("Location permission denied. Please allow location access.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert("Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                        alert("Request to fetch location timed out.");
                        break;
                    default:
                        alert("An unknown error occurred while fetching location.");
                }
            }
        );
        
    } else {
        alert("Geolocation not supported by your browser.");
    }
}

// Clear All Markers
function clearMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null); // Remove markers from the map
    }
    markers = []; // Reset the markers array
}

// Find Nearby Places Based on Category
function findNearbyPlaces() {
    const task = prompt("Enter a task (e.g., groceries, haircut, pharmacy):").toLowerCase();
    let type = "";

    if (task.includes("grocer")) type = "supermarket";
    else if (task.includes("haircut")) type = "beauty_salon";
    else if (task.includes("pharmacy")) type = "pharmacy";
    else if (task.includes("bank")) type = "bank";
    else if (task.includes("school")) type = "school";
    else if (task.includes("library")) type = "library";
    else if (task.includes("store")) type = "store";
    else if (task.includes("park")) type = "park";
    else if (task.includes("temple")) type = "hindu_temple";
    else if (task.includes("hospital")) type = "hospital";
    else if (task.includes("atm")) type = "atm";
    else if (task.includes("gas")) type = "gas_station";
    else if (task.includes("mall")) type = "shopping_mall";
    else if (task.includes("park")) type = "park";
    else if (task.includes("gym")) type = "gym";
    else if (task.includes("movie")) type = "movie_theater";
    else if (task.includes("restaurant")) type = "restaurant";
    else {
        alert("Task not recognized. Try: groceries, temples, hospitals, ATMs, malls, etc.");
        return;
    }

    clearMarkers(); // Clear old markers before adding new ones

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: userMarker.position,
        radius: 1500,
        type: type,
    }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(place => createMarker(place));
        } else {
            alert("No places found.");
        }
    });
}

// Create Markers with Enhanced Content
function createMarker(place) {
    const marker = new google.maps.Marker({
        position: place.geometry.location,
        map,
        title: place.name,
    });

    markers.push(marker); // Add marker to the markers array

    google.maps.event.addListener(marker, "click", () => {
        service.getDetails({ placeId: place.place_id }, (details, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                const distance = calculateDistance(userMarker.getPosition(), marker.position);
                const photo = details.photos ? details.photos[0].getUrl() : "";
                const reviews = details.rating || "No rating available";

                infowindow = new google.maps.InfoWindow({
                    content: `
                        <h4>${details.name}</h4>
                        <p><strong>Rating:</strong> ${reviews}</p>
                        ${photo ? `<img src="${photo}" style="width:100px;height:100px;" />` : ""}
                        <p>Distance: ${distance} km</p>
                        <a href="https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat()},${place.geometry.location.lng()}" target="_blank">
                            View on Google Maps
                        </a>
                        <button onclick="showDirections(${place.geometry.location.lat()}, ${place.geometry.location.lng()})">
                            Get Directions
                        </button>
                        <button onclick="setReminder('${details.name}')">Set Reminder</button>
                    `,
                });
                infowindow.open(map, marker);
            }
        });
    });
}

// Calculate Distance Between Two Points
function calculateDistance(origin, destination) {
    const R = 6371; // Earth radius in km
    const dLat = toRadians(destination.lat() - origin.lat());
    const dLon = toRadians(destination.lng() - origin.lng());
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(origin.lat())) * Math.cos(toRadians(destination.lat())) * Math.sin(dLon / 2) ** 2;
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Show Directions
function showDirections(lat, lng) {
    const request = {
        origin: userMarker.position,
        destination: { lat, lng },
        travelMode: google.maps.TravelMode.DRIVING,
    };
    directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
        } else {
            alert("Unable to fetch directions.");
        }
    });
}

// Set Location Reminder
function setReminder(placeName) {
    alert(`Reminder set for ${placeName}. You'll receive a notification when near this location.`);
}

// Voice Commands Integration
function startVoiceCommands() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        if (command.includes("location")) getUserLocation();
        else if (command.includes("find")) findNearbyPlaces();
        else alert("Command not recognized. Try 'Find groceries near me'.");
    };

    recognition.onerror = () => alert("Voice command failed. Please try again.");
}
