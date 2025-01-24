const { handleRegister, showMessage } = require("./register");

describe("handleRegister", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="registerForm">
        <input type="text" id="registerEmail" />
        <input type="password" id="registerPassword" />
      </form>
      <div id="messageContainer"></div>
    `;
    localStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should register successfully with a new email", async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue([]),
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    document.getElementById("registerEmail").value = "new@example.com";
    document.getElementById("registerPassword").value = "newpassword";

    const form = document.getElementById("registerForm");
    const event = new Event("submit");
    form.dispatchEvent(event);

    await handleRegister(event);

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "new@example.com", password: "newpassword", role: "user" }),
    });
    expect(
      document.getElementById("messageContainer").textContent
    ).toContain("Registration successful! Please login.");
  });

  it("should show error message if email is already in use", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue([{ email: "existing@example.com" }]),
    });

    document.getElementById("registerEmail").value = "existing@example.com";
    document.getElementById("registerPassword").value = "password";

    const form = document.getElementById("registerForm");
    const event = new Event("submit");
    form.dispatchEvent(event);

    await handleRegister(event);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(
      document.getElementById("messageContainer").textContent
    ).toContain("Email is already in use. Please use a different email.");
  });

  it("should show error message if registration fails", async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));

    document.getElementById("registerEmail").value = "test@example.com";
    document.getElementById("registerPassword").value = "password123";

    const form = document.getElementById("registerForm");
    const event = new Event("submit");
    form.dispatchEvent(event);

    await handleRegister(event);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(
      document.getElementById("messageContainer").textContent
    ).toContain("Registration failed. Please try again later.");
  });
});
 