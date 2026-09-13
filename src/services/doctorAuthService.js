const DOCTOR_ACCOUNTS_KEY = 'preconsult_encrypted_doctor_accounts';
const DOCTOR_SESSION_KEY = 'preconsult_doctor_session';
const DEMO_PASSWORD_KEY = 'preconsult_demo_doctor_password';
const PBKDF2_ITERATIONS = 150000;

export const DEFAULT_DOCTOR_PROFILE = {
  username: 'doctor01',
  name: 'Dr. Ananya Rao',
  specialty: 'Ayurveda & General Medicine',
  registration: 'AYU-KA-20481',
  council: 'Karnataka Ayurvedic and Unani Practitioners Board (KAUPB)',
  qualification: 'BAMS, MD (Ayurveda Panchakarma)',
  experience: '12 Years Clinical Practice',
  hprId: '91-2048-1928-3746',
  hprAddress: 'dr.ananya.rao@hpr.abdm',
  email: 'dr.ananya.rao@ayush.gov.in',
  phone: '+91 98450 12345',
  hospital: 'District Government AYUSH Hospital & Research Centre',
  department: 'Ayurvedic Outpatient Department (OPD Chamber 4)',
  opdRoom: 'Chamber 104 (1st Floor, OPD Block A)',
  opdTimings: 'Mon–Sat: 09:00 AM – 02:00 PM',
  signatureStatus: 'Verified Digital Signatory (eSign ABDM)',
  emergencyDuty: 'On-Call (Emergency Triage)',
  bio: 'Senior Ayurvedic Medical Officer specializing in integrative clinical triage, chronic metabolic disorders, and Panchakarma therapies with ABDM digital health records integration.',
};

/**
 * Format a 14-digit ABDM Healthcare Professional Registry (HPR) ID:
 * XX-XXXX-XXXX-XXXX
 */
export function formatHprId(value) {
  if (!value) return '';
  const digits = value.replace(/\D/g, '').slice(0, 14);
  const parts = [];
  if (digits.length > 0) parts.push(digits.slice(0, 2));
  if (digits.length > 2) parts.push(digits.slice(2, 6));
  if (digits.length > 6) parts.push(digits.slice(6, 10));
  if (digits.length > 10) parts.push(digits.slice(10, 14));
  return parts.join('-');
}

const toBase64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const fromBase64 = (value) => Uint8Array.from(atob(value), (char) => char.charCodeAt(0));

async function deriveKey(password, salt) {
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

function readAccounts() {
  try {
    return JSON.parse(localStorage.getItem(DOCTOR_ACCOUNTS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getDoctorSession() {
  try {
    const raw = localStorage.getItem(DOCTOR_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveDoctorProfile(updatedProfile) {
  const current = getDoctorSession() || DEFAULT_DOCTOR_PROFILE;
  const merged = { ...current, ...updatedProfile };
  localStorage.setItem(DOCTOR_SESSION_KEY, JSON.stringify(merged));

  // Dispatch custom event for real-time sync across tabs and components
  window.dispatchEvent(new CustomEvent('preconsult_doctor_profile_updated', { detail: merged }));
  return merged;
}

export async function registerDoctor({ username, password, name, specialty, registration, council, qualification, hprId, hospital, department, phone, email, opdRoom, opdTimings, bio }) {
  const normalizedUsername = username.trim().toLowerCase();
  const accounts = readAccounts();
  if (accounts.some((account) => account.username === normalizedUsername)) {
    throw new Error('That doctor ID is already registered.');
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const payload = JSON.stringify({
    name,
    specialty: specialty || 'General Medicine',
    registration: registration || 'Verified Clinician',
    username: normalizedUsername,
    council: council || 'State Medical Council',
    qualification: qualification || 'MBBS / BAMS',
    hprId: hprId || '91-0000-0000-0000',
    hospital: hospital || 'Civil Hospital',
    department: department || 'OPD Department',
    phone: phone || '',
    email: email || '',
    opdRoom: opdRoom || 'Chamber 1',
    opdTimings: opdTimings || 'Mon–Sat: 09:00 AM – 02:00 PM',
    bio: bio || '',
  });

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(payload),
  );

  accounts.push({
    username: normalizedUsername,
    salt: toBase64(salt),
    iv: toBase64(iv),
    ciphertext: toBase64(ciphertext),
  });
  localStorage.setItem(DOCTOR_ACCOUNTS_KEY, JSON.stringify(accounts));
}

export async function authenticateDoctor(username, password) {
  const normalized = username.trim().toLowerCase();

  // Check demo doctor with potential changed password
  if (normalized === DEFAULT_DOCTOR_PROFILE.username) {
    const customDemoPass = localStorage.getItem(DEMO_PASSWORD_KEY) || 'doctor123';
    if (password === customDemoPass) {
      const savedSession = getDoctorSession();
      return savedSession || DEFAULT_DOCTOR_PROFILE;
    }
  }

  const account = readAccounts().find((item) => item.username === normalized);
  if (!account) throw new Error('Invalid doctor ID or password.');

  try {
    const key = await deriveKey(password, fromBase64(account.salt));
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromBase64(account.iv) },
      key,
      fromBase64(account.ciphertext),
    );
    return JSON.parse(new TextDecoder().decode(plaintext));
  } catch {
    throw new Error('Invalid doctor ID or password.');
  }
}

export async function changeDoctorPassword(username, currentPassword, newPassword) {
  const normalized = username.trim().toLowerCase();

  // Support demo account password change
  if (normalized === DEFAULT_DOCTOR_PROFILE.username) {
    const activeDemoPass = localStorage.getItem(DEMO_PASSWORD_KEY) || 'doctor123';
    if (currentPassword !== activeDemoPass) {
      throw new Error('Current password is incorrect.');
    }
    localStorage.setItem(DEMO_PASSWORD_KEY, newPassword);
    return true;
  }

  const account = readAccounts().find((item) => item.username === normalized);
  if (!account) throw new Error('Doctor account not found.');

  let profile;
  try {
    const oldKey = await deriveKey(currentPassword, fromBase64(account.salt));
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromBase64(account.iv) },
      oldKey,
      fromBase64(account.ciphertext),
    );
    profile = JSON.parse(new TextDecoder().decode(plaintext));
  } catch {
    throw new Error('Current password is incorrect.');
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(newPassword, salt);
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(JSON.stringify(profile)),
  );

  account.salt = toBase64(salt);
  account.iv = toBase64(iv);
  account.ciphertext = toBase64(ciphertext);
  localStorage.setItem(DOCTOR_ACCOUNTS_KEY, JSON.stringify(readAccounts().map((item) => item.username === account.username ? account : item)));
  return true;
}
