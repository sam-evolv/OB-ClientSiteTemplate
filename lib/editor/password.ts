/**
 * Password rules.
 *
 * Deliberately not in the 'use server' action module: Next only permits async
 * exports there, and this needs to be callable from tests and the form too.
 *
 * The sign-in page is publicly reachable and these accounts edit a live
 * website, so an obvious password is a real exposure rather than a nicety.
 */
export function passwordProblem(pw: string): string | null {
  if (pw.length < 10) return 'Use at least 10 characters.';
  if (!/[a-zA-Z]/.test(pw)) return 'Include at least one letter.';
  if (!/[0-9]/.test(pw)) return 'Include at least one number.';

  // The shapes someone reaches for first on a gym or admin login.
  const obvious = [
    'gym123456', 'admin12345', 'password12', 'empiregym1', 'letmein123',
    'qwerty1234', '1234567890', 'password123', 'gymadmin12', 'changeme12',
    'empiregym26', 'gymadmin26',
  ];
  if (obvious.includes(pw.toLowerCase())) return 'That password is too easy to guess.';

  return null;
}