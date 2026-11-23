const guestChat = document.querySelector(".guest-chat");
const chatToggle = guestChat.querySelector(".guest-chat__toggle");
const chatPanel = guestChat.querySelector(".guest-chat__panel");
const chatClose = guestChat.querySelector(".guest-chat__close");
const chatMessages = guestChat.querySelector(".guest-chat__content");
const chatForm = guestChat.querySelector(".guest-chat__form");
const chatInput = document.getElementById("guest-chat-request");
const chatBadge = guestChat.querySelector(".guest-chat__badge");
let demoReplyScheduled = false;

async function playChatNotification() {
  document.removeEventListener("click", playChatNotification, true);
  document.removeEventListener("keydown", playChatNotification, true);
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  let audio;
  try {
    audio = new AudioContext();
    await audio.resume();
    const start = audio.currentTime;
    const tone = audio.createOscillator();
    const volume = audio.createGain();
    tone.frequency.setValueAtTime(660, start);
    tone.frequency.setValueAtTime(880, start + 0.09);
    volume.gain.setValueAtTime(0.001, start);
    volume.gain.exponentialRampToValueAtTime(0.09, start + 0.015);
    volume.gain.exponentialRampToValueAtTime(0.001, start + 0.24);
    tone.connect(volume).connect(audio.destination);
    tone.onended = () => audio.close().catch(() => {});
    tone.start(start);
    tone.stop(start + 0.25);
  } catch {
    if (audio) audio.close().catch(() => {});
  }
}

// Browsers require a user gesture before playing audio.
document.addEventListener("click", playChatNotification, true);
document.addEventListener("keydown", playChatNotification, true);

function setGuestChatOpen(open, restoreFocus = false) {
  chatPanel.hidden = !open;
  chatToggle.setAttribute("aria-expanded", String(open));
  if (open) {
    chatBadge.hidden = true;
    chatToggle.setAttribute("aria-label", "Чат с администратором");
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