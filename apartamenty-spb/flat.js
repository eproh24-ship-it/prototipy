/* =========================================================
   СТРАНИЦА КВАРТИРЫ: галерея, календарь, расчёт цены, бронь
   ========================================================= */
const params = new URLSearchParams(location.search);
const flat = FLATS.find((f) => f.id === +params.get("id")) || FLATS[0];
const $ = (id) => document.getElementById(id);

/* ---------- Что рядом (для каждой квартиры) ---------- */
const NEARBY = {
  1: [["Невский проспект", "3 мин"], ["Гостиный двор", "6 мин"], ["Летний сад", "12 мин"], ["Эрмитаж", "20 мин"]],
  2: [["Казанский собор", "2 мин"], ["Спас на Крови", "8 мин"], ["Дом книги", "3 мин"], ["Эрмитаж", "12 мин"]],
  3: [["Улица Рубинштейна", "0 мин"], ["Владимирская", "5 мин"], ["Пять углов", "3 мин"], ["Невский проспект", "7 мин"]],
  4: [["Эрмитаж", "10 мин"], ["Дворцовая площадь", "9 мин"], ["Новая Голландия", "12 мин"], ["Исаакиевский собор", "8 мин"]],
  5: [["Александровский парк", "5 мин"], ["Петропавловская крепость", "10 мин"], ["Троицкий мост", "12 мин"], ["Горьковская", "4 мин"]],
  6: [["Исаакиевский собор", "3 мин"], ["Эрмитаж", "10 мин"], ["Новая Голландия", "9 мин"], ["Медный всадник", "7 мин"]],
  7: [["Парк Победы", "2 мин"], ["Метро «Парк Победы»", "4 мин"], ["Невский — на метро", "15 мин"], ["Аэропорт Пулково", "20 мин"]],
  8: [["Парк 300-летия", "7 мин"], ["Лахта Центр", "15 мин"], ["Набережная залива", "5 мин"], ["Метро «Беговая»", "8 мин"]],
  9: [["Крестовский остров", "10 мин"], ["Газпром Арена", "20 мин"], ["Елагин остров", "15 мин"], ["Метро «Старая Деревня»", "6 мин"]],
  10: [["Пулковский парк", "5 мин"], ["ТЦ «Питер Радуга»", "7 мин"], ["Аэропорт Пулково", "10 мин"], ["Метро «Звёздная»", "7 мин"]],
};

/* ---------- Заполняем страницу ---------- */
document.title = `${flat.title} — посуточно | Невский Квартал`;
$("crumbTitle").textContent = flat.title;
$("fTitle").textContent = flat.title;
$("fMeta").innerHTML = `
  <span>${stars(flat.rating)} · ${flat.reviews} ${plural(flat.reviews, "отзыв", "отзыва", "отзывов")}</span>
  <span>📍 ${flat.district}, ${flat.address}</span>
  <span>Ⓜ ${flat.metro}</span>`;

$("gallery").innerHTML = flat.photos.slice(0, 5).map((p, i) =>
  `<button type="button" data-i="${i}" aria-label="Открыть фото ${i + 1}"><img src="${photo(p, i === 0 ? 1400 : 700)}" alt="${flat.title}, фото ${i + 1}" ${i ? 'loading="lazy"' : ""}>${i === 0 ? '<span class="gallery__all">Все фото · ' + flat.photos.length + "</span>" : ""}</button>`
).join("");

$("keySpecs").innerHTML = `
  <div><b>${{ studio: "Студия", one: "1-комн.", two: "2-комн." }[flat.type]}</b><span>${ZONE_NAME[flat.zone]}</span></div>
  <div><b>${flat.area} м²</b><span>площадь</span></div>
  <div><b class="key-specs__capacity">до ${flat.guests === 2 ? "2-х" : flat.guests} гостей</b><span>${flat.beds}</span></div>
  <div><b>${flat.floor.split(",")[0]}</b><span>этаж${flat.floor.includes("лифт") ? ", лифт" : ""}</span></div>`;

$("fText").innerHTML = flat.text.map((t) => `<p>${t}</p>`).join("");
$("fTags").innerHTML = flat.features.map((t) => `<span>${t}</span>`).join("");
$("nearby").innerHTML = (NEARBY[flat.id] || []).map(([n, t]) => `<li>${n}<span>${t}</span></li>`).join("");

const pets = flat.zone === "sleep";
$("rules").innerHTML = `
  <div class="rule"><b>Заезд после 15:00</b><span>самостоятельно, по коду</span></div>
  <div class="rule"><b>Выезд до 12:00</b><span>поздний — по запросу</span></div>
  <div class="rule"><b>Залог ${money(flat.deposit)}</b><span>вернём в день выезда</span></div>
  <div class="rule"><b>Не курить</b><span>в том числе электронные сигареты</span></div>
  <div class="rule"><b>Без вечеринок</b><span>тишина с 22:00 до 8:00</span></div>
  <div class="rule"><b>${pets ? "Можно с питомцем" : "Без животных"}</b><span>${pets ? "доплата за проживание с питомцем — 1 500 ₽" : "к сожалению, в центре нельзя"}</span></div>`;

const myReviews = REVIEWS.filter((r) => r.flat === flat.id);
$("revTitle").innerHTML = `Отзывы <span class="muted" style="font-size:.6em">${stars(flat.rating)} · ${flat.reviews}</span>`;
$("flatReviews").innerHTML = myReviews.length ? myReviews.map((r) => reviewCard(r, false)).join("") : `<p class="muted">Скоро здесь появятся отзывы.</p>`;

const similar = FLATS.filter((f) => f.id !== flat.id).sort((a, b) => (b.zone === flat.zone) - (a.zone === flat.zone) || Math.abs(a.price - flat.price) - Math.abs(b.price - flat.price)).slice(0, 3);
$("similar").innerHTML = similar.map((f) => flatCard(f)).join("");

$("bPrice").textContent = money(flat.price);
$("bRating").innerHTML = stars(flat.rating);
$("mbPrice").textContent = money(flat.price);

/* ---------- Карта ---------- */
const [latitude, longitude] = flat.coords;
const point = longitude + "," + latitude;
const mapQuery = new URLSearchParams({ lang: "ru_RU", ll: point, z: "16", pt: point + ",pm2rdm" });
$("flatMap").src = "https://yandex.ru/map-widget/v1/?" + mapQuery;

/* ---------- Галерея на весь экран ---------- */
let lbIndex = 0;
const lb = $("lightbox");
const showLb = (i) => {
  lbIndex = (i + flat.photos.length) % flat.photos.length;
  $("lbImg").src = photo(flat.photos[lbIndex], 1800);
  $("lbImg").alt = `${flat.title}, фото ${lbIndex + 1}`;
  $("lbCount").textContent = `${lbIndex + 1} / ${flat.photos.length}`;
};
$("gallery").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  showLb(+b.dataset.i); lb.classList.add("open");
});
lb.querySelector(".lightbox__close").onclick = () => lb.classList.remove("open");
lb.querySelector(".lightbox__prev").onclick = () => showLb(lbIndex - 1);
lb.querySelector(".lightbox__next").onclick = () => showLb(lbIndex + 1);
lb.addEventListener("click", (e) => { if (e.target === lb) lb.classList.remove("open"); });

/* =========================================================
   КАЛЕНДАРЬ И БРОНЬ
   ========================================================= */
const MAX_DAYS = 120;
let busy = busyNights(flat);
const bk = { in: null, out: null, guests: Math.min(2, flat.guests), view: new Date(today().getFullYear(), today().getMonth(), 1) };

const nightsBetween = (a, b) => Math.round((parseISO(b) - parseISO(a)) / 864e5);
const rangeFree = (a, b) => { for (let x = parseISO(a); x < parseISO(b); x = addDays(x, 1)) if (busy.has(isoDate(x))) return false; return true; };
const fmtShort = (s) => parseISO(s).toLocaleDateString("ru-RU", { day: "numeric", month: "short" }).replace(".", "");
const fmtLong = (s) => parseISO(s).toLocaleDateString("ru-RU", { weekday: "short", day: "numeric", month: "long" });

function renderCal() {
  const y = bk.view.getFullYear(), m = bk.view.getMonth();
  const first = new Date(y, m, 1);
  const days = new Date(y, m + 1, 0).getDate();
  const shift = (first.getDay() + 6) % 7; // понедельник — первый
  const t = today(), last = addDays(t, MAX_DAYS);
  const selectingOut = bk.in && !bk.out;
  const minView = new Date(t.getFullYear(), t.getMonth(), 1);
  const maxView = new Date(last.getFullYear(), last.getMonth(), 1);

  let html = `<div class="cal__head">
    <button class="cal__nav" type="button" data-nav="-1" ${bk.view <= minView ? "disabled" : ""} aria-label="Предыдущий месяц">‹</button>
    <b>${first.toLocaleDateString("ru-RU", { month: "long", year: "numeric" }).replace(" г.", "")}</b>
    <button class="cal__nav" type="button" data-nav="1" ${bk.view >= maxView ? "disabled" : ""} aria-label="Следующий месяц">›</button>
  </div><div class="cal__grid">`;
  ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].forEach((d) => (html += `<div class="cal__wd">${d}</div>`));
  for (let i = 0; i < shift; i++) html += "<span></span>";

  for (let d = 1; d <= days; d++) {
    const date = new Date(y, m, d), iso = isoDate(date);
    const isBusy = busy.has(iso);
    let disabled = date < t || date > last;
    if (!disabled) {
      if (selectingOut && date > parseISO(bk.in)) disabled = !rangeFree(bk.in, iso);
      else disabled = isBusy;
    }
    const cls = ["cal__day"];
    if (isBusy && !(selectingOut && !disabled && date > parseISO(bk.in))) cls.push("busy");
    if (bk.in === iso) cls.push("start");
    if (bk.out === iso) cls.push("end");
    if (bk.in && bk.out && date > parseISO(bk.in) && date < parseISO(bk.out)) cls.push("in-range");
    html += `<button type="button" class="${cls.join(" ")}" data-d="${iso}" ${disabled ? "disabled" : ""}>${d}</button>`;
  }
  html += `</div><div class="cal__legend"><span><i class="l-busy"></i>занято</span><span><i class="l-sel"></i>ваши даты</span></div>`;
  $("cal").innerHTML = html;
}

$("cal").addEventListener("click", (e) => {
  const nav = e.target.closest("[data-nav]");
  if (nav) { bk.view = new Date(bk.view.getFullYear(), bk.view.getMonth() + +nav.dataset.nav, 1); renderCal(); return; }
  const day = e.target.closest(".cal__day"); if (!day || day.disabled) return;
  const iso = day.dataset.d;
  if (!bk.in || bk.out || parseISO(iso) <= parseISO(bk.in)) {
    if (busy.has(iso)) return;
    bk.in = iso; bk.out = null;
  } else {
    bk.out = iso;
  }
  update();
});

/* ---------- Гости ---------- */
function renderGuests() {
  $("gCount").textContent = bk.guests;
  $("bGuestsText").textContent = `${bk.guests} ${plural(bk.guests, "гость", "гостя", "гостей")}`;
  $("gMinus").disabled = bk.guests <= 1;
  $("gPlus").disabled = bk.guests >= flat.guests;
}
$("gMinus").onclick = () => { bk.guests = Math.max(1, bk.guests - 1); renderGuests(); };
$("gPlus").onclick = () => { bk.guests = Math.min(flat.guests, bk.guests + 1); renderGuests(); };

/* ---------- Расчёт стоимости ---------- */
function getPrice() {
  const n = nightsBetween(bk.in, bk.out);
  const base = n * flat.price;
  const rate = n >= 28 ? 0.25 : n >= 14 ? 0.15 : 0;
  const discount = Math.round(base * rate);
  const total = base - discount;
  return { n, base, rate, discount, total, prepay: Math.round(total * 0.3) };
}
function calcHTML(p) {
  return `
    <li><span>${money(flat.price)} × ${p.n} ${plural(p.n, "ночь", "ночи", "ночей")}</span><span>${money(p.base)}</span></li>
    ${p.discount ? `<li><span>Скидка за ${p.n} ${plural(p.n, "ночь", "ночи", "ночей")} (−${p.rate * 100}%)</span><span style="color:var(--green)">−${money(p.discount)}</span></li>` : ""}
    <li><span>Уборка после выезда</span><span>Включена в стоимость</span></li>
    <li class="total"><span>Итого</span><span>${money(p.total)}</span></li>
    <li class="prepay"><span>Предоплата</span><span>${money(p.prepay)}</span></li>
    <li><span>При заезде</span><span>${money(p.total - p.prepay)}</span></li>
    <li><span>Залог (вернём при выезде)</span><span>${money(flat.deposit)}</span></li>`;
}

function update() {
  renderCal();
  $("bIn").textContent = bk.in ? fmtShort(bk.in) : "Выберите";
  $("bOut").textContent = bk.out ? fmtShort(bk.out) : "—";
  $("bInBox").classList.toggle("focus", !bk.in || !!bk.out);
  $("bOutBox").classList.toggle("focus", !!bk.in && !bk.out);
  const hint = $("bHint"), btn = $("bBtn"), calc = $("calc");
  hint.classList.remove("error");
  if (bk.in && bk.out) {
    const p = getPrice();
    calc.innerHTML = calcHTML(p); calc.hidden = false;
    btn.disabled = false; btn.textContent = `Забронировать за ${money(p.prepay)}`;
    hint.hidden = true;
    $("mbDates").textContent = `${fmtShort(bk.in)} — ${fmtShort(bk.out)} · ${money(p.total)}`;
  } else {
    calc.hidden = true; btn.disabled = true;
    btn.textContent = bk.in ? "Выберите дату выезда" : "Выберите даты";
    hint.hidden = false;
    hint.textContent = bk.in ? "Теперь нажмите на дату выезда" : "Нажмите на дату заезда в календаре";
    $("mbDates").textContent = "Выберите даты";
  }
}

/* Даты из поиска на главной */
(function prefill() {
  const pin = params.get("in"), pout = params.get("out"), g = +params.get("g");
  if (g) bk.guests = Math.min(Math.max(1, g), flat.guests);
  if (pin && pout && /^\d{4}-\d{2}-\d{2}$/.test(pin) && /^\d{4}-\d{2}-\d{2}$/.test(pout) &&
      parseISO(pin) >= today() && parseISO(pout) > parseISO(pin) && rangeFree(pin, pout)) {
    bk.in = pin; bk.out = pout;
    bk.view = new Date(parseISO(pin).getFullYear(), parseISO(pin).getMonth(), 1);
  }
})();
renderGuests();
update();

/* ---------- Оформление брони ---------- */
const modal = $("orderModal");
const openModal = () => { modal.classList.add("open"); document.body.style.overflow = "hidden"; };
const closeModal = () => { modal.classList.remove("open"); document.body.style.overflow = ""; };
modal.addEventListener("click", (e) => { if (e.target === modal || e.target.closest("[data-close]")) closeModal(); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeModal(); lb.classList.remove("open"); }
  if (lb.classList.contains("open") && e.key === "ArrowRight") showLb(lbIndex + 1);
  if (lb.classList.contains("open") && e.key === "ArrowLeft") showLb(lbIndex - 1);
});

$("bBtn").addEventListener("click", () => {
  if (!bk.in || !bk.out) return;
  const p = getPrice();
  $("orderSum").innerHTML = `<img src="${photo(flat.photos[0], 300)}" alt=""><div><b>${flat.title}</b>
    <span>${fmtLong(bk.in)} — ${fmtLong(bk.out)}</span>
    <span>${p.n} ${plural(p.n, "ночь", "ночи", "ночей")} · ${bk.guests} ${plural(bk.guests, "гость", "гостя", "гостей")}</span></div>`;
  $("orderCalc").innerHTML = calcHTML(p);
  $("payBtn").textContent = `Оплатить ${money(p.prepay)}`;
  $("orderStep").hidden = false; $("successStep").hidden = true;
  openModal();
});

$("orderForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const p = getPrice();
  const num = "НК-" + String(Math.floor(10000 + Math.random() * 89999));
  const name = $("oName").value.trim().split(" ")[0] || "гость";
  try {
    const saved = JSON.parse(localStorage.getItem("nk-bookings") || "[]");
    saved.push({ flat: flat.id, in: bk.in, out: bk.out, num });
    localStorage.setItem("nk-bookings", JSON.stringify(saved));
  } catch (err) { /* без хранилища тоже работает */ }

  $("successStep").innerHTML = `
    <div class="steps-mini" style="justify-content:center"><span>1. Данные</span><span>→</span><span class="on">2. Подтверждение</span></div>
    <div class="success__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12.5l4.5 4.5L19 7"/></svg></div>
    <h3>Бронь принята!</h3>
    <p class="muted">${name}, ждём вас в Петербурге.</p>
    <span class="success__num">Бронь № ${num}</span>
    <ul>
      <li><span>Квартира</span><span>${flat.title}</span></li>
      <li><span>Заезд</span><span>${fmtLong(bk.in)}, с 15:00</span></li>
      <li><span>Выезд</span><span>${fmtLong(bk.out)}, до 12:00</span></li>
      <li><span>Гости</span><span>${bk.guests}</span></li>
      <li><span>Предоплата</span><span>${money(p.prepay)}</span></li>
      <li><span>Доплата при заезде</span><span>${money(p.total - p.prepay)}</span></li>
    </ul>
    <p class="success__next">Договор и подтверждение отправили на <b>${$("oEmail").value}</b>.<br>За день до заезда пришлём адрес, код от замка и видео, как найти квартиру.</p>
    <button class="btn btn--green btn--full" type="button" data-close>Отлично</button>`;
  $("orderStep").hidden = true; $("successStep").hidden = false;
  modal.querySelector(".modal__box").scrollTop = 0;

  busy = busyNights(flat);
  bk.in = bk.out = null;
  e.target.reset();
  update();
});
