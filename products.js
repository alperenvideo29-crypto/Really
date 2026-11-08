const BASE_PRICE=3000000;

const MODELS=[
  {id:'b2026',name:'REALLY B2026',tag:"Mayıs 2026'de Satışta",price:BASE_PRICE,img:MEDIA.sedan,coupon:null,
   desc:'Gümüş gövde, aerodinamik hatlar ve %100 elektrikli güç aktarımı. Geleceği, şimdiden sür.'},
  {id:'b2026-sport',name:'REALLY B2026 Sport',tag:'%20 İndirim Fırsatı',price:BASE_PRICE,img:MEDIA.sport,coupon:'KASIM20',
   desc:'Araba almanın tam zamanı: Kasım sonu fırsatıyla spor modelde %20 indirim.'}
];

/* Teknik değerler örnektir — gerçek verilerinizle değiştirin */
const SPECS=[
  {i:'⚡',k:'Güç aktarımı',v:'%100 Elektrikli',d:'Sıfır emisyon, anlık tork, sessiz sürüş.'},
  {i:'🧠',k:'Otonom Sürüş',v:'Seviye 3',d:'360° sensör ağı ve yapay zekâ destekli sürüş asistanı.'},
  {i:'🏁',k:'0–100 km/s',v:'3,9 sn',d:'Çift motorlu yapıyla dikkat çekici ivmelenme.'},
  {i:'🔋',k:'Menzil',v:'650 km',d:'Tek şarjla WLTP menzili.'},
  {i:'🔌',k:'Hızlı Şarj',v:'%10–80 · 18 dk',d:'800V mimari ile ultra hızlı DC şarj.'},
  {i:'🛡️',k:'Güç',v:'500 HP',d:'Çift motor, dört tekerlekten çekiş.'}
];

const COLORS=[{n:'Gümüş',c:'#c3cad2'},{n:'Beyaz',c:'#f4f4f4'},{n:'Siyah',c:'#111'},{n:'Kırmızı',c:'#d10a10'},{n:'Elektrik Mavisi',c:'#1fa2ff'}];
const CITIES=['İstanbul','Ankara','İzmir','Bursa','Antalya','Adana','Konya','Gaziantep','Kocaeli','Eskişehir','Diğer'];
