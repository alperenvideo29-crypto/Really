/* Medya yolları — dosyaları index.html ile aynı klasöre koyun (logo.png sizde) */
const MEDIA={sedan:'sedan-top.png',sport:'sport-offer.png'};
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;

(()=>{
  // Logo: logo.png bulunamazsa metalik "R REALLY" yazı logosuna düş
  const wm=()=>{const s=document.createElement('span');s.className='wordmark';s.innerHTML='<b>R</b>EALLY';return s;};
  document.querySelectorAll('img[data-logo]').forEach(img=>{
    const f=()=>img.replaceWith(wm());
    img.addEventListener('error',f,{once:true});
    if(img.complete&&!img.naturalWidth)f();
  });

  // Hero videosu: sessiz, döngü, sekme gizliyken duraklat
  const v=document.getElementById('heroVideo');
  if(v){
    v.muted=true;
    const play=()=>{if(!calm&&!document.hidden)v.play().catch(()=>{});};
    if(calm)v.removeAttribute('autoplay');else{play();v.addEventListener('canplay',play,{once:true});}
    document.addEventListener('visibilitychange',()=>document.hidden?v.pause():play());
    v.addEventListener('error',()=>v.classList.add('off'),true);
  }

  // Görsel hata yedeği + galeri (lightbox)
  addEventListener('error',e=>{if(e.target.tagName==='IMG'&&!e.target.hasAttribute('data-logo'))e.target.classList.add('off');},true);
  const lb=document.getElementById('lightbox'),li=lb.querySelector('img');
  const shut=()=>{lb.hidden=true;document.body.classList.remove('lock');};
  document.addEventListener('click',e=>{
    const z=e.target.closest('[data-zoom]');
    if(z){li.src=z.src;li.alt=z.alt;lb.hidden=false;document.body.classList.add('lock');}
    else if(e.target.closest('#lightbox'))shut();
  });
  addEventListener('keydown',e=>{if(e.key==='Escape'&&!lb.hidden)shut();});
})();
