const tripOptions = document.querySelectorAll(".trip-options button");

function selectTrip(button) {
  if (button.getAttribute("aria-pressed") === "true") return;

  tripOptions.forEach((option) => {
    const selected = option === button;
    option.setAttribute("aria-pressed", String(selected));
    document.getElementById(option.getAttribute("aria-controls")).hidden = !selected;
  });
}

tripOptions.forEach((button) => {
  button.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") selectTrip(button);
  });
  button.addEventListener("focus", () => {
    if (button.matches(":focus-visible")) selectTrip(button);
  });
  button.addEventListener("click", () => selectTrip(button));
});
