import type { LibraryState } from "@/domain/books/types";
const STORAGE_KEY = "trovalibri-library-v1";
export function loadLibrary(fallback: LibraryState): LibraryState { if (typeof window === "undefined") return fallback; try { const value = window.localStorage.getItem(STORAGE_KEY); return value ? (JSON.parse(value) as LibraryState) : fallback } catch { return fallback } }
export function saveLibrary(state: LibraryState): void { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) }
