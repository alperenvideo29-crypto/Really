'use strict';

/* ========== Ayarlar ========== */
const TOPICS = [
  'Çarpanlar ve Katlar', 'Üslü İfadeler', 'Kareköklü İfadeler', 'Veri Analizi',
  'Basit Olayların Olma Olasılığı', 'Cebirsel İfadeler ve Özdeşlikler', 'Doğrusal Denklemler',
  'Eşitsizlikler', 'Üçgenler', 'Eşlik ve Benzerlik', 'Dönüşüm Geometrisi', 'Geometrik Cisimler'
];
const KEYS = { user: 'lgs_user', questions: 'lgs_questions' };
const MAX_PDF = 1.5 * 1024 * 1024;   // LocalStorage sınırı nedeniyle
const MAX_IMG = 1200;                // görseller bu boyuta küçültülür

/* ========== Yardımcılar ========== */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const nl = s => esc(s).replace(/\n/g, '<br>');
const fmt = d => new Date(d).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' });
const initials = n => n.split(' ').map(w => w[0]).join('').slice(0, 2).toLocaleUpperCase('tr');
const cap = s => s.trim().split(/\s+/).filter(Boolean).map(w => w[0].toLocaleUpperCase('tr') + w.slice(1).toLocaleLowerCase('tr')).join(' ');
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const roleClass = r => (r === 'Öğretmen' ? 't' : 's');

let toastTimer;
function toast(msg, bad = false) {
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'toast show' + (bad ? ' bad' : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.className = 'toast'), 3200);
}

/* ========== Depolama (LocalStorage) ========== */
const Store = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
  },
  remove: key => localStorage.removeItem(key)
};

/* ========== Dosya işleme ========== */
const readFile = f => new Promise((ok, no) => {
  const r = new FileReader();
  r.onload = () => ok(r.result);
  r.onerror = () => no(new Error('Dosya okunamadı.'));
  r.readAsDataURL(f);
});

const compressImage = src => new Promise((ok, no) => {
  const img = new Image();
  img.onerror = () => no(new Error('Görsel okunamadı.'));
  img.onload = () => {
    const k = Math.min(1, MAX_IMG / Math.max(img.width, img.height));
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * k);
    c.height = Math.round(img.height * k);
    const x = c.getContext('2d');
    x.fillStyle = '#fff';
    x.fillRect(0, 0, c.width, c.height);
    x.drawImage(img, 0, 0, c.width, c.height);
    ok(c.toDataURL('image/jpeg', 0.72));
  };
  img.src = src;
});

async function processFile(file, allowPdf) {
  if (!file) return null;
  if (file.type === 'application/pdf') {
    if (!allowPdf) throw new Error('Çözüm için JPG veya PNG fotoğraf yükle.');
    if (file.size > MAX_PDF) throw new Error('PDF en fazla 1,5 MB olabilir.');
    return { type: 'pdf', name: file.name, data: await readFile(file) };
  }
  if (!/^image\/(jpeg|png)$/.test(file.type)) throw new Error('Yalnızca JPG, PNG veya PDF yükleyebilirsin.');
  return { type: 'image', name: file.name, data: await compressImage(await readFile(file)) };
}

function openPdf(id) {
  const q = questions.find(x => x.id === id);
  if (!q?.file) return;
  const bytes = Uint8Array.from(atob(q.file.data.split(',')[1]), c => c.charCodeAt(0));
  window.open(URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' })), '_blank');
}

/* ========== Durum ========== */
let user = Store.get(KEYS.user, null);
let questions = Store.get(KEYS.questions, []);
let role = 'Öğrenci';

/* ========== Görünüm (render) ========== */
function solutionHTML(s) {
  return `<article class="sol ${roleClass(s.role)}">
    <div class="meta"><b>${esc(s.author)}</b><span class="badge ${roleClass(s.role)}">${esc(s.role)}</span><time>${fmt(s.date)}</time></div>
    ${s.text ? `<p>${nl(s.text)}</p>` : ''}
    ${s.image ? `<img src="${s.image}" alt="Çözüm fotoğrafı" data-zoom>` : ''}
  </article>`;
}

function mediaHTML(q) {
  const f = q.file;
  if (!f) return '';
  if (f.type === 'image') return `<img class="qimg" src="${f.data}" alt="Soru görseli" data-zoom>`;
  return `<div class="pdf"><span>📄</span><div><b>${esc(f.name)}</b><small>PDF dosyası</small></div>
    <button type="button" class="btn ghost sm" data-pdf="${q.id}">Görüntüle</button>
    <a class="btn ghost sm" href="${f.data}" download="${esc(f.name)}">İndir</a></div>`;
}

function cardHTML(q) {
  return `<article class="card" data-q="${q.id}">
    <div class="c-head">
      <div class="avatar">${esc(initials(q.author))}</div>
      <div><b>${esc(q.author)}</b>
        <div class="sub"><span class="badge ${roleClass(q.role)}">${esc(q.role)}</span><time>${fmt(q.date)}</time></div></div>
    </div>
    <span class="chip">${esc(q.topic)}</span>
    ${q.text ? `<p>${nl(q.text)}</p>` : ''}
    ${mediaHTML(q)}
    <section class="sols">
      <h3>Çözümler <span>${q.solutions.length}</span></h3>
      <div class="sol-list">${q.solutions.map(solutionHTML).join('') || '<p class="empty-s">Henüz çözüm yok. İlk çözümü sen paylaş.</p>'}</div>
      <form class="sol-form" data-id="${q.id}">
        <textarea name="text" rows="2" placeholder="Çözüm adımlarını anlat"></textarea>
        <div class="row">
          <label class="file-btn">📷 Çözüm fotoğrafı<input type="file" name="img" accept="image/jpeg,image/png" hidden></label>
          <span class="fname"></span>
          <button class="btn primary sm" type="submit">Çözümü paylaş</button>
        </div>
      </form>
    </section>
  </article>`;
}

function renderList() {
  const f = $('#filterTopic').value;
  const list = questions.filter(q => !f || q.topic === f);
  $('#questionList').innerHTML = list.length
    ? list.map(cardHTML).join('')
    : '<div class="empty">📐 Burada henüz soru yok. Yukarıdan ilk soruyu ekle.</div>';
  $('#count').textContent = list.length;
}

function showApp() {
  $('#loginView').hidden = true;
  $('#appView').hidden = false;
  $('#userName').textContent = user.name;
  const r = $('#userRole');
  r.textContent = user.role;
  r.className = 'badge ' + roleClass(user.role);
  renderList();
}

/* ========== Olaylar ========== */
// Rol seçimi
$('#roleBox').addEventListener('click', e => {
  const b = e.target.closest('.role');
  if (!b) return;
  role = b.dataset.role;
  document.querySelectorAll('.role').forEach(x => x.classList.toggle('active', x === b));
  $('#formTitle').textContent = `${role} bilgileri`;
});

// Giriş
$('#loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const fn = cap($('#firstName').value), ln = cap($('#lastName').value), err = $('#loginError');
  if (fn.length < 2 || ln.length < 2) {
    err.textContent = 'Devam etmek için ad ve soyad girmelisin.';
    err.hidden = false;
    return;
  }
  err.hidden = true;
  user = { name: `${fn} ${ln}`, role };
  Store.set(KEYS.user, user);
  showApp();
});

// Çıkış
$('#logoutBtn').addEventListener('click', () => {
  Store.remove(KEYS.user);
  user = null;
  $('#appView').hidden = true;
  $('#loginView').hidden = false;
});

// Soru dosyası önizleme
$('#qFile').addEventListener('change', e => {
  const f = e.target.files[0], box = $('#qPreview');
  box.innerHTML = !f ? ''
    : f.type === 'application/pdf' ? `<div class="pdf"><span>📄</span><b>${esc(f.name)}</b></div>`
    : `<img src="${URL.createObjectURL(f)}" alt="Önizleme">`;
});

// Soru yayınla
$('#questionForm').addEventListener('submit', async e => {
  e.preventDefault();
  const topic = $('#qTopic').value, text = $('#qText').value.trim(), file = $('#qFile').files[0];
  if (!topic) return toast('Bir konu başlığı seç.', true);
  if (!file && !text) return toast('Soru dosyası yükle veya soru metni yaz.', true);
  try {
    const q = { id: uid(), author: user.name, role: user.role, topic, text, file: await processFile(file, true), date: Date.now(), solutions: [] };
    questions.unshift(q);
    if (!Store.set(KEYS.questions, questions)) {
      questions.shift();
      return toast('Depolama alanı doldu. Daha küçük bir dosya dene.', true);
    }
    e.target.reset();
    $('#qPreview').innerHTML = '';
    $('#filterTopic').value = '';
    renderList();
    toast('Soru yayınlandı ✓');
  } catch (err) { toast(err.message, true); }
});

// Çözüm paylaş (olay delegasyonu)
$('#questionList').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target, q = questions.find(x => x.id === form.dataset.id);
  const text = form.elements.text.value.trim(), file = form.elements.img.files[0];
  if (!text && !file) return toast('Çözüm metni yaz veya fotoğraf ekle.', true);
  try {
    const image = file ? (await processFile(file, false)).data : null;
    q.solutions.push({ id: uid(), author: user.name, role: user.role, text, image, date: Date.now() });
    if (!Store.set(KEYS.questions, questions)) {
      q.solutions.pop();
      return toast('Depolama alanı doldu. Daha küçük bir fotoğraf dene.', true);
    }
    $(`[data-q="${q.id}"]`).outerHTML = cardHTML(q);
    toast('Çözüm paylaşıldı ✓');
  } catch (err) { toast(err.message, true); }
});

// Seçilen çözüm fotoğrafının adını göster
$('#questionList').addEventListener('change', e => {
  if (e.target.name === 'img') e.target.closest('form').querySelector('.fname').textContent = e.target.files[0]?.name || '';
});

// Görsel büyütme, PDF açma
document.addEventListener('click', e => {
  const z = e.target.closest('[data-zoom]');
  if (z) { $('#lightbox img').src = z.src; $('#lightbox').hidden = false; return; }
  const p = e.target.closest('[data-pdf]');
  if (p) return openPdf(p.dataset.pdf);
  if (e.target.closest('#lightbox')) $('#lightbox').hidden = true;
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') $('#lightbox').hidden = true; });

/* ========== Başlangıç ========== */
const topicOptions = TOPICS.map(t => `<option>${t}</option>`).join('');
$('#qTopic').innerHTML = '<option value="">Konu seç</option>' + topicOptions;
$('#filterTopic').innerHTML = '<option value="">Tüm konular</option>' + topicOptions;
$('#filterTopic').addEventListener('change', renderList);
if (user) showApp();
