/* =========================================================
   ДАННЫЕ САЙТА «НЕВСКИЙ КВАРТАЛ»
   Все квартиры, цены и отзывы вымышлены.
   Чтобы поменять квартиру — правьте текст в блоке { ... }.
   ========================================================= */

// Фото с Unsplash (бесплатный фотобанк)
const photo = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const P = {
  kitchenWhite: "1484154218962-a197022b5858", livingBlue: "1493809842364-78817add7ffb", loftStairs: "1502005229762-cf1b2da7c5d6",
  livingLight: "1502672260266-1c1ef2d93688", livingNavy: "1505691938895-1758d7feb511", bedroomWhite: "1512918728675-ed5a9ecdebfd",
  studioWhite: "1513694203232-719a280e022f", livingKitchen: "1522708323590-d24dbb6b0267", bedroomLamp: "1522771739844-6a9f6d5f14af",
  bedroomOrange: "1540518614846-7eded433c457", bath1: "1552321554-5fefe8c9ef14", livingCognac: "1554995207-c18c203602cb",
  bath2: "1556020685-ae41abfc9365", kitchen2: "1556912173-46c336c7fd55", dining: "1560185007-cde436f6a4d0",
  bedroomRug: "1560185893-a55cbc8c57e8", livingBig: "1560448204-e02f11c3d0e2", kitchen3: "1565183928294-7063f23ce0f8",
  livingSoft: "1567767292278-a4f21aa2d36e", bedroomPillows: "1571508601891-ca5e7a713859", bedroomWood: "1578683010236-d716f9a3f461",
  livingPlants: "1583847268964-b28dc8f51f92", bath3: "1584622650111-993a426fbf0a", yellowChair: "1586023492125-27b2c045efd7",
  bedroomGrey: "1595526114035-0d45ed16cfbf", livingWhite: "1598928506311-c55ded91a20c", livingClassic: "1600121848594-d8644e57abab",
  livingWarm: "1600210492486-724fe5c67fb0", livingLoft: "1600566753086-00f18fb6b3ea", livingDark: "1600607687939-ce8a6c25118c",
  kitchenWood: "1604014237800-1c9102c219da", livingSage: "1615529182904-14819c35db37", bedroomDark: "1616594039964-ae9021a400a0",
  diningGreen: "1617806118233-18e1de247200", livingFireplace: "1618221195710-dd6b41faaea6", bathStone: "1620626011761-996317b8d101",
  bedroomHotel: "1631049307264-da0ec9d70304", livingCream: "1632829882891-5047ccc421bc",
  bridge: "1556610961-2fecc5927173", cathedral: "1548834925-e48f8a27ae6f",
};

const FLATS = [
  {
    id: 1, slug: "fontanka", type: "studio", zone: "center",
    title: "Студия с видом на Фонтанку",
    district: "Центральный район", metro: "Гостиный двор · 6 мин", address: "наб. реки Фонтанки, 00",
    guests: 2, area: 34, beds: "1 двуспальная кровать", floor: "4 из 5",
    price: 7500, cleaning: 1500, deposit: 10000, rating: 4.9, reviews: 38,
    coords: [59.9330, 30.3430],
    photos: [P.studioWhite, P.livingPlants, P.kitchenWhite, P.bath1, P.yellowChair],
    short: "Окна на набережную, кровать с ортопедическим матрасом, кофемашина.",
    text: [
      "Светлая студия в доходном доме 1880-х годов. Два высоких окна смотрят прямо на Фонтанку — утром здесь хорошо пить кофе и смотреть на прогулочные катера.",
      "Внутри — спокойный скандинавский интерьер: большая кровать, рабочий стол у окна, кухня со всей посудой. До Невского проспекта три минуты пешком, до Эрмитажа — двадцать.",
    ],
    features: ["Вид на воду", "Рабочее место", "Кофемашина"],
  },
  {
    id: 2, slug: "kazanskiy", type: "studio", zone: "center",
    title: "Студия у Казанского собора",
    district: "Центральный район", metro: "Невский проспект · 3 мин", address: "ул. Казанская, 00",
    guests: 2, area: 31, beds: "1 двуспальная кровать", floor: "3 из 6",
    price: 8200, cleaning: 1500, deposit: 10000, rating: 5.0, reviews: 27,
    coords: [59.9345, 30.3225],
    photos: [P.livingSage, P.bedroomPillows, P.kitchen2, P.bath3, P.livingCream],
    short: "Шаг до Невского, тихий двор, дизайнерский интерьер в оливковых тонах.",
    text: [
      "Студия в двух минутах от Казанского собора, но окна выходят в тихий зелёный двор — ночью здесь не слышно Невского.",
      "Интерьер в мягких оливковых и молочных тонах, льняное бельё, ванная с тропическим душем. Отличный вариант для пары на выходные.",
    ],
    features: ["Тихий двор", "Тропический душ", "Льняное бельё"],
  },
  {
    id: 3, slug: "rubinshteyna", type: "studio", zone: "center",
    title: "Студия-мансарда на Рубинштейна",
    district: "Центральный район", metro: "Достоевская · 5 мин", address: "ул. Рубинштейна, 00",
    guests: 3, area: 42, beds: "1 двуспальная кровать + диван", floor: "6 из 6, лифт",
    price: 6900, cleaning: 1500, deposit: 10000, rating: 4.8, reviews: 44,
    coords: [59.9290, 30.3460],
    photos: [P.livingLoft, P.bedroomWood, P.loftStairs, P.bath2, P.livingSoft],
    short: "Мансарда с деревянными балками на главной гастрономической улице города.",
    text: [
      "Мансарда под самой крышей: деревянные балки, мансардные окна и вид на петербургские крыши. Внизу — улица Рубинштейна с лучшими ресторанами и барами города.",
      "Есть раскладной диван, поэтому можно приехать втроём. Окна с хорошей шумоизоляцией — выспаться получится даже в пятницу.",
    ],
    features: ["Вид на крыши", "До 3 гостей", "Рестораны рядом"],
  },
  {
    id: 4, slug: "moyka", type: "one", zone: "center",
    title: "Однушка с камином на Мойке",
    district: "Адмиралтейский район", metro: "Адмиралтейская · 7 мин", address: "наб. реки Мойки, 00",
    guests: 3, area: 58, beds: "1 двуспальная кровать + диван", floor: "2 из 5",
    price: 10500, cleaning: 2000, deposit: 15000, rating: 5.0, reviews: 31,
    coords: [59.9378, 30.3175],
    photos: [P.livingFireplace, P.bedroomDark, P.diningGreen, P.bathStone, P.livingWarm],
    short: "Настоящий камин, потолки 3,8 м, отдельная спальня. В 10 минутах от Эрмитажа.",
    text: [
      "Квартира в особняке XIX века на набережной Мойки: потолки 3,8 метра, лепнина, дубовый паркет и работающий биокамин в гостиной.",
      "Отдельная спальня с тёмными стенами и плотными шторами — для крепкого сна. В гостиной — диван для третьего гостя и обеденный стол на четверых.",
    ],
    features: ["Камин", "Потолки 3,8 м", "Отдельная спальня"],
  },
  {
    id: 5, slug: "petrogradka", type: "one", zone: "center",
    title: "Однушка в доме 1904 года на Петроградке",
    district: "Петроградский район", metro: "Горьковская · 4 мин", address: "Каменноостровский пр., 00",
    guests: 3, area: 52, beds: "1 двуспальная кровать + диван", floor: "3 из 6",
    price: 9800, cleaning: 2000, deposit: 15000, rating: 4.9, reviews: 22,
    coords: [59.9590, 30.3140],
    photos: [P.livingClassic, P.bedroomWhite, P.dining, P.bath1, P.livingWhite],
    short: "Дом в стиле модерн, эркер с видом на проспект, рядом Петропавловская крепость.",
    text: [
      "Квартира в доходном доме эпохи модерна на Каменноостровском проспекте. В гостиной — эркер с тремя окнами и столом, где удобно завтракать и работать.",
      "До Петропавловской крепости — 10 минут пешком, до Александровского парка — пять. Рядом много кофеен и пекарен.",
    ],
    features: ["Эркер", "Модерн", "Парк рядом"],
  },
  {
    id: 6, slug: "isaakiy", type: "two", zone: "center",
    title: "Двушка с видом на Исаакий",
    district: "Адмиралтейский район", metro: "Адмиралтейская · 5 мин", address: "ул. Большая Морская, 00",
    guests: 5, area: 86, beds: "2 двуспальные кровати + диван", floor: "5 из 6, лифт",
    price: 14900, cleaning: 2500, deposit: 20000, rating: 5.0, reviews: 19,
    coords: [59.9330, 30.3070],
    photos: [P.livingDark, P.bedroomHotel, P.kitchenWood, P.bedroomGrey, P.bath3],
    short: "Купол Исаакиевского собора из окна гостиной. Две спальни и две ванные.",
    text: [
      "Наша самая просторная квартира в центре: из окон гостиной виден купол Исаакиевского собора. Две отдельные спальни, две ванные комнаты, кухня-гостиная с островом.",
      "Подходит для семьи или компании друзей до пяти человек. Посудомоечная машина, стиральная и сушильная машины, детская кроватка по запросу.",
    ],
    features: ["Вид на Исаакий", "2 ванные", "До 5 гостей"],
  },
  {
    id: 7, slug: "park-pobedy", type: "studio", zone: "sleep",
    title: "Студия у парка Победы",
    district: "Московский район", metro: "Парк Победы · 4 мин", address: "Московский пр., 00",
    guests: 2, area: 33, beds: "1 двуспальная кровать", floor: "9 из 12, лифт",
    price: 6000, cleaning: 1200, deposit: 10000, rating: 4.9, reviews: 51,
    coords: [59.8665, 30.3225],
    photos: [P.livingKitchen, P.bedroomLamp, P.kitchen3, P.bath2, P.livingBlue],
    short: "Тихий зелёный район, 15 минут на метро до Невского. Удобно в командировку.",
    text: [
      "Современная студия в сталинском доме на Московском проспекте. Под окнами — парк Победы с прудами, где удобно бегать по утрам.",
      "До метро четыре минуты, до Невского — 15 минут без пересадок, до аэропорта Пулково — 20 минут на такси. Удобный стол для работы и быстрый Wi-Fi.",
    ],
    features: ["Парк рядом", "20 мин до Пулково", "Быстрый Wi-Fi"],
  },
  {
    id: 8, slug: "zaliv", type: "studio", zone: "sleep",
    title: "Студия с видом на залив",
    district: "Приморский район", metro: "Беговая · 8 мин", address: "ул. Савушкина, 00",
    guests: 2, area: 36, beds: "1 двуспальная кровать", floor: "17 из 24, лифт",
    price: 6500, cleaning: 1200, deposit: 10000, rating: 4.8, reviews: 36,
    coords: [59.9870, 30.2080],
    photos: [P.livingBig, P.bedroomRug, P.kitchen2, P.bathStone, P.livingLight],
    short: "Панорамные окна на Финский залив и закаты. Рядом Лахта Центр и набережная.",
    text: [
      "Студия на 17-м этаже нового дома с панорамными окнами на Финский залив. Отсюда видно Лахта Центр и самые красивые закаты в городе.",
      "Рядом парк 300-летия Петербурга и набережная для прогулок. В доме есть подземный паркинг — место можно забронировать вместе с квартирой.",
    ],
    features: ["Панорамные окна", "Закаты", "Паркинг"],
  },
  {
    id: 9, slug: "krestovskiy", type: "one", zone: "sleep",
    title: "Однушка с террасой у Крестовского",
    district: "Приморский район", metro: "Старая Деревня · 6 мин", address: "ул. Торфяная дорога, 00",
    guests: 3, area: 48, beds: "1 двуспальная кровать + диван", floor: "8 из 8",
    price: 8500, cleaning: 1500, deposit: 15000, rating: 4.9, reviews: 24,
    coords: [59.9895, 30.2560],
    photos: [P.livingCognac, P.bedroomOrange, P.kitchenWhite, P.bath3, P.livingNavy],
    short: "Своя терраса 15 м² на последнем этаже. 10 минут до Крестовского острова.",
    text: [
      "Квартира на последнем этаже со своей террасой: летом здесь ужинают на закате, есть шезлонги и уличный стол.",
      "До Крестовского острова и стадиона — 10 минут пешком через мост, до Елагина острова — 15. Хороший выбор для поездки на концерт или матч.",
    ],
    features: ["Своя терраса", "Стадион рядом", "Последний этаж"],
  },
  {
    id: 10, slug: "pulkovskiy", type: "two", zone: "sleep",
    title: "Двушка для семьи у Пулковского парка",
    district: "Московский район", metro: "Звёздная · 7 мин", address: "ул. Пулковская, 00",
    guests: 5, area: 72, beds: "2 двуспальные кровати + диван", floor: "5 из 16, лифт",
    price: 11000, cleaning: 2000, deposit: 15000, rating: 5.0, reviews: 17,
    coords: [59.8340, 30.3300],
    photos: [P.livingSoft, P.bedroomGrey, P.kitchenWood, P.bath1, P.livingPlants],
    short: "Две спальни, детская кроватка и стульчик, закрытый двор. 10 минут до Пулково.",
    text: [
      "Просторная квартира для семьи с детьми: две отдельные спальни, большая кухня-гостиная, детская кроватка, стульчик для кормления и игрушки.",
      "Закрытый двор с детской площадкой, рядом Пулковский парк и большой торговый центр. До аэропорта — 10 минут на такси, удобно перед ранним рейсом.",
    ],
    features: ["Для детей", "10 мин до Пулково", "Закрытый двор"],
  },
];

const TYPE_NAME = { studio: "Студия", one: "1-комнатная", two: "2-комнатная" };
const ZONE_NAME = { center: "Центр", sleep: "Спальный район" };

const REVIEWS = [
  { flat: 1, name: "Анна", city: "Москва", date: "октябрь 2026", rating: 5, text: "Проснулись, открыли шторы — а там Фонтанка и катера. Квартира чище, чем в отеле, кофе и сливки уже ждали в холодильнике." },
  { flat: 6, name: "Семья Ковалёвых", city: "Екатеринбург", date: "сентябрь 2026", rating: 5, text: "Приехали вчетвером с детьми. Две ванные — это спасение по утрам. Детскую кроватку поставили заранее, даже просить не пришлось." },
  { flat: 7, name: "Игорь", city: "Казань", date: "октябрь 2026", rating: 5, text: "Жил неделю в командировке. Закрывающие документы прислали в тот же день, бухгалтерия приняла без вопросов. Wi-Fi быстрый, стол удобный." },
  { flat: 4, name: "Марина и Олег", city: "Новосибирск", date: "август 2026", rating: 5, text: "Камин, высоченные потолки и тишина, хотя до Эрмитажа 10 минут. Отмечали годовщину — это было лучшее решение." },
  { flat: 8, name: "Дарья", city: "Самара", date: "июль 2026", rating: 5, text: "Каждый вечер смотрели закат над заливом. Заселение по коду в 23:40 после позднего поезда — никаких проблем." },
  { flat: 3, name: "Кирилл", city: "Минск", date: "сентябрь 2026", rating: 4, text: "Мансарда очень атмосферная, рестораны прямо под домом. Единственное — шестой этаж, но лифт есть, так что не страшно." },
  { flat: 2, name: "Елена", city: "Москва", date: "октябрь 2026", rating: 5, text: "Окна во двор — тишина полная, хотя Невский в двух шагах. Бельё льняное, очень приятно. Приедем ещё." },
  { flat: 5, name: "Тимур", city: "Сочи", date: "июнь 2026", rating: 5, text: "Эркер — любимое место, завтракали там каждое утро. Петроградка — отдельный город, советую погулять." },
  { flat: 9, name: "Ольга", city: "Нижний Новгород", date: "июль 2026", rating: 5, text: "Приехали на концерт на стадион. Терраса — восторг, сидели до часу ночи, белые ночи же." },
  { flat: 10, name: "Наталья", city: "Мурманск", date: "август 2026", rating: 5, text: "Летели с двумя детьми ранним рейсом — до Пулково 10 минут. В квартире было всё для малышей, даже горшок." },
  { flat: 1, name: "Сергей", city: "Тверь", date: "сентябрь 2026", rating: 5, text: "Отличное расположение, всё пешком. Администратор ответил за пару минут, когда я не мог найти парадную." },
  { flat: 6, name: "Алина", city: "Краснодар", date: "октябрь 2026", rating: 5, text: "Купол Исаакия из окна — вау. Ездили компанией из пяти человек, места хватило всем." },
  { flat: 7, name: "Виктория", city: "Пермь", date: "сентябрь 2026", rating: 5, text: "Бегала по утрам в парке Победы. До центра реально 15 минут, а цена ниже, чем в центре." },
  { flat: 8, name: "Максим", city: "Москва", date: "август 2026", rating: 5, text: "Оставили машину на паркинге в доме, удобно. Вид на Лахту ночью очень красивый." },
];

/* ---------- Помощники ---------- */
const money = (n) => Math.round(n).toLocaleString("ru-RU") + " ₽";
const plural = (n, one, few, many) => {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
  return many;
};
const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parseISO = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };

/* ---------- Занятые даты (демо) ----------
   Для каждой квартиры «случайно», но всегда одинаково отмечаем
   занятые ночи на 120 дней вперёд. Плюс брони, сделанные на этом сайте. */
function busyNights(flat) {
  const set = new Set();
  let seed = flat.id * 9301 + 49297;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  let d = today();
  const end = addDays(today(), 120);
  d = addDays(d, Math.floor(rnd() * 3));
  while (d < end) {
    const len = 2 + Math.floor(rnd() * 4);   // бронь 2–5 ночей
    for (let i = 0; i < len; i++) set.add(isoDate(addDays(d, i)));
    d = addDays(d, len + 2 + Math.floor(rnd() * 6)); // свободно 2–7 ночей
  }
  try {
    const saved = JSON.parse(localStorage.getItem("nk-bookings") || "[]");
    saved.filter((b) => b.flat === flat.id).forEach((b) => {
      for (let x = parseISO(b.in); x < parseISO(b.out); x = addDays(x, 1)) set.add(isoDate(x));
    });
  } catch (e) { /* хранилище недоступно — не страшно */ }
  return set;
}

function isFree(flat, inISO, outISO) {
  const busy = busyNights(flat);
  for (let x = parseISO(inISO); x < parseISO(outISO); x = addDays(x, 1)) {
    if (busy.has(isoDate(x))) return false;
  }
  return true;
}

function stars(r) {
  return `<span class="stars" aria-label="Рейтинг ${r}">★ ${r.toFixed(1).replace(".", ",")}</span>`;
}

/* ---------- Карточка квартиры (общая для главной и «похожих») ---------- */
function flatCard(f, query = "") {
  return `
  <a class="card" href="kvartira.html?id=${f.id}${query}">
    <div class="card__img">
      <img src="${photo(f.photos[0], 800)}" alt="${f.title}" loading="lazy">
      <span class="card__zone card__zone--${f.zone}">${ZONE_NAME[f.zone]}</span>
    </div>
    <div class="card__body">
      <div class="card__top"><span class="card__metro">${f.metro}</span>${stars(f.rating)}</div>
      <h3 class="card__title">${f.title}</h3>
      <p class="card__short">${f.short}</p>
      <ul class="card__specs">
        <li>${TYPE_NAME[f.type]}</li><li>${f.area} м²</li><li>до ${f.guests} ${plural(f.guests, "гостя", "гостей", "гостей")}</li>
      </ul>
      <div class="card__bottom">
        <p class="card__price">от <b>${money(f.price)}</b> <span>/ ночь</span></p>
        <span class="card__btn">Выбрать даты →</span>
      </div>
    </div>
  </a>`;
}

/* ---------- Карта (Leaflet) ---------- */
function makeMap(el, flats, opts = {}) {
  if (!window.L || !el) return null;
  const map = L.map(el, { scrollWheelZoom: false, zoomControl: true }).setView(opts.center || [59.92, 30.30], opts.zoom || 11);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);
  flats.forEach((f) => {
    const icon = L.divIcon({ className: "", html: `<div class="pin pin--${f.zone}">${money(f.price).replace(" ₽", "")}</div>`, iconSize: null });
    L.marker(f.coords, { icon }).addTo(map)
      .bindPopup(`<a class="pop" href="kvartira.html?id=${f.id}"><img src="${photo(f.photos[0], 400)}" alt=""><b>${f.title}</b><span>от ${money(f.price)} / ночь</span></a>`);
  });
  return map;
}

/* ---------- Общее для всех страниц: меню на телефоне ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  if (burger && nav) {
    burger.addEventListener("click", () => { nav.classList.toggle("open"); burger.classList.toggle("open"); });
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => { nav.classList.remove("open"); burger.classList.remove("open"); }));
  }
  const header = document.querySelector(".header");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  initReveal();
});

/* ---------- Плавное появление блоков при прокрутке ---------- */
function initReveal(root = document) {
  const items = root.querySelectorAll(".reveal:not(.visible)");
  if (!("IntersectionObserver" in window)) { items.forEach((el) => el.classList.add("visible")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  items.forEach((el) => io.observe(el));
}

/* ---------- Отзыв (общий шаблон) ---------- */
const AVATAR_COLORS = ["#3e5a4d", "#b08d57", "#8a837b", "#5b6b78", "#7a5c4f"];
function reviewCard(r, withFlat = true) {
  const f = FLATS.find((x) => x.id === r.flat);
  return `
  <figure class="review">
    <div class="review__stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
    <blockquote>${r.text}</blockquote>
    ${withFlat && f ? `<a class="review__flat" href="kvartira.html?id=${f.id}">${f.title} →</a>` : ""}
    <figcaption class="review__who">
      <span class="avatar" style="background:${AVATAR_COLORS[r.name.length % AVATAR_COLORS.length]}">${r.name[0]}</span>
      <div><b>${r.name}</b><span>${r.city} · ${r.date}</span></div>
    </figcaption>
  </figure>`;
}

/* ---------- Демо-формы заявок ---------- */
function demoForm(form) {
  if (!form) return;
  form.addEventListener("submit", (e) => { e.preventDefault(); form.classList.add("sent"); });
}
