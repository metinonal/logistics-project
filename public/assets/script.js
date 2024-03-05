// public/script.js

// Harita, rota çizici ve bilgi penceresi değişkenleri tanımlanır.
let map;
let directionsRenderer;
let infoWindow;

// Harita başlatma fonksiyonu
function initMap() {
  // Harita seçenekleri belirleniyor: Başlangıç merkezi ve yakınlaştırma seviyesi
  const mapOptions = {
    center: { lat: 41.0082, lng: 28.9784 }, // İstanbul koordinatları
    zoom: 6, // Yakınlaştırma seviyesi
  };

  // Harita oluşturuluyor ve belirlenen seçeneklerle ayarlanır
  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  // Yol tarifi çizicisi oluşturuluyor ve haritaya eklenir
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map, // Harita nesnesi ile ilişkilendirme
  });

  // Bilgi penceresi oluşturulur
  infoWindow = new google.maps.InfoWindow();
}

// Şu anki rota değişkeni tanımlanıyor, başlangıçta boş olarak atanır
let currentRoute = null;

// Rota gösterme fonksiyonu, plaka parametresi alır
function showRoute(plaka) {
  // Eğer şu an bir rota varsa, haritadan kaldır
  if (currentRoute) {
    currentRoute.setMap(null);
  }

  // Bilgi penceresi varsa kapat
  if (infoWindow) {
    infoWindow.close();
  }

  // Araç plakasına göre ilgili aracı bulur
  const arac = araclar.find(a => a.plaka === plaka);

  // Google Haritalar Yol Tarifi Servisi oluşturulur
  const directionsService = new google.maps.DirectionsService();

  // Rota üzerindeki noktaları tutacak dizi oluşturulur
  const waypoints = [];
  let totalDistance = 0;

  // Araç plakasına göre farklı rotalar belirlenir
  if (arac.plaka === '34AAA001') {
    waypoints.push({
      location: 'İstanbul, Turkey', // İstanbul, Türkiye
    }, {
      location: 'Munich, Germany', // Münih, Almanya
    });
  }
  if (arac.plaka === '34AAA002') {
    waypoints.push({
      location: 'İstanbul, Turkey', // İstanbul, Türkiye
    }, {
      location: 'Trieste, Italy', // Trieste, İtalya
    });
  }
  if (arac.plaka === '34AAA003') {
    waypoints.push({
      location: 'İstanbul, Turkey', // İstanbul, Türkiye
    }, {
      location: 'Bucharest, Romania', // Bükreş, Romanya
    });
  }
  if (arac.plaka === '34AAA004') {
    waypoints.push({
      location: 'Mersin, Turkey', // Mersin, Türkiye
    }, {
      location: 'İstanbul, Turkey', // İstanbul, Türkiye
    });
  }
  if (arac.plaka === '34AAA005') {
    waypoints.push({
      location: 'Ankara, Turkey', // Ankara, Türkiye
    }, {
      location: 'Paris, France', // Paris, Fransa
    });
  }

  // Yol tarifi isteği oluşturulur
  const request = {
    origin: waypoints[0].location, // Başlangıç noktası
    destination: waypoints[waypoints.length - 1].location, // Varış noktası
    waypoints: waypoints.slice(1, -1).map(waypoint => ({
      location: waypoint.location,
      stopover: true,
    })), // Ara noktalar ve duraklama ayarları
    travelMode: google.maps.TravelMode.DRIVING, // Seyahat modu: Araba ile
  };

  // Yol tarifi isteği gönderiliyor ve cevap alındığında çalışacak fonksiyon
  directionsService.route(request, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      // Yol tarifi bulunduğunda işlenecek veriler
      const route = response.routes[0];
      
      // Yeni bir çizgi oluşturuluyor ve haritaya eklenir
      currentRoute = new google.maps.Polyline({
        path: route.overview_path,
        geodesic: true,
        strokeColor: '#FF0000', // Çizgi rengi: Kırmızı
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });
      currentRoute.setMap(map);

      // Toplam mesafeyi hesaplamak için rota üzerindeki her aşama için mesafe eklenir
      for (let i = 0; i < route.legs.length; i++) {
        totalDistance += route.legs[i].distance.value;
      }
      
      // Toplam mesafeyi kilometre cinsinden hesaplayıp, bilgi penceresine eklenir
      const km = (totalDistance / 1000).toFixed(2);
      infoWindow.setContent(`Toplam Mesafe: ${km} km`);
      
      // Bilgi penceresi, haritanın ortasına yerleştiriliyor ve açılır
      infoWindow.setPosition(map.getCenter());
      infoWindow.open(map);
    } else {
      // Yol tarifi bulunamadığında uyarı penceresi gönderilir
      window.alert('Rota bulunamadı: ' + status);
    }
  });
}
