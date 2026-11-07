'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* 1) Sekme yönetimi (fade-in animasyonu CSS'te .panel.active ile gelir) */
$$('.tab').forEach(tab => {
  tab.onclick = () => {
    $$('.tab').forEach(t => t.classList.toggle('active', t === tab));
    $$('.panel').forEach(p => p.classList.toggle('active', p.id === tab.dataset.t));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
});

/* 2) Skor paneli: Doğru, Yanlış, Boş ve Net (LGS: 3 yanlış 1 doğruyu götürür) */
function skor(panel) {
  const toplam = $$('.q', panel).length;
  const d = $$('.q.ok', panel).length;
  const y = $$('.q.no', panel).length;
  $('.d', panel).textContent = d;
  $('.y', panel).textContent = y;
  $('.b', panel).textContent = toplam - d - y;
  $('.n', panel).textContent = Number((d - y / 3).toFixed(2));
}

/* 3) Şık kontrolü ve "Çözümü Göster" aç/kapa */
$$('.q').forEach(q => {
  $$('.opt', q).forEach(opt => {
    opt.onclick = () => {
      if (q.classList.contains('done')) return;
      const dogruMu = opt.dataset.k === q.dataset.a;
      q.classList.add('done', dogruMu ? 'ok' : 'no');
      opt.classList.add(dogruMu ? 'correct' : 'wrong');
      if (!dogruMu) $(`.opt[data-k="${q.dataset.a}"]`, q).classList.add('correct');
      skor(q.closest('.panel'));
    };
  });
  $('.sb', q).onclick = e => {
    const acik = $('.sol', q).classList.toggle('show');
    e.currentTarget.textContent = acik ? '🙈 Çözümü Gizle' : '💡 Çözümü Göster';
  };
});

/* 4) Testi sıfırlama */
$$('.rs').forEach(btn => {
  btn.onclick = () => {
    const panel = btn.closest('.panel');
    $$('.q', panel).forEach(q => {
      q.classList.remove('done', 'ok', 'no');
      $$('.opt', q).forEach(o => o.classList.remove('correct', 'wrong'));
      $('.sol', q).classList.remove('show');
      $('.sb', q).textContent = '💡 Çözümü Göster';
    });
    skor(panel);
  };
});
$$('.panel').forEach(skor);

/* 5) Arama / filtreleme: tüm derslerde konu, not ve soru ara */
$('#search').oninput = e => {
  const aranan = e.target.value.trim().toLocaleLowerCase('tr');
  document.body.classList.toggle('searching', aranan !== '');
  $$('.fi').forEach(el => {
    const eslesme = el.textContent.toLocaleLowerCase('tr').includes(aranan);
    el.classList.toggle('hide', aranan !== '' && !eslesme);
  });
  $$('.panel').forEach(p => {
    p.classList.toggle('hide', aranan !== '' && !$('.fi:not(.hide)', p));
  });
};

/* 6) Yazdır / PDF */
$('#printBtn').onclick = () => window.print();
