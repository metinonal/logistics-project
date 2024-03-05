
# Bu rehber, server.js dosyasını çalıştırmak ve uygulamayı başlatmak için gerekli adımları içermektedir.

### Bu repoyu klonlayın veya ZIP olarak indirin.

```
git clone https://github.com/metinonal/logistics-project.git
```

### Gerekli paketleri yükleyin.

```
npm install
```

### server.js dosyasını çalıştırın.

```
nodemon server.js
```

### Tarayıcınızda şu adrese gidin:
```
http://localhost:3000
```

### Çalışan uygulamayı durdurmak için terminalde Ctrl + C tuşlarına basın ve işlemi sonlandırın.

## Google Haritalar ve Rotalama Uygulaması

### 1. Harita ve Rota Yönlendirici Tanımlamaları

```
'let map;': Google Harita nesnesini tutacak değişken.
'let directionsRenderer;': Yönleri haritada gösterecek olan nesne.
'let infoWindow;': Bilgi penceresi nesnesi.
```

### 2. Harita Başlatma Fonksiyonu: initMap()

```
function initMap() {
  const mapOptions = {
    center: { lat: 41.0082, lng: 28.9784 }, // Harita başlangıç merkezi: İstanbul
    zoom: 6, // Yakınlaştırma seviyesi
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions); // Harita oluşturma
  directionsRenderer = new google.maps.DirectionsRenderer({ map: map }); // Yönleri gösterme ayarı
  infoWindow = new google.maps.InfoWindow(); // Bilgi penceresi oluşturma
}
```

### 3. Şu Anki Rota Bilgisini Tutacak Değişken: currentRoute

let currentRoute = null;

### 4. Rota Gösterme Fonksiyonu: showRoute(plaka)

function showRoute(plaka) {
  if (currentRoute) {
    currentRoute.setMap(null); // Önceki rota varsa haritadan kaldır
  }

  if (infoWindow) {
    infoWindow.close(); // Bilgi penceresini kapat
  }

  // Verilen plaka bilgisine göre araç ve rotaları belirle
  const arac = araclar.find(a => a.plaka === plaka);
  
  const directionsService = new google.maps.DirectionsService(); // Rota hesaplama servisi
  
  const waypoints = []; // Ara noktalar (şehirler) listesi
  let totalDistance = 0; // Toplam mesafe

  // Plakaya göre farklı rota seçenekleri
  if (arac.plaka === '34AAA001') {
    waypoints.push({ location: 'İstanbul, Turkey' }, { location: 'Munich, Germany' });
  } 
  if (arac.plaka === '34AAA002') {
    waypoints.push({ location: 'İstanbul, Turkey' }, { location: 'Trieste, Italy' });
  }
  if (arac.plaka === '34AAA003') {
    waypoints.push({ location: 'İstanbul, Turkey' }, { location: 'Bucharest, Romania' });
  }
  if (arac.plaka === '34AAA004') {
    waypoints.push({ location: 'Mersin, Turkey' }, { location: 'İstanbul, Turkey' });
  }
  if (arac.plaka === '34AAA005') {
    waypoints.push({ location: 'Ankara, Turkey' }, { location: 'Paris, France' });
  }

  // Rota isteği oluşturma
  const request = {
    origin: waypoints[0].location,
    destination: waypoints[waypoints.length - 1].location,
    waypoints: waypoints.slice(1, -1).map(waypoint => ({
      location: waypoint.location,
      stopover: true,
    })),
    travelMode: google.maps.TravelMode.DRIVING,
  };

  // Rota isteği gönderme ve sonucu işleme
  directionsService.route(request, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      const route = response.routes[0];
      
      // Yeni rota çizimi
      currentRoute = new google.maps.Polyline({
        path: route.overview_path,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });
      currentRoute.setMap(map); // Haritaya rota ekleme

      // Toplam mesafeyi hesaplama
      for (let i = 0; i < route.legs.length; i++) {
        totalDistance += route.legs[i].distance.value;
      }
      const km = (totalDistance / 1000).toFixed(2); // Metreyi kilometreye çevirme
      infoWindow.setContent(`Toplam Mesafe: ${km} km`); // Bilgi penceresi içeriği
      infoWindow.setPosition(map.getCenter()); // Pencere konumu
      infoWindow.open(map); // Pencereyi açma
    } else {
      window.alert('Rota bulunamadı: ' + status); // Rota bulunamazsa uyarı verme
    }
  });
}


## Sonuç:

Bu kod, belirli araç plakalarına göre farklı rotalar oluşturur.
- initMap() haritayı oluşturur ve temel ayarları yapar.
- showRoute(plaka) fonksiyonu, seçilen araç plakasına bağlı olarak rota bilgilerini alır ve haritada gösterir.
- Rota oluşturulduğunda bilgi penceresi haritanın merkezinde açılır ve toplam mesafeyi gösterir.
