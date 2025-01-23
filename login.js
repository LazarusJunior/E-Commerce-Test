const API_URL = "http://localhost:3000";

function showMessage(message, type = "info") {
  const messageContainer = document.getElementById("messageContainer");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", `message-${type}`);
  messageElement.textContent = message;
  messageContainer.appendChild(messageElement);

  setTimeout(() => {
    messageElement.style.opacity = "0";
    setTimeout(() => {
      messageContainer.removeChild(messageElement);
    }, 300);
  }, 3000);
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch(`${API_URL}/users`);
    const users = await response.json();
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      showMessage("Login successful!", "success");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } else {
      showMessage("Invalid credentials. Please try again.", "error");
    }
  } catch (error) {
    console.error("Login error:", error);
    showMessage("Login failed. Please try again later.", "error");
  }
}

module.exports = { handleLogin, showMessage };
