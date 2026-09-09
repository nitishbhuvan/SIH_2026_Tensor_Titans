const DOCTOR_ACCOUNTS_KEY = 'preconsult_encrypted_doctor_accounts';
const PBKDF2_ITERATIONS = 150000;

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

export async function registerDoctor({ username, password, name, specialty, registration }) {
  const normalizedUsername = username.trim().toLowerCase();
  const accounts = readAccounts();
  if (accounts.some((account) => account.username === normalizedUsername)) {
    throw new Error('That doctor ID is already registered.');
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const payload = JSON.stringify({ name, specialty, registration, username: normalizedUsername });
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
  const account = readAccounts().find((item) => item.username === username.trim().toLowerCase());
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
  const account = readAccounts().find((item) => item.username === username.trim().toLowerCase());
  if (!account) throw new Error('The demo password cannot be changed.');

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
}
