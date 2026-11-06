(function () {
  var T = window.typo || function (s) { return s; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var tx = function (s) { return esc(T(s || "")); };
  var num = function (n, d) {
    var s = Number(n).toFixed(d === undefined ? (n % 1 ? 2 : 0) : d).replace(".", ",");
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  var secName = function (id) { var s = SECTIONS.filter(function (x) { return x.id === id; })[0]; return s ? s.name : ""; };
  var byId = function (id) { return ITEMS.filter(function (i) { return i.id === id; })[0]; };

  function priceText(it) {
    if (it.unit === "шт") {
      if (it.priceTo) return num(it.price) + "–" + num(it.priceTo) + " ₽ за шт.";
      return num(it.price) + " ₽ за шт.";
    }
    return (it.from ? "от " : "") + num(it.price) + " ₽ " + it.unit;
  }
  function badges(it) {
    return '<div class="badges">' + (it.logo ? '<span class="badge logo">С вашим логотипом</span>' :
      (it.status === "few" ? '<span class="badge few">Мало на складе</span>' : '<span class="badge">На складе</span>')) + '</div>';
  }
  function card(it) {
    return '<a class="card reveal" href="item.html?id=' + it.id + '">' +
      '<div class="ph"><span>Фото: ' + tx(it.title) + '</span></div>' +
      '<div class="body"><span class="sec">' + tx(secName(it.sec)) + '</span>' + badges(it) +
      '<h3>' + tx(it.title) + '</h3><span class="short">' + tx(it.short) + '</span>' +
      '<span class="price">' + tx(priceText(it)) + (it.pack ? ' <span class="pack">· ' + tx(it.pack) + '</span>' : "") + '</span></div></a>';
  }

  /* Главная */
  var secBox = $("#sections");
  if (secBox) {
    secBox.innerHTML = SECTIONS.map(function (s) {
      var prices = ITEMS.filter(function (i) { return i.sec === s.id && i.unit === "шт"; }).map(function (i) { return i.price; });
      var from = prices.length ? "от " + num(Math.min.apply(null, prices)) + " ₽ за шт." : "";
      return '<a class="cat reveal" href="catalog.html?sec=' + s.id + '"><div class="ph"><span>Фото раздела</span></div>' +
        '<h3>' + tx(s.name) + '</h3><span class="from">' + from + '</span><p>' + tx(s.fact) + '</p></a>';
    }).join("");
  }
  var picks = $("#picks");
  if (picks) picks.innerHTML = ["craft", "vafholder", "list", "skorobok"].map(function (id) { return card(byId(id)); }).join("");
  var cl = $("#clients");
  if (cl) cl.innerHTML = CLIENTS.map(function (c) { return "<span>" + tx(c) + "</span>"; }).join("");
  var rev = $("#reviews");
  if (rev) rev.innerHTML = REVIEWS.map(function (r) {
    return '<div class="review reveal"><div class="stars">★★★★★</div><q>«' + tx(r.text) + '»</q><div class="who">' + tx(r.who) + ' <span>· ' + tx(r.date) + ' · Яндекс Карты</span></div></div>';
  }).join("");
  var tips = $("#tips-list");
  if (tips) tips.innerHTML = ARTICLES.map(function (a) {
    return '<a class="tip reveal" href="article.html?id=' + a.id + '"><div class="ph"><span>Фото к статье</span></div><div>' +
      '<span class="eyebrow">Советы фабрики</span><h3>' + tx(a.title) + '</h3><p class="muted">' + tx(a.lead) + '</p></div></a>';
  }).join("");
  var faq = $("#faq");
  if (faq) faq.innerHTML = FAQ.map(function (f, i) {
    return '<details' + (i === 0 ? " open" : "") + '><summary>' + tx(f.q) + '</summary><p>' + tx(f.a) +
      (f.need ? ' <span class="need"><b>Нужно от вас:</b> ' + tx(f.need) + '</span>' : "") +
      '<span class="src">Источник: ' + tx(f.src) + '</span></p></details>';
  }).join("");

  /* Калькулятор тиража */
  var calc = $("#calc");
  if (calc) {
    var models = $("#models"), qty = $("#qty"), range = $("#qty-range"), current = CALC[0];
    models.innerHTML = CALC.map(function (m, i) {
      return '<label class="model' + (i === 0 ? " on" : "") + '"><input type="radio" name="model" value="' + m.id + '"' + (i === 0 ? " checked" : "") + '>' +
        '<div><b>' + tx(m.name) + '</b><span>' + tx(m.note) + '</span></div></label>';
    }).join("");
    function priceFor(m, q) {
      var p = m.tiers[0][1];
      m.tiers.forEach(function (t) { if (q >= t[0]) p = t[1]; });
      return p;
    }
    function update() {
      var q = Math.max(0, parseInt(qty.value, 10) || 0);
      range.value = Math.min(q, 10000);
      var warn = $("#calc-warn");
      if (q < current.min) {
        $("#per").textContent = "—";
        $("#total").textContent = T("Минимальный тираж — " + num(current.min) + " шт.");
        warn.style.display = "none";
      } else {
        var p = priceFor(current, q);
        $("#per").textContent = num(p, 2) + " ₽";
        $("#total").textContent = T("Тираж " + num(q) + " шт. ≈ " + num(Math.round(p * q)) + " ₽");
        var next = current.tiers.filter(function (t) { return t[0] > q; })[0];
        warn.style.display = next ? "block" : "none";
        if (next) warn.textContent = T("При тираже от " + num(next[0]) + " шт. — " + num(next[1], 2) + " ₽ за штуку");
      }
      $("#order-calc").value = current.name + ", " + q + " шт.";
    }
    models.addEventListener("change", function (e) {
      current = CALC.filter(function (m) { return m.id === e.target.value; })[0];
      models.querySelectorAll(".model").forEach(function (l) { l.classList.toggle("on", l.querySelector("input").checked); });
      update();
    });
    qty.addEventListener("input", update);
    range.addEventListener("input", function () { qty.value = range.value; update(); });
    $("#presets").addEventListener("click", function (e) { if (e.target.dataset.q) { qty.value = e.target.dataset.q; update(); } });
    update();
  }

  /* Открыто сейчас — время Петербурга, Пн–Пт 10–18 */
  document.querySelectorAll("[data-open-now]").forEach(function (el) {
    var parts = new Intl.DateTimeFormat("ru-RU", { timeZone: "Europe/Moscow", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
    var get = function (t) { return (parts.filter(function (p) { return p.type === t; })[0] || {}).value; };
    var weekend = /сб|вс/i.test(get("weekday")), m = +get("hour") * 60 + +get("minute");
    var open = !weekend && m >= 600 && m < 1080;
    el.classList.toggle("closed", !open);
    el.textContent = T(open ? "Открыто сейчас, до 18:00" : (weekend || m >= 1080 ? "Сейчас закрыто, откроемся в будний день в 10:00" : "Сейчас закрыто, откроемся в 10:00"));
  });

  /* Каталог */
  var list = $("#list");
  if (list) {
    var params = new URLSearchParams(location.search);
    var state = { sec: params.get("sec") || "", use: "", logo: false, q: "" };
    var secChips = $("#f-sec"), useChips = $("#f-use");
    secChips.innerHTML = '<button class="chip" data-v="">Все</button>' + SECTIONS.map(function (s) { return '<button class="chip" data-v="' + s.id + '">' + tx(s.name) + '</button>'; }).join("");
    useChips.innerHTML = '<button class="chip" data-v="">Для всего</button>' + USES.map(function (u) { return '<button class="chip" data-v="' + esc(u) + '">' + tx(u) + '</button>'; }).join("");
    function render() {
      var q = state.q.trim().toLowerCase();
      var res = ITEMS.filter(function (i) {
        return (!state.sec || i.sec === state.sec) && (!state.use || i.uses.indexOf(state.use) >= 0) && (!state.logo || i.logo) &&
          (!q || (i.title + " " + i.short + " " + secName(i.sec)).toLowerCase().indexOf(q) >= 0);
      });
      list.innerHTML = res.map(card).join("");
      $("#empty").style.display = res.length ? "none" : "block";
      $("#count").textContent = T("Показано позиций: " + res.length + " из " + ITEMS.length + " в выборке");
      $("#cat-title").textContent = T(state.sec ? secName(state.sec) : "Каталог фабрики");
      secChips.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("on", c.dataset.v === state.sec); });
      useChips.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("on", c.dataset.v === state.use); });
      reveal();
    }
    secChips.addEventListener("click", function (e) { if (e.target.dataset.v !== undefined) { state.sec = e.target.dataset.v; render(); } });
    useChips.addEventListener("click", function (e) { if (e.target.dataset.v !== undefined) { state.use = e.target.dataset.v; render(); } });
    $("#f-logo").addEventListener("change", function (e) { state.logo = e.target.checked; render(); });
    $("#q").addEventListener("input", function (e) { state.q = e.target.value; render(); });
    render();
  }

  /* Карточка */
  var itemBox = $("#item");
  if (itemBox) {
    var it = byId(new URLSearchParams(location.search).get("id")) || ITEMS[0];
    document.title = it.title + " — Фабрика «Капхолдер»";
    $("#crumb-sec").textContent = T(secName(it.sec));
    $("#crumb-sec").href = "catalog.html?sec=" + it.sec;
    $("#crumb-item").textContent = T(it.title);
    itemBox.innerHTML =
      '<div class="gallery"><div class="ph"><span>Фото: ' + tx(it.title) + ' на стакане или с едой</span></div><div class="ph"><span>Фото в развёртке</span></div><div class="ph"><span>Фото в руке</span></div></div>' +
      '<div><span class="eyebrow">' + tx(secName(it.sec)) + '</span><h1 style="font-size:34px">' + tx(it.title) + '</h1>' +
      '<p class="muted">' + tx(it.short) + '</p>' + badges(it) +
      '<div class="item-price">' + tx(priceText(it)) + '</div>' + (it.pack ? '<div class="muted small">' + tx(it.pack) + '</div>' : "") +
      '<div class="item-actions">' + (it.logo ? '<a class="btn" href="index.html#calc">Рассчитать тираж</a><a class="btn ghost" href="#order">Прислать логотип</a>' :
        '<a class="btn" href="#order">Заказать</a><a class="btn ghost" href="#order">Хочу со своим логотипом</a>') + '</div>' +
      '<table class="specs">' + it.specs.map(function (s) { return '<tr><td>' + tx(s[0]) + '</td><td>' + tx(s[1]) + '</td></tr>'; }).join("") + '</table>' +
      '<div class="box"><h4>Чем хорош</h4><ul>' + it.pros.map(function (p) { return '<li>' + tx(p) + '</li>'; }).join("") + '</ul></div>' +
      (it.needs ? '<div class="box"><h4>Что учесть</h4><p style="margin:0">' + tx(it.needs) + '</p></div>' : "") +
      '<div class="box"><h4>Кому подходит</h4><p style="margin:0">' + tx(it.who) + '</p></div>' +
      '<p class="src">Источник: ' + tx(it.src) + '. Наличие — для примера.</p></div>';
    var more = $("#more");
    if (more) more.innerHTML = ITEMS.filter(function (i) { return i.sec === it.sec && i.id !== it.id; }).concat(ITEMS.filter(function (i) { return i.sec !== it.sec; })).slice(0, 4).map(card).join("");
    var hidden = $("#order-calc");
    if (hidden) hidden.value = it.title;
  }

  /* Статья */
  var art = $("#article");
  if (art) {
    var a = ARTICLES.filter(function (x) { return x.id === new URLSearchParams(location.search).get("id"); })[0] || ARTICLES[0];
    document.title = a.title + " — Фабрика «Капхолдер»";
    var html = '<div class="crumbs"><a href="index.html">Главная</a> / <a href="index.html#tips">Советы</a></div>' +
      '<span class="eyebrow">Советы фабрики</span><h1 style="font-size:40px">' + tx(a.title) + '</h1><p class="lead">' + tx(a.lead) + '</p>' +
      '<div class="ph"><span>Фото капхолдеров из работ фабрики</span></div>';
    a.body.forEach(function (b) {
      if (b[0] === "p") html += '<p>' + tx(b[1]) + '</p>';
      if (b[0] === "h2") html += '<h2>' + tx(b[1]) + '</h2>';
      if (b[0] === "ul") html += '<ul>' + b[1].map(function (li) { return '<li>' + tx(li) + '</li>'; }).join("") + '</ul>';
    });
    html += '<p class="src">По материалам: ' + tx(a.src) + '</p><p style="margin-top:28px"><a class="btn" href="index.html#calc">Рассчитать свой тираж</a></p>';
    art.innerHTML = html;
  }

  /* Заявка — демо */
  document.querySelectorAll("form[data-demo]").forEach(function (f) {
    var file = f.querySelector(".file input");
    if (file) file.addEventListener("change", function () { f.querySelector(".file span").textContent = file.files.length ? "Файл прикреплён: " + file.files[0].name : "Прикрепить логотип"; });
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      f.querySelectorAll(":scope > *:not(.thanks)").forEach(function (el) { el.style.display = "none"; });
      f.querySelector(".thanks").style.display = "block";
    });
  });

  /* Появление при прокрутке */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: .1 }) : null;
  function reveal() { document.querySelectorAll(".reveal:not(.in)").forEach(function (el) { io ? io.observe(el) : el.classList.add("in"); }); }
  reveal();
})();
