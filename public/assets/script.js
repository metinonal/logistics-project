// public/script.js
let map;
let directionsRenderer;
let infoWindow;

function initMap() {
  const mapOptions = {
    center: { lat: 41.0082, lng: 28.9784 },
    zoom: 6,
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
  });
  infoWindow = new google.maps.InfoWindow();
}

let currentRoute = null;

function showRoute(plaka) {
  if (currentRoute) {
    currentRoute.setMap(null);
  }

  if (infoWindow) {
    infoWindow.close();
  }

  const arac = araclar.find(a => a.plaka === plaka);
  
  const directionsService = new google.maps.DirectionsService();
  
  const waypoints = [];
  let totalDistance = 0;
  
  if (arac.plaka === '34AAA001') {
    waypoints.push({
      location: 'İstanbul, Turkey',
    }, {
      location: 'Munich, Germany',
    });
  } 
   if (arac.plaka === '34AAA002') {
    waypoints.push({
      location: 'İstanbul, Turkey',
    }, {
      location: 'Trieste, Italy',
    });
  }
  
   if (arac.plaka === '34AAA003') {
    waypoints.push({
      location: 'İstanbul, Turkey',
    }, {
      location: 'Bucharest, Romania',
    });
  }
  
   if (arac.plaka === '34AAA004') {
    waypoints.push({
      location: 'Mersin, Turkey',
    }, {
      location: 'İstanbul, Turkey',
    });
  }
  
   if (arac.plaka === '34AAA005') {
    waypoints.push({
      location: 'Ankara, Turkey',
    }, {
      location: 'Paris, France',
    });
  }
  
  const request = {
    origin: waypoints[0].location,
    destination: waypoints[waypoints.length - 1].location,
    waypoints: waypoints.slice(1, -1).map(waypoint => ({
      location: waypoint.location,
      stopover: true,
    })),
    travelMode: google.maps.TravelMode.DRIVING,
  };
  
  directionsService.route(request, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      const route = response.routes[0];
      currentRoute = new google.maps.Polyline({
        path: route.overview_path,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });
      currentRoute.setMap(map);

      for (let i = 0; i < route.legs.length; i++) {
        totalDistance += route.legs[i].distance.value;
      }
      const km = (totalDistance / 1000).toFixed(2);
      infoWindow.setContent(`Toplam Mesafe: ${km} km`);
      infoWindow.setPosition(map.getCenter());
      infoWindow.open(map);
    } else {
      window.alert('Rota bulunamadı: ' + status);
    }
  });
}
