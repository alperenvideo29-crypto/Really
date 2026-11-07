"use strict";

/* =====================================================
   LGS Türkçe Oyun ve Soru Portalı - script.js
   Alanlar: unit (ünite), q (soru), o (şıklar),
            a (doğru şık: 0=A, 1=B, 2=C, 3=D),
            exp (çözüm), tip (püf noktası)
   ===================================================== */

const QUESTIONS = [
  /* ---------- 1. SÖZCÜKTE VE SÖZ ÖBEKLERİNDE ANLAM ---------- */
  {
    unit: "Sözcükte Anlam",
    q: "Aşağıdaki deyimlerden hangisinin açıklaması <b>yanlıştır</b>?",
    o: [
      "Göz kulak olmak: Bir kişiyi ya da şeyi dikkatle gözetmek",
      "Pot kırmak: Yersiz söz ya da davranışla karşısındakini üzmek",
      "Ağzı sulanmak: Bir şeyi çok arzulamak, imrenmek",
      "Burun kıvırmak: Bir şeyi çok beğenip değer vermek"
    ],
    a: 3,
    exp: "Burun kıvırmak, bir şeyi beğenmemek ve küçümsemek demektir. Diğer üç deyimin açıklaması doğrudur.",
    tip: "Deyim sorularında sözcüklerin gerçek anlamına değil, kalıplaşmış anlamına bak."
  },
  {
    unit: "Sözcükte Anlam",
    q: "“Damlaya damlaya göl olur.” atasözü aşağıdakilerden hangisini anlatır?",
    o: [
      "Küçük birikimler zamanla büyük sonuçlar doğurur.",
      "Her işin yapılması gereken bir zamanı vardır.",
      "Başkalarının işine karışmamak gerekir.",
      "İnsan, arkadaşına bakılarak tanınır."
    ],
    a: 0,
    exp: "Damla küçük ve sürekli birikimi, göl ise ulaşılan büyük sonucu simgeler. Atasözü; tasarruf, sabır ve devamlılık öğüdü verir.",
    tip: "Atasözlerinde benzetilen ile anlatılmak istenen arasındaki bağı kur: damla → küçük, göl → büyük."
  },
  {
    unit: "Sözcükte Anlam",
    q: "Aşağıdaki cümlelerin hangisinde altı çizili sözcük <b>mecaz anlamda</b> kullanılmıştır?",
    o: [
      "Kamyonet, <u>ağır</u> yükü zor taşıdı.",
      "Çocuk, <u>soğuk</u> sudan hemen çıktı.",
      "<u>Tatlı</u> bir dille anlatınca herkes yumuşadı.",
      "Fırından <u>sıcak</u> ekmek aldık."
    ],
    a: 2,
    exp: "“Tatlı dil”, tat duyusuyla değil, nazik ve yumuşak konuşmayla ilgilidir. Diğer seçeneklerde ağırlık, soğukluk ve sıcaklık gerçek anlamıyla kullanılmıştır.",
    tip: "Sözcüğü duyularınla (tat, ağırlık, sıcaklık) algılayabiliyorsan gerçek anlamdadır; algılayamıyorsan mecaz olabilir."
  },

  /* ---------- 2. CÜMLEDE ANLAM ---------- */
  {
    unit: "Cümlede Anlam",
    q: "Aşağıdaki cümlelerin hangisinde <b>amaç-sonuç</b> ilişkisi vardır?",
    o: [
      "Çok çalıştığı için sınavda başarılı oldu.",
      "Sınavda başarılı olmak için çok çalıştı.",
      "Çok çalışırsa sınavda başarılı olacak.",
      "Sınavda başarılı olmasına rağmen çalışmayı bıraktı."
    ],
    a: 1,
    exp: "B’de “başarılı olmak” henüz gerçekleşmemiş bir hedeftir ve çalışma eylemi bu hedef için yapılır. A neden-sonuç, C koşul, D karşıtlık ilişkisi içerir.",
    tip: "“İçin” sözcüğüne dikkat: -mak için → amaç, -dığı için → neden bildirir."
  },
  {
    unit: "Cümlede Anlam",
    q: "“Başarı, yalnızca yetenekle değil, düzenli çalışmayla da kazanılır.”\n\nBu cümleden aşağıdakilerden hangisi <b>çıkarılamaz</b>?",
    o: [
      "Başarıda çalışmanın da payı vardır.",
      "Yetenek, başarı için tek başına yeterli değildir.",
      "Yeteneği olmayan kişi hiçbir zaman başarılı olamaz.",
      "Düzenli çalışma, başarıyı olumlu etkiler."
    ],
    a: 2,
    exp: "Cümle yeteneği yok saymaz; yalnızca tek başına yetmediğini, çalışmanın da gerektiğini söyler. C seçeneği “hiçbir zaman” diyerek cümlede olmayan kesin bir yargı ekler.",
    tip: "“Çıkarılamaz” sorularında “hiçbir zaman, asla, her zaman” gibi kesin ifadeli ve metinde karşılığı olmayan seçeneğe şüpheyle bak."
  },
  {
    unit: "Cümlede Anlam",
    q: "Aşağıdaki cümlelerin hangisinde <b>nesnel</b> (kanıtlanabilir) bir yargı vardır?",
    o: [
      "İstanbul, dünyanın en güzel şehridir.",
      "Türkiye’nin en uzun akarsuyu Kızılırmak’tır.",
      "Bu film, yılın en etkileyici yapımı olmuş.",
      "Sabah erken kalkmak insanı mutlu eder."
    ],
    a: 1,
    exp: "Kızılırmak’ın en uzun akarsu olması ölçülerek doğrulanabilir; kişiden kişiye değişmez. Diğerlerinde “güzel, etkileyici, mutlu” gibi kişisel değerlendirmeler vardır.",
    tip: "Cümleyi bir kaynaktan doğrulayabiliyorsan nesnel, tartışmaya açıksa öznel yargıdır."
  },

  /* ---------- 3. PARÇADA ANLAM ---------- */
  {
    unit: "Parçada Anlam",
    q: "Kitaplar, bizi hiç görmediğimiz ülkelere ve çağlara götüren sessiz yol arkadaşlarıdır. Bir sayfayı çevirdiğimizde kendimizi bambaşka bir hayatın içinde buluruz. Üstelik bu yolculuk için ne bilet gerekir ne de valiz. Okuyan kişi, evinden hiç çıkmadan dünyayı dolaşmış olur.\n\nBu parçanın <b>ana düşüncesi</b> aşağıdakilerden hangisidir?",
    o: [
      "Gezmek için para harcamak gerekir.",
      "Her kitap okuyucuda aynı etkiyi bırakmaz.",
      "Gezip görmek, okumaktan daha öğreticidir.",
      "Kitap okumak, kişiye farklı dünyaları tanıma fırsatı sunar."
    ],
    a: 3,
    exp: "Bilet ve valiz gibi ayrıntılar yardımcı düşüncedir. Yazarın asıl vurgusu, okumanın insanı farklı dünyalarla buluşturduğudur.",
    tip: "Ana düşünce çoğu zaman ilk ya da son cümlede toplanır; ayrıntıyı değil, parçanın tümünü kapsayan yargıyı seç."
  },
  {
    unit: "Parçada Anlam",
    q: "(I) Arılar, doğadaki en düzenli çalışan canlılardandır. (II) Kovanın içinde her arının belirli bir görevi vardır. (III) Bal, insan sağlığı için oldukça yararlı bir besindir. (IV) Kimi arılar polen toplar, kimileri de kovanı korur. (V) Böylece koloni, görev paylaşımı sayesinde uyum içinde yaşar.\n\nNumaralanmış cümlelerden hangisi <b>düşüncenin akışını bozmaktadır</b>?",
    o: ["III", "II", "IV", "V"],
    a: 0,
    exp: "Parçanın konusu arıların düzeni ve görev paylaşımıdır. III. cümle, balın insan sağlığına yararından söz ederek konudan uzaklaşır.",
    tip: "Önce parçanın konusunu tek cümleyle belirle, sonra bu konuyla bağı kopan cümleyi işaretle."
  },
  {
    unit: "Parçada Anlam",
    q: "Ada, Berk, Ceren ve Deniz bir koşuda ilk dört sırayı almıştır.\n• Ada, Berk’ten önce bitirmiştir.\n• Berk ikinci olmuştur.\n• Ceren, Deniz’den sonra bitirmiştir.\n\nBuna göre aşağıdakilerden hangisi <b>kesinlikle doğrudur</b>?",
    o: [
      "Deniz birinci olmuştur.",
      "Ceren dördüncü olmuştur.",
      "Ada üçüncü olmuştur.",
      "Deniz ikinci olmuştur."
    ],
    a: 1,
    exp: "Berk 2. ise Ada, Berk’ten önce bitirdiği için 1.’dir. Kalan 3. ve 4. sıra için Ceren, Deniz’den sonra bitirdiğinden Deniz 3., Ceren 4. olur.",
    tip: "Mantık sorularında kesin bilgiden başla, bir sıra tablosu çiz ve verilenleri tek tek yerleştir."
  },

  /* ---------- 4. DİL BİLGİSİ ---------- */
  {
    unit: "Dil Bilgisi: Fiilimsiler",
    q: "Aşağıdaki cümlelerin hangisinde <b>sıfat-fiil (ortaç)</b> kullanılmıştır?",
    o: [
      "Koşarak otobüse yetişti.",
      "Sabah erken kalkmak zor gelir.",
      "Gülerek kapıdan içeri girdi.",
      "Kapıyı çalan misafirler içeri girdi."
    ],
    a: 3,
    exp: "“Çalan”, fiilden türeyerek “misafirler” adını niteler; bu yüzden sıfat-fiildir. “Koşarak” ve “gülerek” zarf-fiil, “kalkmak” isim-fiildir.",
    tip: "Ekine bak: -an, -mış, -dık, -ecek → sıfat-fiil; -arak, -ınca, -ıp → zarf-fiil; -mak, -ma, -ış → isim-fiil."
  },
  {
    unit: "Dil Bilgisi: Cümlenin Ögeleri",
    q: "Aşağıdaki cümlelerin hangisinde altı çizili sözcük <b>nesne</b> görevindedir?",
    o: [
      "<u>Sabah</u> çiçekleri suladık.",
      "<u>Çocuklar</u> bahçede oynadı.",
      "Annem <u>pencereyi</u> açtı.",
      "Kitabı <u>masaya</u> bıraktım."
    ],
    a: 2,
    exp: "“Annem neyi açtı?” sorusunun cevabı “pencereyi”dir; bu yüzden nesnedir. “Sabah” zarf tümleci, “Çocuklar” özne, “masaya” dolaylı tümleçtir.",
    tip: "Yükleme “Neyi? Kimi?” diye sor; cevap nesnedir. “Nereye? Kime?” sorularının cevabı dolaylı tümleçtir."
  },
  {
    unit: "Dil Bilgisi: Fiilde Çatı",
    q: "Aşağıdaki cümlelerin hangisinde fiilin çatısı <b>diğerlerinden farklıdır</b>?",
    o: [
      "Çocuklar bahçede oynadı.",
      "Kitaplar rafa dizildi.",
      "Mektup akşama kadar yazıldı.",
      "Misafirler sofrada ağırlandı."
    ],
    a: 0,
    exp: "B, C ve D’de eylemi yapan belli değildir (-ıl, -il, -n ekleri) ve özne eylemden etkilenir; bunlar edilgendir. A’da ise özne eylemi bizzat yapar; fiil etken çatılıdır.",
    tip: "“Özne eylemi yapıyor mu, yoksa eylemden etkileniyor mu?” sorusu çatıyı çözer."
  },
  {
    unit: "Dil Bilgisi: Cümle Çeşitleri",
    q: "Aşağıdaki cümlelerin hangisi <b>devrik cümledir</b>?",
    o: [
      "Dün akşam arkadaşlarımla sinemaya gittik.",
      "Öğretmen, ödevleri sabaha kadar okudu.",
      "Bu kitabı sana kim verdi?",
      "Çok sevindi, bu haberi duyunca Ali."
    ],
    a: 3,
    exp: "Yüklemi cümlenin sonunda olmayan cümleye devrik cümle denir. D’de yüklem “sevindi” sonda değildir; diğer cümlelerde yüklemler sondadır.",
    tip: "Önce yüklemi bul, sonra yerine bak: Yüklem sondaysa kurallı, başta ya da ortadaysa devriktir."
  },
  {
    unit: "Dil Bilgisi: Yazım Kuralları",
    q: "Aşağıdaki cümlelerin hangisinde <b>yazım yanlışı</b> vardır?",
    o: [
      "Her şey yolunda gidiyordu.",
      "Bu konuyu ben de merak ediyorum.",
      "Sınıfta hiç bir öğrenci geç kalmadı.",
      "Yarın herkes toplantıda olacak."
    ],
    a: 2,
    exp: "“Hiçbir” sözcüğü bitişik yazılır. “Her şey” ayrı, “herkes” bitişik, bağlaç olan “de” ayrı yazılır; diğer cümleler doğrudur.",
    tip: "Bitişik yazılan sözcükleri ezberle: hiçbir, hiçbiri, birçok, birkaç, herkes."
  },
  {
    unit: "Dil Bilgisi: Noktalama İşaretleri",
    q: "Aşağıdaki cümlelerin hangisinde <b>noktalama yanlışı</b> vardır?",
    o: [
      "Ali, Veli ve Ayşe pikniğe gitti.",
      "Bu akşam bizimle sinemaya gelecek misin.",
      "Eyvah, ödevimi evde unuttum!",
      "Hafta sonu dedemlerde kalacağız."
    ],
    a: 1,
    exp: "“Misin” soru ekini taşıyan cümle, soru anlamı taşıdığı için soru işaretiyle bitmelidir; nokta konulamaz. Diğer cümlelerde virgül, ünlem ve nokta doğru kullanılmıştır.",
    tip: "Soru anlamı varsa cümle sonuna (?), duygu ve seslenişlerden sonra (!) koy."
  }
];

/* ---------- Oyun ayarları ---------- */
const MAX_LIVES = 5;
const POINTS = 10;
const STREAK_BONUS = 5;
const LETTERS = "ABCD";

const $ = (id) => document.getElementById(id);

const state = {
  name: "",
  list: [],
  i: 0,
  score: 0,
  lives: MAX_LIVES,
  correct: 0,
  wrong: 0,
  streak: 0,
  answered: false
};

/* ---------- Yardımcı fonksiyonlar ---------- */
function show(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderLives(justLost) {
  $("hud-lives").innerHTML = Array.from({ length: MAX_LIVES }, (_, k) => {
    const lost = k >= state.lives;
    const cls = lost ? (justLost && k === state.lives ? "lost breaking" : "lost") : "";
    return `<i class="fa-solid fa-heart heart ${cls}"></i>`;
  }).join("");
}

/* ---------- Oyunu başlat ---------- */
function startGame(name) {
  Object.assign(state, {
    name,
    list: shuffle(QUESTIONS),
    i: 0,
    score: 0,
    lives: MAX_LIVES,
    correct: 0,
    wrong: 0,
    streak: 0,
    answered: false
  });
  $("hud-name").textContent = name;
  $("hud-score").textContent = "0";
  $("hud-total").textContent = state.list.length;
  renderLives(false);
  renderQuestion();
  show("screen-game");
}

/* ---------- Soruyu ekrana getir ---------- */
function renderQuestion() {
  const q = state.list[state.i];
  state.answered = false;
  $("hud-index").textContent = state.i + 1;
  $("q-unit").textContent = q.unit;
  $("q-text").innerHTML = q.q;
  $("progress-bar").style.width = (state.i / state.list.length) * 100 + "%";
  $("solution").hidden = true;
  $("options").innerHTML = q.o
    .map(
      (t, k) =>
        `<button class="option" type="button" data-k="${k}"><span class="letter">${LETTERS[k]}</span><span>${t}</span></button>`
    )
    .join("");
}

/* ---------- Cevabı kontrol et ---------- */
function answer(k) {
  if (state.answered) return;
  state.answered = true;

  const q = state.list[state.i];
  const ok = k === q.a;
  const btns = document.querySelectorAll(".option");
  btns.forEach((b) => (b.disabled = true));
  btns[q.a].classList.add("correct");

  let title;
  if (ok) {
    state.correct++;
    state.streak++;
    const gain = POINTS + (state.streak >= 3 ? STREAK_BONUS : 0);
    state.score += gain;
    title = `<i class="fa-solid fa-circle-check"></i> Harika! +${gain} puan` + (state.streak >= 3 ? ` (${state.streak} seri)` : "");
  } else {
    btns[k].classList.add("wrong");
    state.wrong++;
    state.streak = 0;
    state.lives--;
    renderLives(true);
    title = `<i class="fa-solid fa-circle-xmark"></i> Olmadı, doğru cevap ${LETTERS[q.a]}`;
  }

  $("hud-score").textContent = state.score;
  $("progress-bar").style.width = ((state.i + 1) / state.list.length) * 100 + "%";

  const box = $("solution");
  box.className = "card solution " + (ok ? "ok" : "bad");
  $("sol-title").innerHTML = title;
  $("sol-text").innerHTML = q.exp;
  $("sol-tip").innerHTML = q.tip;

  const last = state.lives === 0 || state.i === state.list.length - 1;
  $("btn-next").innerHTML = last
    ? 'Sonucu Gör <i class="fa-solid fa-flag-checkered"></i>'
    : "Sonraki Soru";

  box.hidden = false;
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
  $("btn-next").focus({ preventScroll: true });
}

/* ---------- Sonraki soruya geç ---------- */
function next() {
  if (state.lives === 0 || state.i >= state.list.length - 1) {
    finish();
    return;
  }
  state.i++;
  renderQuestion();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- Oyunu bitir ve skoru göster ---------- */
function finish() {
  const total = state.list.length;
  const net = state.correct - state.wrong / 3;
  const ratio = state.correct / total;
  const dead = state.lives === 0;
  let icon, title, msg;

  if (dead) {
    icon = "fa-heart-crack";
    title = `Canların bitti, ${state.name}!`;
    msg = "Pes etmek yok. Çözümleri tekrar oku ve yeniden dene; her tur seni biraz daha hazırlar.";
  } else if (ratio >= 0.8) {
    icon = "fa-trophy";
    title = `Muhteşem, ${state.name}!`;
    msg = "LGS Türkçe’de harika bir tempodasın. Böyle devam!";
  } else if (ratio >= 0.5) {
    icon = "fa-medal";
    title = `Güzel iş, ${state.name}!`;
    msg = "Temel konular yerinde. Yanlış yaptığın konulara bir kez daha göz at.";
  } else {
    icon = "fa-seedling";
    title = `Gelişiyorsun, ${state.name}!`;
    msg = "Her deneme seni biraz daha ileri taşır. Çözümleri okuyup tekrar dene.";
  }

  $("end-icon").innerHTML = `<i class="fa-solid ${icon}"></i>`;
  $("end-title").textContent = title;
  $("end-msg").textContent = msg;
  $("st-correct").textContent = state.correct;
  $("st-wrong").textContent = state.wrong;
  $("st-net").textContent = net.toFixed(2).replace(".", ",");
  $("st-score").textContent = state.score;

  let best = state.score;
  try {
    const old = Number(localStorage.getItem("lgs_best")) || 0;
    best = Math.max(old, state.score);
    localStorage.setItem("lgs_best", best);
  } catch (err) {
    /* Tarayıcı depolaması kapalıysa sessizce devam et */
  }
  $("st-best").innerHTML = `<i class="fa-solid fa-crown"></i> En yüksek puanın: <b>${best}</b>`;

  show("screen-end");
  if (!dead && ratio >= 0.5) confetti();
}

/* ---------- Kutlama konfetisi ---------- */
function confetti() {
  const colors = ["#7c5cff", "#2ec4b6", "#ffb84d", "#ff8fc0", "#22b07d"];
  for (let n = 0; n < 60; n++) {
    const c = document.createElement("i");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = colors[n % colors.length];
    c.style.animationDuration = 2 + Math.random() * 2.5 + "s";
    c.style.animationDelay = Math.random() * 0.8 + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 5500);
  }
}

/* ---------- Olay dinleyicileri ---------- */
$("start-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("player-name").value.trim();
  if (!name) return;
  try {
    localStorage.setItem("lgs_name", name);
  } catch (err) {}
  startGame(name);
});

$("options").addEventListener("click", (e) => {
  const b = e.target.closest(".option");
  if (b) answer(Number(b.dataset.k));
});

$("btn-next").addEventListener("click", next);
$("btn-restart").addEventListener("click", () => startGame(state.name));

/* Klavye desteği: A-D veya 1-4 tuşlarıyla cevap ver */
document.addEventListener("keydown", (e) => {
  if (!$("screen-game").classList.contains("active") || state.answered || e.key.length !== 1) return;
  const idx = "abcd".indexOf(e.key.toLowerCase());
  const num = "1234".indexOf(e.key);
  const k = idx > -1 ? idx : num;
  if (k > -1) answer(k);
});

/* Kayıtlı ismi forma yaz */
try {
  $("player-name").value = localStorage.getItem("lgs_name") || "";
} catch (err) {}
