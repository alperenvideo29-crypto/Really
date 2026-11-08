(()=>{
  const $=s=>document.querySelector(s);

  // Vitrin kartları ve teknik özellikler
  $('#basePrice').textContent=fmt(BASE_PRICE);
  $('#models').innerHTML=MODELS.map(m=>`<article class="card reveal">
    <div class="card-img"><img src="${m.img}" alt="${m.name}" loading="lazy" data-zoom></div>
    <div class="card-body"><span class="badge${m.coupon?' hot':''}">${m.tag}</span><h3>${m.name}</h3><p>${m.desc}</p>
    <div class="card-foot"><div><small>Başlangıç</small><b>${fmt(m.price)}</b></div>
    <button class="btn btn-red btn-sm" data-order data-model="${m.id}"${m.coupon?` data-coupon="${m.coupon}"`:''}>${m.coupon?'%20 İndirimle Al':'Sipariş Ver'}</button></div></div></article>`).join('');
  $('#specs').innerHTML=SPECS.map(s=>`<div class="spec reveal"><i>${s.i}</i><small>${s.k}</small><strong>${s.v}</strong><p>${s.d}</p></div>`).join('');

  // "Sipariş Ver" / "%20 İndirimle Al" butonları → sipariş paneli
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-order]');
    if(b)Checkout.open(b.dataset.model,b.dataset.coupon);
  });

  // Gezinme çubuğu ve mobil menü
  const nav=$('#nav'),menu=$('#menu'),burger=$('#burger');
  const onScroll=()=>nav.classList.toggle('solid',scrollY>40);
  onScroll();addEventListener('scroll',onScroll,{passive:true});
  burger.onclick=()=>burger.setAttribute('aria-expanded',menu.classList.toggle('open'));
  menu.onclick=e=>{if(e.target.tagName==='A'){menu.classList.remove('open');burger.setAttribute('aria-expanded','false');}};

  // Kaydırınca görünme
  const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
})();
