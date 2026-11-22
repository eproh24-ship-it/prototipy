const guestChat = document.querySelector(".guest-chat");
const chatToggle = guestChat.querySelector(".guest-chat__toggle");
const chatPanel = guestChat.querySelector(".guest-chat__panel");
const chatClose = guestChat.querySelector(".guest-chat__close");
const chatMessages = guestChat.querySelector(".guest-chat__content");
const chatForm = guestChat.querySelector(".guest-chat__form");
const chatInput = document.getElementById("guest-chat-request");
let demoReplyScheduled = false;

function setGuestChatOpen(open, restoreFocus = false) {
  chatPanel.hidden = !open;
  chatToggle.setAttribute("aria-expanded", String(open));
  if (open) {
    chatClose.focus();
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  if (restoreFocus) chatToggle.focus();
}

function appendGuestChatMessage(text, fromGuest = false) {
  const message = document.createElement("p");
  message.className = fromGuest
    ? "guest-chat__message guest-chat__message--guest"
    : "guest-chat__message";
  message.textContent = text;
  chatMessages.append(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatToggle.addEventListener("click", () => setGuestChatOpen(chatPanel.hidden));
chatClose.addEventListener("click", () => setGuestChatOpen(false, true));
guestChat.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !chatPanel.hidden) {
    event.preventDefault();
    setGuestChatOpen(false, true);
  }
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  appendGuestChatMessage(text, true);
  chatInput.value = "";
  chatInput.focus();

  if (!demoReplyScheduled) {
    demoReplyScheduled = true;
    window.setTimeout(() => {
      appendGuestChatMessage("Спасибо за сообщение! Сейчас это демо чата. Здесь будет появляться ответ с подборкой квартир.");
    }, 650);
  }
});
