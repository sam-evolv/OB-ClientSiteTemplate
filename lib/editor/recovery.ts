/**
 * Password-recovery session marker.
 *
 * Deliberately not in the 'use server' action module — Next only permits async
 * exports there, and both the callback route and the reset page need this name.
 *
 * Why it exists: the reset page sets a new password without asking for the
 * current one (the emailed token is the proof of identity). If a normal signed-in
 * session could reach it, anyone holding a live session — a shared laptop, a
 * borrowed phone — could lock the real owner out. The callback sets this cookie
 * only for `type=recovery`, and the reset action clears it after use.
 */
export const RECOVERY_COOKIE = 'ed_recovery';

/** How long a recovery link stays usable after it is followed. */
export const RECOVERY_MAX_AGE_SECONDS = 60 * 30;
