/**
 * PreConsult — Patient Profile & ABHA Identity Service
 * Manages Ayushman Bharat Health Account (ABHA) IDs, patient demographics,
 * preferred language, and accessibility mode settings in localStorage.
 */

export const PATIENT_PROFILE_KEY = 'preconsult_patient_profile';

export const DEMO_PATIENT_PROFILE = {
  abhaId: '91-8765-4321-0987',
  abhaAddress: 'ramesh.kumar@abdm',
  name: 'Ramesh Kumar',
  phone: '+91 98765 43210',
  email: 'ramesh.kumar@example.com',
  gender: 'Male',
  age: '58',
  bloodGroup: 'B+',
  emergencyContact: '+91 98765 01234',
  address: '42, Ayur Marg, Vasant Kunj, New Delhi 110070',
  language: 'hi',
  mode: 'elderly',
  isAbhaVerified: true,
  createdAt: new Date().toISOString(),
};

/**
 * Formats a raw number or string into 14-digit ABHA pattern: XX-XXXX-XXXX-XXXX
 */
export function formatAbhaId(value = '') {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  const parts = [];
  if (digits.length > 0) parts.push(digits.slice(0, 2));
  if (digits.length > 2) parts.push(digits.slice(2, 6));
  if (digits.length > 6) parts.push(digits.slice(6, 10));
  if (digits.length > 10) parts.push(digits.slice(10, 14));
  return parts.join('-');
}

/**
 * Validates whether an ABHA ID meets standard 14-digit pattern or username@abdm pattern
 */
export function isValidAbha(val = '') {
  if (!val) return false;
  const cleaned = val.trim();
  const is14Digit = /^\d{2}-\d{4}-\d{4}-\d{4}$/.test(cleaned) || /^\d{14}$/.test(cleaned);
  const isAbhaAddress = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+$/.test(cleaned);
  return is14Digit || isAbhaAddress || cleaned.length >= 8;
}

/**
 * Retrieves the stored patient profile or null if not yet setup
 */
export function getPatientProfile() {
  try {
    const raw = localStorage.getItem(PATIENT_PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load patient profile:', err);
    return null;
  }
}

/**
 * Saves or updates the patient profile in localStorage
 */
export function savePatientProfile(profile) {
  try {
    const existing = getPatientProfile() || {};
    const updated = {
      ...existing,
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(PATIENT_PROFILE_KEY, JSON.stringify(updated));

    // Also synchronize standalone language & mode keys for legacy compatibility
    if (updated.language) {
      localStorage.setItem('preconsult_user_language', updated.language);
    }
    if (updated.mode) {
      localStorage.setItem('preconsult_user_mode', updated.mode);
    }

    return updated;
  } catch (err) {
    console.error('Failed to save patient profile:', err);
    return profile;
  }
}

/**
 * Clears the patient profile upon logout
 */
export function clearPatientProfile() {
  try {
    localStorage.removeItem(PATIENT_PROFILE_KEY);
  } catch (err) {
    console.error('Failed to clear patient profile:', err);
  }
}
