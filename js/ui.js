const dom = {
  productGrid: document.getElementById("product-grid"),
  cartCountEl: document.getElementById("cart-count"),
  cartSummaryItems: document.getElementById("cart-summary-items"),
  cartSummaryTotal: document.getElementById("cart-summary-total"),
  cartButton: document.getElementById("cart-button"),
  cartModal: document.getElementById("cart-modal"),
  cartModalBody: document.getElementById("cart-modal-body"),
  modalTotalAmount: document.getElementById("modal-total-amount"),
  summaryModal: document.getElementById("summary-modal"),
  summaryMessage: document.getElementById("summary-message"),
  summaryList: document.getElementById("summary-list"),
  summaryTotal: document.getElementById("summary-total"),
  checkoutForm: document.getElementById("checkout-form"),
  closeButtons: document.querySelectorAll("[data-close-modal]"),
  phoneErrorEl: document.getElementById("phone-error"),
};

function renderProducts() {
  dom.productGrid.innerHTML = products
    .map((product) => {
      const inCart = getCartQuantity(product.id) > 0;
      return `
      <article class="product-card">
        <div class="image-wrapper">
          <img src="${product.image}" alt="${product.name}" />
          <div class="price-overlay">
            <span class="price-label">Price</span>
            <span class="price-value">${formatPrice(product.price)}</span>
          </div>
        </div>
        <div class="product-card-body">
          <h3>${product.name}</h3>
          <button class="btn ${inCart ? "remove-from-cart" : "primary"}" data-action="${inCart ? "remove-product" : "add"}" data-id="${product.id}">${
            inCart ? "Remove from Cart" : "Add to Cart"
          }</button>
        </div>
      </article>
    `;
    })
    .join("");
}

function renderCartSummary() {
  const { items, total } = getCartTotals();
  dom.cartCountEl.textContent = items;
  dom.cartSummaryItems.textContent = items;
  dom.cartSummaryTotal.textContent = formatCurrency(total);
}

function renderCartModal() {
  const cartItems = getCartItems();
  if (cartItems.length === 0) {
    dom.cartModalBody.innerHTML =
      '<p class="empty-cart-message">Your cart is currently empty. Add a product to get started.</p>';
    dom.modalTotalAmount.textContent = "0.00";
    return;
  }

  dom.cartModalBody.innerHTML = `
  <div class="cart-table-wrap">
    <table class="cart-table">
      <thead>
        <tr>
          <th>S/N</th>
          <th>Item</th>
          <th>Price</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody>
        ${cartItems
          .map(
            ({ product, quantity }, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>
              <div class="cart-item-info">
                <img src="${product.image}" alt="${product.name}" />
                <div>
                  <div class="cart-item-name">${product.name}</div>
                  <div class="cart-item-price">${formatPrice(product.price)} each</div>
                </div>
              </div>
            </td>
            <td>${formatPrice(product.price)}</td>
            <td>
              <div class="qty-row">
                <div class="qty-controls">
                  <button type="button" data-action="qty" data-id="${product.id}" data-delta="-1" aria-label="Decrease quantity">−</button>
                  <span class="qty-count">${quantity}</span>
                  <button type="button" data-action="qty" data-id="${product.id}" data-delta="1" aria-label="Increase quantity">+</button>
                </div>
                <button class="remove-btn" type="button" data-action="remove" data-id="${product.id}" aria-label="Remove item">Remove</button>
              </div>
            </td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  </div>
`;

  const { total } = getCartTotals();
  dom.modalTotalAmount.textContent = formatCurrency(total);
}

function openModal(modal) {
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(modal) {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

function showSummaryModal(customer, cartDetails, total) {
  closeModal(dom.cartModal);
  dom.checkoutForm.reset();
  dom.phoneErrorEl.textContent = "";
  dom.summaryMessage.textContent = `Thank you, `;
  dom.summaryMessage.innerHTML += `<span class="customer-name">${customer.name}</span>`;
  dom.summaryMessage.innerHTML += `, your order has been Received.`;
  const summaryContent = `
    <div class="summary-header">
      <div class="summary-header-cell sn">S/N</div>
      <div class="summary-header-cell item">Item</div>
      <div class="summary-header-cell qty">Quantity</div>
    </div>
    <div class="summary-body">
      ${cartDetails
        .map(
          (item, index) => `
        <div class="summary-row">
          <div class="summary-cell sn">${index + 1}</div>
          <div class="summary-cell item">${item.name}</div>
          <div class="summary-cell qty">${item.quantity}</div>
        </div>
      `,
        )
        .join("")}
    </div>
  `;
  dom.summaryList.innerHTML = summaryContent;
  renderProducts();
  renderCartModal();
  openModal(dom.summaryModal);
}

function renderAll() {
  renderProducts();
  renderCartSummary();
  renderCartModal();
}

function handleProductGridClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const productId = button.dataset.id;

  if (action === "add") {
    addToCart(productId);
    renderAll();
  }

  if (action === "remove-product") {
    removeFromCart(productId);
    renderAll();
  }
}

function handleCartModalClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const productId = button.dataset.id;

  if (action === "qty") {
    const delta = Number(button.dataset.delta) || 0;
    if (delta < 0) {
      const currentQuantity = getCartQuantity(productId);
      if (currentQuantity + delta < 1) {
        alert(
          "You cannot have less than one item. if you wish to remove the item click remove",
        );
        return;
      }
    }
    updateQuantity(productId, delta);
    renderAll();
  }

  if (action === "remove") {
    removeFromCart(productId);
    renderAll();
  }
}

function attachEventListeners() {
  dom.productGrid.addEventListener("click", handleProductGridClick);
  dom.cartButton.addEventListener("click", () => {
    renderCartModal();
    openModal(dom.cartModal);
  });

  dom.closeButtons.forEach((element) => {
    element.addEventListener("click", () => closeModal(dom.cartModal));
  });

  dom.checkoutForm.elements.phone.addEventListener("input", () => {
    dom.phoneErrorEl.textContent = "";
  });

  document.querySelectorAll("[data-close-summary]").forEach((element) => {
    element.addEventListener("click", () => {
      clearCart();
      dom.cartCountEl.textContent = "0";
      dom.cartSummaryItems.textContent = "0";
      dom.cartSummaryTotal.textContent = "0.00";
      dom.cartModalBody.innerHTML =
        "<p>Your cart is currently empty. Add a product to get started.</p>";
      dom.modalTotalAmount.textContent = "0.00";
      renderProducts();
      closeModal(dom.summaryModal);
    });
  });

  dom.cartModalBody.addEventListener("click", handleCartModalClick);
  dom.checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const phoneValue = dom.checkoutForm.elements.phone.value.trim();

    // Validate that phone contains only numbers
    if (!/^[0-9]+$/.test(phoneValue)) {
      dom.phoneErrorEl.textContent = "Phone number must contain only numbers.";
      return;
    }

    // Validate that phone is exactly 10 digits
    if (phoneValue.length !== 10) {
      dom.phoneErrorEl.textContent =
        phoneValue.length < 10
          ? "Phone number must be exactly 10 digits."
          : "Phone number must be exactly 10 digits.";
      return;
    }
    const customer = {
      name: dom.checkoutForm.elements.name.value.trim(),
      email: dom.checkoutForm.elements.email.value.trim(),
      phone: phoneValue,
    };
    payWithPaystack(customer, showSummaryModal);
  });
}

function initApp() {
  renderAll();
  attachEventListeners();
}
