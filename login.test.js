const { handleLogin, showMessage } = require("./login");

describe("handleLogin", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="loginForm">
        <input type="text" id="loginEmail" />
        <input type="password" id="loginPassword" />
      </form>
      <div id="messageContainer"></div>
    `;
    localStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should log in successfully with valid credentials", async () => {
    const mockUsers = [
      { email: "test@example.com", password: "password123", name: "Test User" },
    ];

    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockUsers),
    });

    document.getElementById("loginEmail").value = "test@example.com";
    document.getElementById("loginPassword").value = "password123";

    const form = document.getElementById("loginForm");
    const event = new Event("submit");
    form.dispatchEvent(event);

    await handleLogin(event);

    expect(localStorage.getItem("currentUser")).toEqual(
      JSON.stringify(mockUsers[0])
    );
    expect(
      document.getElementById("messageContainer").textContent
    ).toContain("Login successful!");
  });

  it("should show error message with invalid credentials", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue([]),
    });

    document.getElementById("loginEmail").value = "wrong@example.com";
    document.getElementById("loginPassword").value = "wrongpassword";

    const form = document.getElementById("loginForm");
    const event = new Event("submit");
    form.dispatchEvent(event);

    await handleLogin(event);

    expect(localStorage.getItem("currentUser")).toBeNull();
    expect(
      document.getElementById("messageContainer").textContent
    ).toContain("Invalid credentials. Please try again.");
  });

  it("should show error message if fetch fails", async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));

    document.getElementById("loginEmail").value = "test@example.com";
    document.getElementById("loginPassword").value = "password123";

    const form = document.getElementById("loginForm");
    const event = new Event("submit");
    form.dispatchEvent(event);

    await handleLogin(event);

    expect(localStorage.getItem("currentUser")).toBeNull();
    expect(
      document.getElementById("messageContainer").textContent
    ).toContain("Login failed. Please try again later.");
  });
});
