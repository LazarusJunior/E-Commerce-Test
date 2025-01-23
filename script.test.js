const {
    saveUserSession,
    loadUserSession,
    clearUserSession,
    handleProductSubmit,
    showMessage,
    logout,
    loadProducts,
    handleAddToCart,
    handleRemoveFromCart,
    updateCart,
    handleUpdateQuantity,
    handleCheckout,
    updateUI,
    toggleAdminPanel
  } = require("./script");
  
  describe("Session Management", () => {
    beforeEach(() => {
      localStorage.clear();
    });
  
    it("should save user session to localStorage", () => {
      const user = { email: "test@example.com", role: "admin" };
      saveUserSession(user);
      expect(localStorage.getItem("currentUser")).toEqual(JSON.stringify(user));
    });
  
    it("should load user session from localStorage", () => {
      const user = { email: "test@example.com", role: "admin" };
      localStorage.setItem("currentUser", JSON.stringify(user));
      loadUserSession();
      expect(currentUser).toEqual(user);
    });
  
    it("should clear user session from localStorage", () => {
      const user = { email: "test@example.com", role: "admin" };
      localStorage.setItem("currentUser", JSON.stringify(user));
      clearUserSession();
      expect(localStorage.getItem("currentUser")).toBeNull();
      expect(currentUser).toBeNull();
    });
  });
  
  describe("Event Listeners", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="cartModal"></div>
        <div id="adminSection"></div>
        <div id="productsSection"></div>
        <div id="adminControls"></div>
        <div id="messageContainer"></div>
        <button id="cartBtn"></button>
        <button id="logoutBtn"></button>
        <button id="adminPanelBtn"></button>
        <form id="productForm"></form>
        <button id="checkoutBtn"></button>
      `;
    });
  
    it("should show cart modal when cart button is clicked", () => {
      const cartBtn = document.getElementById("cartBtn");
      const cartModal = document.getElementById("cartModal");
      cartBtn.click();
      expect(cartModal.style.display).toBe("block");
    });
  
    it("should call logout function when logout button is clicked", () => {
      const logoutBtn = document.getElementById("logoutBtn");
      const logoutSpy = jest.spyOn(global, 'logout');
      logoutBtn.click();
      expect(logoutSpy).toHaveBeenCalled();
    });
  
    it("should call toggleAdminPanel function when admin panel button is clicked", () => {
      const adminPanelBtn = document.getElementById("adminPanelBtn");
      const toggleAdminPanelSpy = jest.spyOn(global, 'toggleAdminPanel');
      adminPanelBtn.click();
      expect(toggleAdminPanelSpy).toHaveBeenCalled();
    });
  
    it("should call handleProductSubmit function when product form is submitted", () => {
      const productForm = document.getElementById("productForm");
      const handleProductSubmitSpy = jest.spyOn(global, 'handleProductSubmit');
      const event = new Event("submit");
      productForm.dispatchEvent(event);
      expect(handleProductSubmitSpy).toHaveBeenCalledWith(event);
    });
  
    it("should call handleCheckout function when checkout button is clicked", () => {
      const checkoutBtn = document.getElementById("checkoutBtn");
      const handleCheckoutSpy = jest.spyOn(global, 'handleCheckout');
      checkoutBtn.click();
      expect(handleCheckoutSpy).toHaveBeenCalled();
    });
  });
  
  describe("Cart Functions", () => {
    beforeEach(() => {
      localStorage.clear();
      currentUser = { id: 1, email: "test@example.com", role: "user" };
      document.body.innerHTML = `
        <div id="cartItems"></div>
        <div id="cartTotal"></div>
        <div id="cartCount"></div>
        <div id="messageContainer"></div>
      `;
    });
  
    afterEach(() => {
      jest.restoreAllMocks();
    });
  
    it("should add item to cart", async () => {
      const mockProduct = { id: 1, name: "Product 1", price: 100, image_url: "image.jpg" };
      global.fetch = jest.fn()
        .mockResolvedValueOnce({ json: jest.fn().mockResolvedValue(mockProduct) })
        .mockResolvedValueOnce({ json: jest.fn().mockResolvedValue([]) });
  
      await handleAddToCart(mockProduct.id);
  
      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/products/${mockProduct.id}`);
      expect(document.getElementById("messageContainer").textContent).toContain(`${mockProduct.name} added to cart!`);
    });
  
    it("should show error message if adding item to cart fails", async () => {
      global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));
  
      await handleAddToCart(1);
  
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(document.getElementById("messageContainer").textContent).toContain("Failed to add item to cart. Please try again.");
    });
  
    it("should remove item from cart", async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({});
  
      await handleRemoveFromCart(1);
  
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/cart/1`, { method: "DELETE" });
      expect(document.getElementById("messageContainer").textContent).toContain("Item removed from cart.");
    });
  
    it("should show error message if removing item from cart fails", async () => {
      global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));
  
      await handleRemoveFromCart(1);
  
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(document.getElementById("messageContainer").textContent).toContain("Failed to remove item from cart. Please try again.");
    });
  });
  
  describe("UI Functions", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="loginBtn"></div>
        <div id="registerBtn"></div>
        <div id="logoutBtn"></div>
        <div id="cartBtn"></div>
        <div id="userInfo"></div>
        <div id="adminControls"></div>
        <div id="userEmail"></div>
        <div id="cartModal"></div>
        <div id="adminSection"></div>
        <div id="productsSection"></div>
      `;
    });
  
    it("should update UI based on user role", () => {
      currentUser = { email: "admin@example.com", role: "admin" };
      updateUI();
  
      expect(document.getElementById("loginBtn").style.display).toBe("none");
      expect(document.getElementById("registerBtn").style.display).toBe("none");
      expect(document.getElementById("logoutBtn").style.display).toBe("inline-block");
      expect(document.getElementById("cartBtn").style.display).toBe("none");
      expect(document.getElementById("userInfo").style.display).toBe("inline-block");
      expect(document.getElementById("adminControls").style.display).toBe("inline-block");
      expect(document.getElementById("userEmail").textContent).toBe(currentUser.email);
      expect(adminSection.style.display).toBe("block");
      expect(productsSection.style.display).toBe("none");
    });
  
    it("should toggle admin panel visibility", () => {
      currentUser = { role: "admin" };
      toggleAdminPanel();
  
      expect(adminSection.style.display).toBe("block");
      expect(productsSection.style.display).toBe("none");
  
      toggleAdminPanel();
      expect(adminSection.style.display).toBe("none");
      expect(productsSection.style.display).toBe("block");
    });
  });
  
  describe("Product Functions", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="messageContainer"></div>
        <div id="productsContainer"></div>
        <table id="adminProductsTable">
          <tbody></tbody>
        </table>
      `;
    });
  
    afterEach(() => {
      jest.restoreAllMocks();
    });
  
    it("should load products and update UI", async () => {
      const mockProducts = [
        { id: 1, name: "Product 1", price: 100, image_url: "image1.jpg", description: "Description 1" },
        { id: 2, name: "Product 2", price: 200, image_url: "image2.jpg", description: "Description 2" }
      ];
      global.fetch = jest.fn().mockResolvedValueOnce({ json: jest.fn().mockResolvedValue(mockProducts) });
  
      await loadProducts();
  
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/products`);
      expect(document.getElementById("productsContainer").innerHTML).toContain("Product 1");
      expect(document.getElementById("productsContainer").innerHTML).toContain("Product 2");
    });
  
    it("should show error message if loading products fails", async () => {
      global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));
  
      await loadProducts();
  
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(document.getElementById("messageContainer").textContent).toContain("Failed to load products. Please try again later.");
    });
  
    it("should submit product and update UI", async () => {
      currentUser = { role: "admin" };
      document.getElementById("productName").value = "New Product";
      document.getElementById("productPrice").value = "150";
      document.getElementById("productImage").value = "new-image.jpg";
      document.getElementById("productDescription").value = "New description";
  
      global.fetch = jest.fn().mockResolvedValueOnce({ ok: true });
  
      const form = document.getElementById("productForm");
      const event = new Event("submit");
      form.dispatchEvent(event);
  
      await handleProductSubmit(event);
  
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(document.getElementById("messageContainer").textContent).toContain("Product added successfully!");
    });
  
    it("should show error message if submitting product fails", async () => {
      currentUser = { role: "admin" };
      document.getElementById("productName").value = "New Product";
      document.getElementById("productPrice").value = "150";
      document.getElementById("productImage").value = "new-image.jpg";
      document.getElementById("productDescription").value = "New description";
  
      global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));
  
      const form = document.getElementById("productForm");
      const event = new Event("submit");
      form.dispatchEvent(event);
  
      await handleProductSubmit(event);
  
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(document.getElementById("messageContainer").textContent).toContain("Failed to save product. Please try again.");
    });
  });
  
  describe("Checkout Functions", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="cartModal"></div>
        <div id="messageContainer"></div>
        <div id="cartItems"></div>
        <div id="cartTotal"></div>
      `;
      currentUser = { id: 1, email: "test@example.com", role: "user" };
    });
  
    afterEach(() => {
      jest.restoreAllMocks();
    });
  
    it("should checkout successfully and clear cart", async () => {
      const mockCartItems = [
        { id: 1, userId: 1, productId: 1, name: "Product 1", price: 100, image_url: "image1.jpg", quantity: 1 },
        { id: 2, userId: 1, productId: 2, name: "Product 2", price: 200, image_url: "image2.jpg", quantity: 2 }
      ];
      global.fetch = jest.fn()
        .mockResolvedValueOnce({ json: jest.fn().mockResolvedValue(mockCartItems) })
        .mockResolvedValueOnce({ ok: true })
        .mockResolvedValueOnce({ ok: true });
  
      await handleCheckout();
  
      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(document.getElementById("messageContainer").textContent).toContain("Checkout successful! Thank you for your purchase.");
      expect(document.getElementById("cartItems").innerHTML).toBe("");
      expect(document.getElementById("cartTotal").textContent).toBe("Total: $0.00");
    });
  
    it("should show error message if checkout fails", async () => {
      global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));
  
      await handleCheckout();
  
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(document.getElementById("messageContainer").textContent).toContain("Checkout failed. Please try again.");
    });
  });
  
  describe("Message Display Function", () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="messageContainer"></div>';
    });
  
    it("should show message and then hide it", (done) => {
      showMessage("Test message", "info");
  
      const messageContainer = document.getElementById("messageContainer");
      expect(messageContainer.children.length).toBe(1);
      expect(messageContainer.textContent).toContain("Test message");
  
      setTimeout(() => {
        expect(messageContainer.children.length).toBe(0);
        done();
      }, 3500); // Allow extra time for message to disappear
    });
  });
  