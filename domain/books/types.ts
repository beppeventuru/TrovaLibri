export type BookStatus = "available" | "sold";
export type Book = { id: string; title: string; containerId: string; status: BookStatus; uncertain?: boolean; createdAt: string };
export type BookContainer = { id: string; name: string; color: string };
export type LibraryState = { books: Book[]; containers: BookContainer[] };
