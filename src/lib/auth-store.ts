"use client";

export type LocalUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};

const USER_KEY = "flowboard-user-v1";
const SESSION_KEY = "flowboard-session-v1";

async function hashPassword(password: string) {
  const bytes = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, "0")).join("");
}

export function readStoredUser(): LocalUser | null {
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) as LocalUser : null;
  } catch {
    return null;
  }
}

export function getCurrentUser(): LocalUser | null {
  const user = readStoredUser();
  const sessionId = window.localStorage.getItem(SESSION_KEY);
  return user && sessionId === user.id ? user : null;
}

export function hasSession() {
  return Boolean(getCurrentUser());
}

export async function registerUser(name: string, email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const current = readStoredUser();

  if (current && current.email !== normalizedEmail) {
    // A new browser-local account gets its own workspace namespace.
    window.localStorage.removeItem(`flowboard-workspace-${current.id}`);
  }

  const user: LocalUser = {
    id: window.crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: await hashPassword(password),
  };

  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.localStorage.setItem(SESSION_KEY, user.id);
  return user;
}

export async function signInUser(email: string, password: string) {
  const user = readStoredUser();
  if (!user) return false;

  const hash = await hashPassword(password);
  if (user.email !== email.trim().toLowerCase() || user.passwordHash !== hash) return false;

  window.localStorage.setItem(SESSION_KEY, user.id);
  return true;
}

export function updateCurrentUser(patch: Partial<Pick<LocalUser, "name" | "email">>) {
  const current = getCurrentUser();
  if (!current) return null;

  const next = {
    ...current,
    ...patch,
    name: patch.name === undefined ? current.name : patch.name.trim(),
    email: patch.email === undefined ? current.email : patch.email.trim().toLowerCase(),
  };

  window.localStorage.setItem(USER_KEY, JSON.stringify(next));
  return next;
}

export function signOutUser() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function deleteLocalAccount() {
  const user = readStoredUser();
  if (user) window.localStorage.removeItem(`flowboard-workspace-${user.id}`);
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem(SESSION_KEY);
}