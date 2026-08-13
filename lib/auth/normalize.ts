/**
 * Shared input normalization for email/password across user-creation and
 * login paths. Email is always trim + lowercase (Supabase Auth is
 * case-insensitive on email, but `profiles.email` and CSV/manual input are
 * not, so normalizing here keeps both stores and login consistent).
 * Password is trim-only — case must never be altered, or the account is
 * created with a different password than what gets communicated to the user.
 */

export function normalizeEmail(email: string | undefined | null): string {
  return (email ?? "").trim().toLowerCase();
}

export function normalizePassword(password: string | undefined | null): string {
  return (password ?? "").trim();
}
