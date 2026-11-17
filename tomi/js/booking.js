// Демонстрационная модель: тарифы, вместимость и занятость не являются данными TOMI.
(() => {
 const host=document.querySelector('#booking');
 const rates={happiness:4500,wisdom:5200,love:5800};
 const capacities={happiness:2,wisdom:3,love:4};
 const money=n=>new Intl.NumberFormat('ru-RU').format(n)+' ₽';
 const dateString=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
 const today=new Date();today.setHours(0,0,0,0);
 const arrival=new Date(today);arrival.setDate(arrival.getDate()+1);
 const departure=new Date(arrival);departure.setDate(departure.getDate()+3);
 const current=new URLSearchParams(location.search).get('id');
 const preset=D.rooms.some(r=>r.id===current)?current:'all';
 host.innerHTML=`<div class="booking-heading"><div><h2>Выберите даты</h2><p>Выберите даты, гостей и апартаменты. Стоимость появится здесь.</p></div><span class="demo-badge">Демо бронирования</span></div><p class="demo-notice">Цены, вместимость и свободные даты ниже вымышлены для показа. Это не предложение TOMI и не реальное бронирование.</p><form class="booking-form" id="booking-search"><label>Заезд<input id="arrival" name="arrival" type="date" min="${dateString(today)}" value="${dateString(arrival)}" required></label><label>Выезд<input id="departure" name="departure" type="date" min="${dateString(arrival)}" value="${dateString(departure)}" required></label><label>Гости<select id="guests" name="guests"><option value="1">1 гость</option><option value="2" selected>2 гостя</option><option value="3">3 гостя</option><option value="4">4 гостя</option><option value="5">5 гостей</option></select></label><label>Апартаменты<select id="room-filter" name="room"><option value="all">Все варианты</option>${D.rooms.map(r=>`<option value="${r.id}" ${r.id===preset?'selected':''}>${r.name}</option>`).join('')}</select></label><button class="btn" type="submit">Показать номера</button></form><p id="booking-error" class="booking-error" role="alert" hidden></p><div id="availability" aria-live="polite"></div><div id="reservation" hidden></div>`;
 const from=host.querySelector('#arrival'),to=host.querySelector('#departure'),guests=host.querySelector('#guests'),filter=host.querySelector('#room-filter');
 const error=host.querySelector('#booking-error'),results=host.querySelector('#availability'),reservation=host.querySelector('#reservation');
 let searchState=null;
 const parse=s=>/^\d{4}-\d{2}-\d{2}$/.test(s)?new Date(s+'T00:00:00Z'):null;
 const nice=s=>new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',timeZone:'UTC'}).format(parse(s));
 const nightsLabel=n=>n%10===1&&n%100!==11?'ночь':n%10>=2&&n%10<=4&&(n%100<12||n%100>14)?'ночи':'ночей';
 function polish(root){const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;while(node=walk.nextNode()){node.textContent=window.typo(node.textContent)}}
 function render(){
  reservation.hidden=true;reservation.innerHTML='';searchState=null;
  const a=parse(from.value),b=parse(to.value),n=a&&b?Math.round((b-a)/86400000):0;
  let message='';
  if(!a||!b||!Number.isFinite(a.getTime())||!Number.isFinite(b.getTime()))message='Укажите даты заезда и выезда.';
  else if(from.value<dateString(today))message='Выберите дату заезда не раньше сегодняшнего дня.';
  else if(n<=0)message='Выезд должен быть позже заезда.';
  else if(n>30)message='В демонстрации можно выбрать до 30 ночей.';
  error.hidden=!message;error.textContent=message;
  if(message){results.innerHTML='';return;}
  const candidates=D.rooms.filter(r=>filter.value==='all'||r.id===filter.value);
  const offers=candidates.map(r=>{
   // В демо «Мудрость» занята при заезде в чётный день. Это правило показа, не календарь объекта.
   const occupied=r.id==='wisdom'&&a.getUTCDate()%2===0;
   const fits=Number(guests.value)<=capacities[r.id];
   let total=0;for(let day=0;day<n;day++){const weekday=new Date(a.getTime()+day*86400000).getUTCDay();total+=rates[r.id]+([5,6].includes(weekday)?800:0);}
   return {...r,occupied,fits,total};
  });
  const count=offers.filter(o=>!o.occupied&&o.fits).length;
  searchState={from:from.value,to:to.value,guests:Number(guests.value),nights:n,offers};
  results.innerHTML=`<div class="results-heading"><h3>${count?'Доступно в демо: '+count:'Нет подходящих вариантов в демо'}</h3><span>${nice(from.value)} — ${nice(to.value)} · ${n} ${nightsLabel(n)}</span></div>${!count?'<p class="booking-empty">Измените даты, число гостей или выберите все апартаменты. Это демонстрационный календарь.</p>':''}<div class="booking-results">${offers.map(o=>`<article class="booking-offer ${o.occupied||!o.fits?'unavailable':''}"><div class="offer-icon" aria-hidden="true">${o.symbol}</div><div class="offer-description"><h3>${o.name}</h3><p>До ${capacities[o.id]} гостей · демо-вместимость</p><span class="offer-status">${!o.fits?'Не подходит для выбранного числа гостей':o.occupied?'Занято на эти даты в демо':'Свободно на эти даты в демо'}</span></div><div class="offer-price"><strong>${money(o.total)}</strong><span>за ${n} ${nightsLabel(n)} · демо-цена</span><span class="price-detail">${money(rates[o.id])}/ночь, пт–сб +800 ₽</span></div><button class="btn ${o.occupied||!o.fits?'light':''}" type="button" data-reserve="${o.id}" ${o.occupied||!o.fits?'disabled':''}>Выбрать</button></article>`).join('')}</div><p class="small booking-footnote">Демо-расчёт: базовый тариф и доплата за выходные. Реальные условия подтвердит TOMI.</p>`;
  results.querySelectorAll('[data-reserve]').forEach(button=>button.addEventListener('click',()=>select(button.dataset.reserve)));polish(results);
 }
 function select(id){
  const s=searchState,o=s?.offers.find(r=>r.id===id);if(!o||o.occupied||!o.fits)return;
  reservation.hidden=false;
  reservation.innerHTML=`<div class="reservation-summary"><div><span class="demo-badge">Демо бронирования</span><h3>Ваш выбор: ${o.name}</h3><p>${nice(s.from)} — ${nice(s.to)} · ${s.nights} ${nightsLabel(s.nights)} · гостей: ${s.guests}</p><p><strong>Итого в примере: ${money(o.total)}</strong></p><p class="small">Настоящий номер не резервируется. Оплаты и отправки данных нет.</p></div><div class="reservation-actions"><button class="btn" id="confirm-demo" type="button">Подтвердить демо-бронь</button><button class="btn light" id="cancel-demo" type="button">Вернуться к выбору</button></div></div>`;
  reservation.querySelector('#cancel-demo').addEventListener('click',()=>{reservation.hidden=true;host.querySelector(`[data-reserve="${id}"]`).focus()});
  reservation.querySelector('#confirm-demo').addEventListener('click',()=>{
   reservation.innerHTML=`<div class="booking-success" role="status" tabindex="-1"><span class="demo-badge">Демонстрация завершена</span><h3>Демо-бронь готова</h3><p>Апартаменты «${o.name}» · ${nice(s.from)} — ${nice(s.to)} · ${money(o.total)}.</p><p>Так будет выглядеть подтверждение. Реальная бронь не создана, деньги не списаны.</p><button class="btn light" id="again-demo" type="button">Выбрать другие даты</button></div>`;
   reservation.querySelector('#again-demo').addEventListener('click',()=>{reservation.hidden=true;from.focus()});
   polish(reservation);reservation.querySelector('.booking-success').focus();
  });
  polish(reservation);reservation.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
 }
 host.querySelector('form').addEventListener('submit',event=>{event.preventDefault();render()});
 [from,to,guests,filter].forEach(input=>input.addEventListener('change',render));
 render();polish(host);
})();
