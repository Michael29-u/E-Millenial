const emailRegex = /^\S+@\S+\.\S+$/;
const phoneRegex = /^\+?[0-9]{7,15}$/;

export function validateCustomerInfo(customer, cartCount) {
  const errors = {
    name: "",
    email: "",
    phone: "",
    address: "",
    cart: "",
  };

  if (!customer.name.trim()) {
    errors.name = "Full name is required.";
  }

  if (!customer.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!emailRegex.test(customer.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!customer.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!phoneRegex.test(customer.phone)) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!customer.address.trim()) {
    errors.address = "Delivery address is required.";
  }

  if (cartCount === 0) {
    errors.cart =
      "Please add at least one product to your cart before checking out.";
  }

  return {
    valid: !Object.values(errors).some((message) => message.length > 0),
    errors,
  };
}
