(function () {
  var T = window.typo || function (s) { return s; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var tx = function (s) { return esc(T(s || "")); };
  var money = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); };
  var secName = function (id) { var s = SECTIONS.filter(function (x) { return x.id === id; })[0]; return s ? s.name : ""; };

  function priceText(it) {
    if (!it.price) return "Цена по запросу";
    var unit = it.unit ? " ₽/" + it.unit.replace(/^за /, "") : " ₽";
    if (it.unit === "шт") unit = " ₽ за шт.";
    if (it.unit === "за панно") unit = " ₽ за панно";
    if (it.priceTo) return money(it.price) + "–" + money(it.priceTo) + unit;
    return (it.from ? "от " : "") + money(it.price) + unit;
  }
  var statusBadge = function (it) {
    return it.status === "few" ? '<span class="badge few">Количество ограничено</span>' : '<span class="badge">В наличии</span>';
  };

  function card(it) {
    return '<a class="card reveal" href="item.html?id=' + it.id + '">' +
      '<div class="ph"><span>Фото: ' + tx(it.title) + '</span></div>' +
      '<div class="body"><span class="sec">' + tx(secName(it.sec)) + '</span>' + statusBadge(it) +
      '<h3>' + tx(it.title) + '</h3><span class="short">' + tx(it.short) + '</span>' +
      '<span class="price' + (it.price ? "" : " ask") + '">' + priceText(it) + '</span></div></a>';
  }

  /* Главная: разделы и позиции */
  var secBox = $("#sections");
  if (secBox) {
    secBox.innerHTML = SECTIONS.map(function (s) {
      var prices = ITEMS.filter(function (i) { return i.sec === s.id && i.price; }).map(function (i) { return i.price; });
      var from = prices.length ? "от " + money(Math.min.apply(null, prices)) + " ₽" : "Цена по запросу";
      return '<a class="cat reveal" href="catalog.html?sec=' + s.id + '"><div class="ph arch"><span>Фото раздела</span></div>' +
        '<h3>' + tx(s.name) + '</h3><span class="from">' + from + '</span><p>' + tx(s.fact) + '</p></a>';
    }).join("");
  }
  var pick = $("#picks");
  if (pick) {
    var ids = ["d-black", "kids-wallpaper", "flex-stone", "tropic-panno"];
    pick.innerHTML = ids.map(function (id) { return card(ITEMS.filter(function (i) { return i.id === id; })[0]); }).join("");
  }
  var rev = $("#reviews");
  if (rev) {
    rev.innerHTML = REVIEWS.map(function (r) {
      return '<div class="review reveal"><q>«' + tx(r.text) + '»</q><div class="who">' + tx(r.who) + ", " + tx(r.date) + ' · отзыв с сайта martdecor.ru</div></div>';
    }).join("");
  }
  var tips = $("#tips-list");
  if (tips) {
    tips.innerHTML = ARTICLES.map(function (a) {
      return '<a class="tip reveal" href="article.html?id=' + a.id + '"><div class="ph arch"><span>Фото к статье</span></div>' +
        '<span class="eyebrow">Совет</span><h3>' + tx(a.title) + '</h3><p class="muted">' + tx(a.lead) + '</p></a>';
    }).join("");
  }
  var faq = $("#faq");
  if (faq) {
    faq.innerHTML = FAQ.map(function (f, i) {
      return '<details' + (i === 0 ? " open" : "") + '><summary>' + tx(f.q) + '</summary><p>' + tx(f.a) +
        (f.need ? ' <span class="need"><b>Нужно от вас:</b> ' + tx(f.need) + '</span>' : "") +
        ' <span class="src">Источник: ' + tx(f.src) + '</span></p></details>';
    }).join("");
  }

  /* Открыто сейчас — по времени Ростова (МСК) */
  document.querySelectorAll("[data-open-now]").forEach(function (el) {
    var parts = new Intl.DateTimeFormat("ru-RU", { timeZone: "Europe/Moscow", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
    var get = function (t) { return (parts.filter(function (p) { return p.type === t; })[0] || {}).value; };
    var wd = get("weekday"), m = +get("hour") * 60 + +get("minute");
    var weekend = /сб|вс/i.test(wd), close = weekend ? 17 * 60 : 19 * 60;
    var open = m >= 600 && m < close;
    el.classList.toggle("closed", !open);
    el.textContent = open ? "Открыто сейчас, до " + (weekend ? "17:00" : "19:00") : "Сейчас закрыто, откроемся в 10:00";
  });

  /* Каталог */
  var list = $("#list");
  if (list) {
    var params = new URLSearchParams(location.search);
    var state = { sec: params.get("sec") || "", place: "", priced: false, q: "" };
    var secChips = $("#f-sec"), placeChips = $("#f-place");
    secChips.innerHTML = '<button class="chip" data-v="">Все</button>' + SECTIONS.map(function (s) { return '<button class="chip" data-v="' + s.id + '">' + tx(s.name) + '</button>'; }).join("");
    placeChips.innerHTML = '<button class="chip" data-v="">Везде</button>' + PLACES.map(function (p) { return '<button class="chip" data-v="' + esc(p) + '">' + tx(p) + '</button>'; }).join("");
    function mark() {
      secChips.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("on", c.dataset.v === state.sec); });
      placeChips.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("on", c.dataset.v === state.place); });
    }
    function render() {
      var q = state.q.trim().toLowerCase();
      var res = ITEMS.filter(function (i) {
        return (!state.sec || i.sec === state.sec) && (!state.place || i.places.indexOf(state.place) >= 0) &&
          (!state.priced || i.price) && (!q || (i.title + " " + i.short + " " + secName(i.sec)).toLowerCase().indexOf(q) >= 0);
      });
      list.innerHTML = res.map(card).join("");
      $("#empty").style.display = res.length ? "none" : "block";
      $("#count").textContent = "Показано позиций: " + res.length + " из " + ITEMS.length + " в выборке";
      $("#cat-title").textContent = state.sec ? secName(state.sec) : "Каталог материалов";
      mark(); reveal();
    }
    secChips.addEventListener("click", function (e) { if (e.target.dataset.v !== undefined) { state.sec = e.target.dataset.v; render(); } });
    placeChips.addEventListener("click", function (e) { if (e.target.dataset.v !== undefined) { state.place = e.target.dataset.v; render(); } });
    $("#f-priced").addEventListener("change", function (e) { state.priced = e.target.checked; render(); });
    $("#q").addEventListener("input", function (e) { state.q = e.target.value; render(); });
    render();
  }

  /* Карточка позиции */
  var itemBox = $("#item");
  if (itemBox) {
    var id = new URLSearchParams(location.search).get("id") || ITEMS[0].id;
    var it = ITEMS.filter(function (i) { return i.id === id; })[0] || ITEMS[0];
    document.title = it.title + " — МАРТдекор";
    $("#crumb-sec").textContent = secName(it.sec);
    $("#crumb-sec").href = "catalog.html?sec=" + it.sec;
    $("#crumb-item").textContent = T(it.title);
    var orac = /orac/i.test(it.id);
    itemBox.innerHTML =
      '<div class="gallery"><div class="ph"><span>Фото: ' + tx(it.title) + ' в интерьере</span></div><div class="ph"><span>Фото фактуры крупно</span></div><div class="ph"><span>Фото в салоне</span></div></div>' +
      '<div><span class="eyebrow">' + tx(secName(it.sec)) + '</span><h1 style="font-size:36px">' + tx(it.title) + '</h1>' +
      '<p class="muted">' + tx(it.short) + '</p>' + statusBadge(it) +
      '<div class="item-price">' + priceText(it) + '</div>' +
      '<div class="item-actions"><a class="btn" href="#order">Узнать наличие и цену</a>' +
      (orac ? '<a class="btn ghost" href="#order">Взять на примерку</a>' : '<a class="btn ghost" href="#order">Посмотреть в салоне</a>') + '</div>' +
      '<table class="specs">' + it.specs.map(function (s) { return '<tr><td>' + tx(s[0]) + '</td><td>' + tx(s[1]) + '</td></tr>'; }).join("") + '</table>' +
      '<div class="box"><h4>Плюсы</h4><ul class="pros">' + it.pros.map(function (p) { return '<li>' + tx(p) + '</li>'; }).join("") + '</ul>' +
      (it.needs ? '<h4>Что учесть</h4><p style="margin:0">' + tx(it.needs) + '</p>' : "") + '</div>' +
      '<div class="box"><h4>Где применить</h4><p style="margin:0">' + tx(it.who) + '</p></div>' +
      '<p class="src">Источник: ' + tx(it.src) + '. Наличие — для примера.</p></div>';
    var more = $("#more");
    if (more) more.innerHTML = ITEMS.filter(function (i) { return i.sec === it.sec && i.id !== it.id; }).slice(0, 4).map(card).join("");
    var hidden = $("#order-item");
    if (hidden) hidden.value = it.title;
  }

  /* Статья */
  var art = $("#article");
  if (art) {
    var aid = new URLSearchParams(location.search).get("id") || ARTICLES[0].id;
    var a = ARTICLES.filter(function (x) { return x.id === aid; })[0] || ARTICLES[0];
    document.title = a.title + " — МАРТдекор";
    var html = '<div class="crumbs"><a href="index.html">Главная</a> / <a href="index.html#tips">Советы</a></div>' +
      '<span class="eyebrow">Совет от салона</span><h1 style="font-size:42px">' + tx(a.title) + '</h1><p class="lead">' + tx(a.lead) + '</p>' +
      '<div class="ph arch"><span>Фото к статье — из проектов салона</span></div>';
    a.body.forEach(function (b) {
      if (b[0] === "p") html += '<p>' + tx(b[1]) + '</p>';
      if (b[0] === "h2") html += '<h2>' + tx(b[1]) + '</h2>';
      if (b[0] === "ul" || b[0] === "ol") html += '<' + b[0] + '>' + b[1].map(function (li) { return '<li>' + tx(li) + '</li>'; }).join("") + '</' + b[0] + '>';
    });
    html += '<p class="src">По материалам поста салона: ' + tx(a.src) + '</p>' +
      '<div class="box"><h4>Подберём материал под ваш проект</h4><p>Приезжайте в салон с проектом или фото — подбор всех материалов для стен займёт не больше 6 часов.</p><a class="btn small" href="index.html#order">Записаться на подбор</a></div>';
    art.innerHTML = html;
  }

  /* Формы — демо */
  document.querySelectorAll("form[data-demo]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      f.style.display = "none";
      var t = f.parentNode.querySelector(".thanks");
      if (t) t.style.display = "block";
    });
  });

  /* Появление при прокрутке */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: .08 }) : null;
  function reveal() { document.querySelectorAll(".reveal:not(.in)").forEach(function (el) { io ? io.observe(el) : el.classList.add("in"); }); }
  reveal();
})();
