const express = require('express');
const app = express();
const config = require('./config/config');

app.set('view engine', 'ejs');
app.use(express.static('public'));

const araclar = [
  { plaka: '34AAA001', rota: 'İstanbul - Münih' },
  { plaka: '34AAA002', rota: 'İstanbul - Trieste' },
  { plaka: '34AAA003', rota: 'İzmir - Bükreş' },
  { plaka: '34AAA004', rota: 'Mersin - İstanbul' },
  { plaka: '34AAA005', rota: 'Ankara - Paris' }
];

app.get('/', (req, res) => {
  res.render('index', { araclar });
});

app.listen(config.PORT, function(err){
  if(err){
      return console.log("An error occured.");
  }
  console.log(`Server started on http://localhost:${config.PORT}`);
});
