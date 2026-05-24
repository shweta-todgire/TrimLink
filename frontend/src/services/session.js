const SESSION_KEY = "trimlink_session_id";

/**
 * Returns the persistent session ID for this browser.
 * Generates a UUID v4 on first call and stores it in localStorage.
 */
export function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = generateUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

/**
 * Simple UUID v4 generator (no external lib needed).
 */
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
