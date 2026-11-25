// js/utils/validators.js

export function isValidEmail(email) {
  if (!email) return true; // Optional fields can be empty
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function isValidPhone(phone) {
  if (!phone) return true;
  // Basic 10-digit format
  const re = /^[0-9]{10}$/;
  return re.test(phone.trim().replace(/[-\s]/g, ''));
}

export function isNonEmptyString(val) {
  return typeof val === 'string' && val.trim().length > 0;
}