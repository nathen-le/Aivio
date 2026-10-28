/**
 * Username normalization and validation.
 *
 * Normalization must stay in sync with the regex in firestore.rules: the
 * reservation document ID is the normalized form, so a value this module
 * accepts but the rules reject would fail server-side.
 */

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;

/** Shape-only check. The server is still the authority on availability. */
export const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

/** Names reserved for the product so learners cannot impersonate it. */
const RESERVED_USERNAMES = new Set([
  'admin', 'administrator', 'root', 'support', 'help', 'staff', 'team',
  'aivio', 'aivo', 'official', 'moderator', 'mod', 'system', 'null',
  'undefined', 'me', 'you', 'anonymous', 'guest',
]);

/**
 * Lowercases, trims and turns runs of whitespace, dots and dashes into
 * underscores, so "Ada Lovelace" and "ada.lovelace" both land on "ada_lovelace".
 */
export function normalizeUsername(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[\s.-]+/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '');
}

/** Returns an error message for display, or null when the name is usable. */
export function validateUsername(normalized: string): string | null {
  if (normalized.length < USERNAME_MIN_LENGTH) {
    return `Username must be at least ${USERNAME_MIN_LENGTH} characters.`;
  }
  if (normalized.length > USERNAME_MAX_LENGTH) {
    return `Username must be ${USERNAME_MAX_LENGTH} characters or fewer.`;
  }
  if (!USERNAME_PATTERN.test(normalized)) {
    return 'Use only letters, numbers and underscores.';
  }
  if (RESERVED_USERNAMES.has(normalized)) {
    return 'That username is reserved. Please pick another.';
  }
  return null;
}

/** Seeds a starting suggestion from an email local part. */
export function suggestUsernameFromEmail(email: string): string {
  const localPart = email.split('@')[0] ?? '';
  const normalized = normalizeUsername(localPart);
  return validateUsername(normalized) === null ? normalized : '';
}
