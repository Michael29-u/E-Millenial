import { getCartTotals, getCartDetails, clearCart } from "./cartLogic.js";

const PUBLIC_KEY = "pk_test_2544a1f1ee1812944ad9629f4397d663a71d6c59";

export function payWithPaystack(customer, onSuccess) {
  const { total } = getCartTotals();
  const cartDetails = getCartDetails();

  const handler = PaystackPop.setup({
    key: PUBLIC_KEY,
    email: customer.email,
    amount: total * 100,
    currency: "GHS",
    ref: `ONEMIL-${Date.now()}`,
    metadata: {
      custom_fields: [
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: customer.name,
        },
        {
          display_name: "Phone Number",
          variable_name: "customer_phone",
          value: customer.phone,
        },
        {
          display_name: "Address",
          variable_name: "customer_address",
          value: customer.address,
        },
      ],
    },
    callback() {
      onSuccess(customer, cartDetails, total);
    },
    onClose() {
      alert("Payment window closed. Your cart is still intact.");
    },
  });

  handler.openIframe();
}
