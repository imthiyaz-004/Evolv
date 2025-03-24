// Empty for now, as location.js handles all location-related tasks.
let map;
let service;
let infowindow;

function initMap(lat, lng) {
    const userLocation = new google.maps.LatLng(lat, lng); // Dynamic location
    map = new google.maps.Map(document.getElementById("map"), {
      center: userLocation,
      zoom: 15,
    });
    infowindow = new google.maps.InfoWindow();
  }

  function getUserLocation(callback) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          callback(lat, lng); // Pass dynamic location to callback
        },
        () => {
          alert("Could not fetch location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }
  
 

  function findNearbyPlaces() {
    getUserLocation((lat, lng) => {
      initMap(lat, lng);   // Initialize map with dynamic user location
        const task = prompt("Enter your task (e.g., buy groceries, haircut):");

        let placeType = "";
        if (task.toLowerCase().includes("grocer") || task.toLowerCase().includes("shop")) {
            placeType = "supermarket";
        } else if (task.toLowerCase().includes("haircut") || task.toLowerCase().includes("salon")) {
            placeType = "hair_care";
        } else if (task.toLowerCase().includes("coffee")) {
            placeType = "cafe";
        } else {
            alert("Task not recognized. Try 'groceries', 'haircut', or 'coffee'.");
            return;
        }

        const request = {
            location: new google.maps.LatLng(lat, lng), // Use dynamic location here
            radius: 1500,
            type: [placeType],
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
                for (let i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                }
            } else {
                alert("No places found nearby for your task.");
            }
        });
    });
}

function createMarker(place) {
    const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
    });

    google.maps.event.addListener(marker, "click", () => {
        infowindow.setContent(place.name);
        infowindow.open(map, marker);
    });
}
