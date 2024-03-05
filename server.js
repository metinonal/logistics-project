const express = require('express');
const app = express();
const config = require('./config/config');

// Express uygulamasında görünüm motoru olarak EJS kullanılacak şekilde ayarlanır.
app.set('view engine', 'ejs');

// Public klasörü statik dosya olarak kullanılır (CSS, JS dosyaları vb.)
app.use(express.static('public'));

// Araçlar listesi oluşturulur (Veritabanından çekilebilir, şimdilik statik veriler kullanılıyor)
const araclar = [
  { plaka: '34AAA001', rota: 'İstanbul - Münih' },
  { plaka: '34AAA002', rota: 'İstanbul - Trieste' },
  { plaka: '34AAA003', rota: 'İzmir - Bükreş' },
  { plaka: '34AAA004', rota: 'Mersin - İstanbul' },
  { plaka: '34AAA005', rota: 'Ankara - Paris' }
];

// Ana sayfa isteği geldiğinde, index.ejs şablonunu kullanarak araçlar listesini render et
app.get('/', (req, res) => {
  res.render('index', { araclar }); // index.ejs dosyasına araclar listesini gönderiyoruz
});

// Express uygulamasını belirlenen portta dinlemeye başla
app.listen(config.PORT, function(err){
  if(err){
      return console.log("An error occured."); // Hata oluşursa konsola yazdır
  }
  console.log(`Server started on http://localhost:${config.PORT}`); // Başlangıç mesajı konsola yazdırılıyor
});
