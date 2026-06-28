const cart = {};

function getCartTotals() {
  const items = Object.keys(cart).length;
  const total = Object.values(cart).reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0,
  );
  return { items, total };
}

function getCartDetails() {
  return Object.values(cart).map(({ product, quantity }) => ({
    name: product.name,
    price: product.price,
    quantity,
    lineTotal: product.price * quantity,
  }));
}

function getCartQuantity(productId) {
  return cart[productId]?.quantity ?? 0;
}

function getCartItems() {
  return Object.values(cart);
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  if (!cart[productId]) {
    cart[productId] = { product, quantity: 1 };
  } else {
    cart[productId].quantity += 1;
  }
}

function removeFromCart(productId) {
  if (cart[productId]) {
    delete cart[productId];
  }
}

function updateQuantity(productId, delta) {
  if (!cart[productId]) return;
  cart[productId].quantity += delta;
  if (cart[productId].quantity <= 0) {
    delete cart[productId];
  }
}

function clearCart() {
  Object.keys(cart).forEach((key) => delete cart[key]);
}
