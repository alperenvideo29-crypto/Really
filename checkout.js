const COUPONS={
  KASIM20:{t:'pct',v:20,label:'KASIM20 · %20 indirim'},
  GELECEK100:{t:'fix',v:100000,label:'GELECEK100 · 100.000 TL indirim'},
  REALLY2026:{t:'pct',v:15,label:'REALLY2026 · %15 lansman indirimi'}
};
const fmt=n=>new Intl.NumberFormat('tr-TR').format(Math.round(n))+' TL';
const esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');

const Checkout=(()=>{
  const $=s=>document.querySelector(s),modal=$('#orderModal'),form=$('#orderForm');
  const st={m:MODELS[0],color:COLORS[0],coupon:null,shown:{}};
  const els={base:$('#pBase'),disc:$('#pDisc'),total:$('#pTotal')};
  form.elements.city.innerHTML='<option value="">Şehir seçin</option>'+CITIES.map(c=>`<option>${c}</option>`).join('');

  const calc=()=>{const b=st.m.price,c=COUPONS[st.coupon];
    const d=c?Math.min(c.t==='pct'?b*c.v/100:c.v,b):0;return{base:b,disc:d,total:b-d};};

  // Fiyatı animasyonlu sayaçla güncelle
  function show(k,to,f=fmt){
    const el=els[k],from=st.shown[k]??to,t0=performance.now();
    cancelAnimationFrame(el.r);
    const step=t=>{const p=calm?1:Math.min((t-t0)/650,1),v=from+(to-from)*(1-(1-p)**3);
      st.shown[k]=v;el.textContent=f(v);if(p<1)el.r=requestAnimationFrame(step);};
    step(t0);
  }
  function render(){
    const c=calc();
    $('#rowDisc').hidden=!st.coupon;
    $('#dLabel').textContent=st.coupon?COUPONS[st.coupon].label:'';
    show('base',c.base);show('disc',c.disc,v=>'−'+fmt(v));show('total',c.total);
    els.total.classList.remove('pop');void els.total.offsetWidth;els.total.classList.add('pop');
  }

  // Kupon: yazarken canlı uygular; "Uygula"/Enter hata mesajı da gösterir
  function coupon(code,strict){
    code=(code||'').trim().toUpperCase();
    const prev=st.coupon,ok=!!COUPONS[code],msg=$('#couponMsg');
    st.coupon=ok?code:null;
    msg.className=ok?'ok':strict&&code?'err':'';
    msg.textContent=ok?'✓ '+COUPONS[code].label+' uygulandı':!strict?'':code?'Geçersiz kupon kodu.':'Lütfen bir kupon kodu girin.';
    if(ok)$('#coupon').value=code;
    if(prev!==st.coupon)render();
  }

  // Form doğrulama
  const L='A-Za-zÇĞİÖŞÜçğıöşü';
  const V={
    name:v=>new RegExp(`^[${L}]{2,}(\\s+[${L}]{2,})+$`).test(v.trim())||'Lütfen ad ve soyadınızı girin.',
    phone:v=>/^05\d{9}$/.test(v)||'Telefon 05555555555 formatında olmalı.',
    email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())||'Geçerli bir e-posta girin.',
    city:v=>!!v||'Lütfen teslimat şehrini seçin.'
  };
  const mark=(el,m)=>{let s=el.parentNode.querySelector('.e');
    if(!s){s=document.createElement('small');s.className='e';el.after(s);}
    s.textContent=m;el.classList.toggle('bad',!!m);};

  function swatches(){
    const box=$('#swatches');
    box.innerHTML='<span>Renk:</span>'+COLORS.map((c,i)=>`<button type="button" class="sw" style="background:${c.c}" title="${c.n}" aria-label="${c.n}" aria-pressed="${i===0}"></button>`).join('')+`<em id="cName">${COLORS[0].n}</em>`;
    box.onclick=e=>{const b=e.target.closest('.sw');if(!b)return;
      const all=[...box.querySelectorAll('.sw')],i=all.indexOf(b);
      st.color=COLORS[i];all.forEach((s,j)=>s.setAttribute('aria-pressed',j===i));$('#cName').textContent=st.color.n;};
  }

  function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;$('#toasts').append(t);setTimeout(()=>t.remove(),4000);}

  function confetti(){
    if(calm)return;
    const cv=$('#confetti'),x=cv.getContext('2d'),W=cv.width=innerWidth,H=cv.height=innerHeight;
    const cols=['#e10600','#ff3b3b','#d5dbe3','#ffffff','#1fa2ff','#7fd0ff'];
    const ps=Array.from({length:170},()=>({x:W/2,y:H*.62,vx:(Math.random()-.5)*18,vy:-Math.random()*18-6,s:Math.random()*9+5,a:Math.random()*6,va:Math.random()*.4-.2,c:cols[Math.random()*cols.length|0]}));
    cv.style.display='block';let f=0;
    (function t(){
      x.clearRect(0,0,W,H);
      for(const p of ps){p.vy+=.45;p.x+=p.vx;p.y+=p.vy;p.a+=p.va;x.save();x.translate(p.x,p.y);x.rotate(p.a);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);x.restore();}
      ++f<200?requestAnimationFrame(t):(x.clearRect(0,0,W,H),cv.style.display='none');
    })();
  }

  // Sipariş özet kartı
  function done(o){
    const row=(a,b)=>`<div><span>${a}</span><b>${esc(b)}</b></div>`;
    $('#doneView').innerHTML=`<div class="check">✓</div><h3>Siparişiniz alındı!</h3>
      <p>Teşekkürler ${esc(o.name.split(' ')[0])}, ekibimiz sizi en kısa sürede arayacak.</p>
      <div class="ticket">${row('Sipariş No',o.no)}${row('Model',o.m+' · '+o.color)}${row('Teslimat şehri',o.city)}${row('Telefon',o.phone)}${row('E-posta',o.email)}
      ${o.coupon?row('Kupon',COUPONS[o.coupon].label):''}${row('Taban fiyat',fmt(o.base))}${o.coupon?row('İndirim','−'+fmt(o.disc)):''}
      <div class="total"><span>Ödenecek tutar</span><b>${fmt(o.total)}</b></div></div>
      <p>Müşteri hattı: <a href="tel:05555555555">05555555555</a></p>
      <button class="btn btn-ghost" data-close>Kapat</button>`;
    $('#formView').hidden=true;$('#doneView').hidden=false;
  }

  function open(id,code){
    const m=MODELS.find(x=>x.id===id)||MODELS[0];
    Object.assign(st,{m,color:COLORS[0],coupon:null});
    st.shown={base:m.price,disc:0,total:m.price};
    form.reset();
    form.querySelectorAll('.e').forEach(s=>s.textContent='');
    form.querySelectorAll('.bad').forEach(i=>i.classList.remove('bad'));
    $('#couponMsg').textContent='';$('#couponMsg').className='';
    $('#oTitle').textContent=m.name;$('#oImg').src=m.img;$('#oImg').alt=m.name;
    swatches();render();
    $('#formView').hidden=false;$('#doneView').hidden=true;
    modal.hidden=false;document.body.classList.add('lock');$('.panel').focus();
    if(code)setTimeout(()=>coupon(code),350);
  }
  const close=()=>{modal.hidden=true;document.body.classList.remove('lock');};

  form.addEventListener('submit',e=>{
    e.preventDefault();let first=null;
    for(const k in V){const el=form.elements[k],r=V[k](el.value);mark(el,r===true?'':r);if(r!==true&&!first)first=el;}
    if(first)return first.focus();
    const f=form.elements;
    done({no:'RLY-'+Date.now().toString(36).toUpperCase().slice(-6),m:st.m.name,color:st.color.n,name:f.name.value.trim(),
      phone:f.phone.value,email:f.email.value.trim(),city:f.city.value,coupon:st.coupon,...calc()});
    confetti();toast('Siparişiniz alındı! 🎉');
  });
  form.addEventListener('input',e=>{
    if(e.target.name==='phone')e.target.value=e.target.value.replace(/\D/g,'').slice(0,11);
    if(e.target.classList.contains('bad'))mark(e.target,'');
  });
  $('#coupon').addEventListener('input',e=>coupon(e.target.value));
  $('#coupon').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();coupon(e.target.value,true);}});
  $('#applyCoupon').addEventListener('click',()=>coupon($('#coupon').value,true));
  modal.addEventListener('click',e=>{if(e.target===modal||e.target.closest('[data-close]'))close();});
  addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)close();});

  return{open,close};
})();
