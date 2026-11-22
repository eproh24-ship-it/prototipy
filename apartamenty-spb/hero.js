const heroSearch = document.getElementById("search");
const heroDates = heroSearch.querySelectorAll(".search-date input");

function updateHeroDates() {
  heroDates.forEach((input) => {
    const [, month, day] = input.value.split("-");
    input.parentElement.querySelector(".search-date-preview").textContent =
      day ? day + "." + month : "Выбрать";
  });
}

heroSearch.addEventListener("change", updateHeroDates);
heroSearch.addEventListener("reset", () => requestAnimationFrame(updateHeroDates));
updateHeroDates();
