const contactForm = document.getElementById("contactForm");
const sendButton = document.getElementById("sendButton");
const formFeedback = document.getElementById("formFeedback");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("nameInput").value.trim();
  const email = document.getElementById("emailInput").value.trim();
  const message = document.getElementById("messageInput").value.trim();

  if (!name || !email || !message) {
    return;
  }

  sendButton.disabled = true;
  sendButton.textContent = "Mengirim...";
  formFeedback.classList.remove("show", "error");

  fetch("https://formsubmit.co/ajax/naufal.suharjo@gmail.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      name: name,
      email: email,
      message: message,
      _subject: "Pesan baru dari Flyovlyoffc Store"
    })
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("gagal");
      }
      return response.json();
    })
    .then(() => {
      formFeedback.textContent = "Pesan kamu udah kekirim. Admin bakal balas ke email kamu.";
      formFeedback.classList.add("show");
      contactForm.reset();
    })
    .catch(() => {
      formFeedback.textContent = "Gagal ngirim pesan. Coba lagi sebentar lagi ya.";
      formFeedback.classList.add("show", "error");
    })
    .finally(() => {
      sendButton.disabled = false;
      sendButton.textContent = "Kirim Pesan";
    });
});
