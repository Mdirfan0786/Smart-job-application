// ===== Validation Helper =====

// Check empty field
export function isEmpty(value) {
  return !value || value.trim() === "";
}

// Email validation
export function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

// Phone validation (10 digit)
export function isValidPhone(phone) {
  return /^[0-9]{10}$/.test(phone);
}

// ===== Error UI Helper =====

// Show error
export function showError(input, message) {
  input.classList.add("error");

  const errorEl = document.getElementById(input.name + "Err");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add("visible");
  }
}

// Remove error
export function clearError(input) {
  input.classList.remove("error");

  const errorEl = document.getElementById(input.name + "Err");
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.classList.remove("visible");
  }
}
