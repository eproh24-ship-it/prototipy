/* =========================================================
   ГЛАВНАЯ: поиск по датам, фильтры, карта, отзывы
   ========================================================= */
const state = { zone: "all", type: "all", minGuests: 0, in: null, out: null, guests: 0 };
const grid = document.getElementById("grid");

const previousFlat = document.getElementById("previousFlat");
const nextFlat = document.getElementById("nextFlat");

function updateCatalogControls() {
  previousFlat.disabled = grid.scrollLeft <= 2;
  nextFlat.disabled = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 2;
}

function scrollCatalog(direction) {
  const card = grid.querySelector(".card");
  if (!card) return;
  const step = card.offsetWidth + parseFloat(getComputedStyle(grid).columnGap);
  grid.scrollBy({
    left: direction * step,
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"
  });
}
previousFlat.addEventListener("click", () => scrollCatalog(-1));
nextFlat.addEventListener("click", () => scrollCatalog(1));
grid.addEventListener("scroll", updateCatalogControls, { passive: true });
new ResizeObserver(updateCatalogControls).observe(grid);

/* ---------- Каталог ---------- */
function renderCatalog() {
  let list = FLATS.filter((f) =>
    (state.zone === "all" || f.zone === state.zone) &&
    (state.type === "all" || f.type === state.type) &&
    f.guests >= Math.max(state.minGuests, state.guests)
  );
  let query = "";
  if (state.in && state.out) {
    list = list.filter((f) => isFree(f, state.in, state.out));
    query = `&in=${state.in}&out=${state.out}&g=${state.guests || 2}`;
  }
  grid.innerHTML = list.length
    ? list.map((f) => flatCard(f, query)).join("")
    : `<div class="empty"><h3>На эти даты всё занято</h3><p class="muted">Попробуйте сдвинуть даты на день-два или напишите нам — подберём вариант.</p><p style="margin-top:20px"><a class="btn btn--green" href="#contacts">Написать нам</a></p></div>`;
  if (!mapPanel.hidden) drawMap(list, query);
  grid.scrollLeft = 0;
  updateCatalogControls();
}

function setChip(groupId, attr, value) {
  document.querySelectorAll(`#${groupId} .chip`).forEach((c) => c.classList.toggle("active", c.dataset[attr] === value));
}

document.getElementById("typeChips").addEventListener("click", (e) => {
  const c = e.target.closest(".chip"); if (!c) return;
  state.type = c.dataset.type; state.minGuests = 0; setChip("typeChips", "type", state.type); renderCatalog();
});

/* Ссылки из блока «Для кого» сразу включают нужный фильтр */
document.querySelectorAll("[data-pick]").forEach((a) => a.addEventListener("click", () => {
  if (a.dataset.pick === "center-2") { state.zone = "center"; state.type = "studio"; state.minGuests = 0; }
  if (a.dataset.pick === "family") { state.zone = "all"; state.type = "all"; state.minGuests = 5; }
  setChip("typeChips", "type", state.type); renderCatalog();
}));

/* ---------- Поиск по датам ---------- */
const sIn = document.getElementById("sIn"), sOut = document.getElementById("sOut");
const t = today();
sIn.min = isoDate(t); sIn.max = isoDate(addDays(t, 118));
sIn.value = isoDate(addDays(t, 7)); sOut.value = isoDate(addDays(t, 10));
sOut.min = isoDate(addDays(t, 8)); sOut.max = isoDate(addDays(t, 120));
sIn.addEventListener("change", () => {
  if (!sIn.value) return;
  const minOut = addDays(parseISO(sIn.value), 1);
  sOut.min = isoDate(minOut);
  if (!sOut.value || parseISO(sOut.value) <= parseISO(sIn.value)) sOut.value = isoDate(addDays(parseISO(sIn.value), 2));
});

document.getElementById("search").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!sIn.value || !sOut.value || parseISO(sOut.value) <= parseISO(sIn.value)) { sOut.focus(); return; }
  state.in = sIn.value; state.out = sOut.value;
  state.guests = +document.getElementById("sGuests").value;
  state.zone = "all"; state.type = "all"; state.minGuests = 0;
  setChip("typeChips", "type", state.type);
  renderCatalog();

  const nights = Math.round((parseISO(state.out) - parseISO(state.in)) / 864e5);
  const fmt = (s) => parseISO(s).toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
  const count = grid.querySelectorAll(".card").length;
  document.getElementById("searchNoteText").innerHTML =
    `<b>${fmt(state.in)} — ${fmt(state.out)}</b> · ${nights} ${plural(nights, "ночь", "ночи", "ночей")} · ${state.guests} ${plural(state.guests, "гость", "гостя", "гостей")} — свободно ${count} ${plural(count, "квартира", "квартиры", "квартир")}`;
  document.getElementById("searchNote").classList.add("show");
  document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("searchReset").addEventListener("click", () => {
  state.in = state.out = null; state.guests = 0;
  document.getElementById("searchNote").classList.remove("show");
  renderCatalog();
});

/* ---------- Отзывы ---------- */
document.getElementById("reviewsList").innerHTML = REVIEWS.slice(0, 6).map((r) => reviewCard(r)).join("");

/* ---------- Карта ---------- */
const mapPanel = document.getElementById("catalogMap");
const mapToggle = document.getElementById("mapToggle");
const liveMap = document.getElementById("interactiveMap");
const apartmentMap = document.getElementById("apartmentMap");
const mapsKey = document.querySelector('meta[name="yandex-maps-api-key"]').content.trim();
let apiReady, liveInstance, mapVersion = 0;

function loadMaps() {
  if (!apiReady) apiReady = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=" + encodeURIComponent(mapsKey);
    script.onload = () => window.ymaps ? ymaps.ready(() => resolve(ymaps)) : reject();
    script.onerror = reject;
    document.head.append(script);
  });
  return apiReady;
}

async function drawMap(flats, query) {
  const version = ++mapVersion;
  liveMap.hidden = true;
  apartmentMap.hidden = !flats.length;
  if (!flats.length) return;
  const pins = flats.map(({coords: [lat, lon], id}) => lon + "," + lat + ",pm2rdm" + id);
  const first = flats[0].coords;
  const params = new URLSearchParams({lang: "ru_RU", pt: pins.join("~")});
  if (flats.length === 1) {
    params.set("ll", first[1] + "," + first[0]);
    params.set("z", "15");
  } else {
    const lons = flats.map(f => f.coords[1]), lats = flats.map(f => f.coords[0]);
    params.set("bbox", [Math.min(...lons) - .008, Math.min(...lats) - .007].join(",") + "~" +
      [Math.max(...lons) + .008, Math.max(...lats) + .007].join(","));
  }
  const src = "https://yandex.ru/map-widget/v1/?" + params;
  if (apartmentMap.src !== src) apartmentMap.src = src;
  if (!mapsKey) return;
  try {
    const api = await loadMaps();
    if (version !== mapVersion || mapPanel.hidden) return;
    liveMap.hidden = false;
    if (!liveInstance) {
      liveInstance = new api.Map(liveMap, {center: first, zoom: 12, controls: ["zoomControl"]});
      liveInstance.events.add("click", () => liveInstance.balloon.close());
    }
    liveInstance.container.fitToViewport();
    liveInstance.balloon.close();
    liveInstance.geoObjects.removeAll();
    for (const flat of flats) {
      const content = '<a class="map-preview" href="kvartira.html?id=' + flat.id + query + '">' +
        '<img src="' + photo(flat.photos[0], 400) + '" alt=""><strong>' + flat.title +
        '</strong><span>от ' + money(flat.price) + ' / ночь</span></a>';
      liveInstance.geoObjects.add(new api.Placemark(flat.coords, {
        hintContent: flat.title, balloonContentBody: content
      }, {preset: "islands#blueDotIcon", balloonPanelMaxMapArea: 0, hideIconOnBalloonOpen: false}));
    }
    if (flats.length === 1) liveInstance.setCenter(first, 15);
    else liveInstance.setBounds(liveInstance.geoObjects.getBounds(), {zoomMargin: 35, checkZoomRange: true});
    apartmentMap.hidden = true;
    liveInstance.container.fitToViewport();
  } catch {
    liveMap.hidden = true;
    apartmentMap.hidden = false;
  }
}

function setMapOpen(open) {
  mapPanel.hidden = !open;
  mapToggle.setAttribute("aria-expanded", String(open));
  mapToggle.textContent = open ? "Скрыть карту" : "Смотреть на карте";
  renderCatalog();
}
mapToggle.addEventListener("click", () => setMapOpen(mapPanel.hidden));
function openLinkedMap() {
  if (location.hash === "#mapToggle" || location.hash === "#districts") {
    setMapOpen(true);
    mapToggle.scrollIntoView({block: "center"});
  }
}
window.addEventListener("hashchange", openLinkedMap);
renderCatalog();
openLinkedMap();

/* ---------- Форма ---------- */
demoForm(document.getElementById("leadForm"));
