/**
 * Maps Firebase auth error codes to messages safe to show a learner.
 * Deliberately vague on sign-in failures so the form cannot be used to
 * discover which email addresses have accounts.
 */
const MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'That email already has an account. Try logging in instead.',
  'auth/invalid-email': 'That does not look like a valid email address.',
  'auth/weak-password': 'Password is too weak — use at least 6 characters.',
  'auth/missing-password': 'Please enter your password.',
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/wrong-password': 'Email or password is incorrect.',
  'auth/user-not-found': 'Email or password is incorrect.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/too-many-requests': 'Too many attempts. Wait a moment and try again.',
  'auth/network-request-failed': 'Network problem — check your connection and try again.',
  'auth/operation-not-allowed':
    'Email/password sign-in is not enabled for this Firebase project.',
};

export function getAuthErrorMessage(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code: unknown }).code)
      : '';

  if (code) {
    // Log the code only — never the submitted email or password.
    console.error('Firebase auth error:', code);
  }

  return MESSAGES[code] ?? 'Something went wrong. Please try again.';
}
