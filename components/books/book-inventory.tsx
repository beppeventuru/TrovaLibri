"use client";

import { BookOpen, Box, Check, ChevronDown, CircleHelp, MapPin, PackagePlus, Pencil, Plus, RotateCcw, Search, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { initialLibraryState } from "@/domain/books/seed-books";
import type { Book as BookRecord, LibraryState } from "@/domain/books/types";
import { loadLibrary, saveLibrary } from "@/lib/storage/book-storage";
import { InstallAppButton } from "@/components/pwa/install-app-button";

type Filter = "all" | "available" | "sold";
type Modal = "book" | "container" | null;
const colors = ["coral", "sky", "sun", "violet", "mint"];

export function BookInventory() {
  const [library, setLibrary] = useState<LibraryState>(initialLibraryState);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [containerFilter, setContainerFilter] = useState("all");
  const [modal, setModal] = useState<Modal>(null);
  const [editingBook, setEditingBook] = useState<BookRecord | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLibrary(loadLibrary(initialLibraryState));
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => { if (ready) saveLibrary(library) }, [library, ready]);

  const containerMap = useMemo(() => new Map(library.containers.map((container) => [container.id, container])), [library.containers]);
  const filteredBooks = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("it");
    return library.books.filter((book) => book.title.toLocaleLowerCase("it").includes(normalized) && (filter === "all" || book.status === filter) && (containerFilter === "all" || book.containerId === containerFilter));
  }, [library.books, query, filter, containerFilter]);
  const available = library.books.filter((book) => book.status === "available").length;
  const sold = library.books.length - available;

  function toggleSold(id: string) { setLibrary((current) => ({ ...current, books: current.books.map((book) => book.id === id ? { ...book, status: book.status === "sold" ? "available" : "sold" } : book) })) }
  function editTitle(id: string, title: string) {
    setLibrary((current) => ({ ...current, books: current.books.map((book) => book.id === id ? { ...book, title: title.trim(), uncertain: false } : book) }));
    setEditingBook(null);
  }
  function addBook(title: string, containerId: string) {
    const book: BookRecord = { id: crypto.randomUUID(), title: title.trim(), containerId, status: "available", createdAt: new Date().toISOString() };
    setLibrary((current) => ({ ...current, books: [book, ...current.books] })); setContainerFilter("all"); setFilter("all"); setModal(null);
  }
  function addContainer(name: string) {
    setLibrary((current) => ({ ...current, containers: [...current.containers, { id: crypto.randomUUID(), name: name.trim(), color: colors[current.containers.length % colors.length] }] })); setModal(null);
  }

  return <div className="app-frame">
    <header className="topbar">
      <a className="brand" href="#top" aria-label="TrovaLibri - inizio pagina"><span className="brand-mark"><BookOpen size={22} strokeWidth={2.3} /></span><span>Trova<span>Libri</span></span></a>
      <div className="topbar-actions"><InstallAppButton /><button className="outline-button" onClick={() => setModal("container")}><PackagePlus size={18} /><span>Nuovo contenitore</span></button></div>
    </header>
    <main id="top">
      <section className="hero">
        <div><p className="eyebrow">Il tuo inventario Vinted</p><h1>Trova ogni libro.<br /><em>In un attimo.</em></h1><p className="hero-copy">Cerca un titolo e scopri subito dove l&apos;hai riposto. Quando lo vendi, basta un tocco.</p></div>
        <div className="summary" aria-label="Riepilogo inventario"><div><strong>{available}</strong><span>Disponibili</span></div><div><strong>{sold}</strong><span>Venduti</span></div><div><strong>{library.containers.length}</strong><span>Contenitori</span></div></div>
      </section>
      <section className="search-panel" aria-label="Ricerca e filtri">
        <label className="search-field"><Search size={22} aria-hidden="true" /><span className="sr-only">Cerca un libro</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cerca per titolo..." autoComplete="off" />{query && <button onClick={() => setQuery("")} aria-label="Cancella ricerca"><X size={18} /></button>}</label>
        <label className="select-field"><span className="sr-only">Filtra per contenitore</span><MapPin size={17} /><select value={containerFilter} onChange={(event) => setContainerFilter(event.target.value)}><option value="all">Tutti i contenitori</option>{library.containers.map((container) => <option key={container.id} value={container.id}>{container.name}</option>)}</select><ChevronDown size={16} aria-hidden="true" /></label>
      </section>
      <section className="container-strip" aria-label="Contenitori">
        {library.containers.map((container) => { const count = library.books.filter((book) => book.containerId === container.id && book.status === "available").length; const active = containerFilter === container.id; return <button key={container.id} className={`container-card ${active ? "active" : ""}`} data-color={container.color} onClick={() => setContainerFilter(active ? "all" : container.id)}><span className="box-icon"><Box size={21} /></span><span><strong>{container.name}</strong><small>{count} {count === 1 ? "libro" : "libri"}</small></span></button> })}
      </section>
      <section className="inventory">
        <div className="section-heading"><div><p className="eyebrow">Inventario</p><h2>{filteredBooks.length} {filteredBooks.length === 1 ? "libro" : "libri"}</h2></div><div className="segmented" aria-label="Filtra per stato">{(["all", "available", "sold"] as const).map((value) => <button key={value} className={filter === value ? "selected" : ""} onClick={() => setFilter(value)}>{value === "all" ? "Tutti" : value === "available" ? "Disponibili" : "Venduti"}</button>)}</div></div>
        {filteredBooks.length ? <div className="book-list">{filteredBooks.map((book) => { const container = containerMap.get(book.containerId); return <article key={book.id} className={`book-row ${book.status === "sold" ? "is-sold" : ""}`}>
          <button className="sold-check" onClick={() => toggleSold(book.id)} aria-label={book.status === "sold" ? `Ripristina ${book.title}` : `Segna ${book.title} come venduto`} aria-pressed={book.status === "sold"}>{book.status === "sold" && <Check size={17} strokeWidth={3} />}</button>
          <div className="book-info"><h3>{book.title}</h3><p><span className="location-dot" data-color={container?.color} /><MapPin size={14} />{container?.name ?? "Senza contenitore"}</p></div>
          {book.uncertain && <span className="uncertain" title="Titolo da verificare sul libro"><CircleHelp size={15} /><span>Da verificare</span></span>}
          <div className="row-actions"><button className="edit-action" onClick={() => setEditingBook(book)} aria-label={`Modifica il titolo ${book.title}`}><Pencil size={15} />Modifica</button><button className="status-action" onClick={() => toggleSold(book.id)}>{book.status === "sold" ? <><RotateCcw size={16} />Ripristina</> : "Segna venduto"}</button></div>
        </article> })}</div> : <div className="empty-state"><Search size={30} /><h3>Nessun libro trovato</h3><p>Prova a cambiare ricerca o filtri.</p></div>}
      </section>
    </main>
    <button className="fab" onClick={() => setModal("book")}><Plus size={21} strokeWidth={3} />Aggiungi libro</button>
    {modal === "book" && <BookModal containers={library.containers} onClose={() => setModal(null)} onSubmit={addBook} />}
    {modal === "container" && <ContainerModal onClose={() => setModal(null)} onSubmit={addContainer} />}
    {editingBook && <EditBookModal book={editingBook} onClose={() => setEditingBook(null)} onSubmit={editTitle} />}
  </div>;
}

function ModalFrame({ title, subtitle, children, onClose }: { title: string; subtitle: string; children: React.ReactNode; onClose: () => void }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" onClick={onClose} aria-label="Chiudi"><X /></button><p className="eyebrow">Inventario</p><h2 id="modal-title">{title}</h2><p>{subtitle}</p>{children}</div></div>;
}
function BookModal({ containers, onClose, onSubmit }: { containers: LibraryState["containers"]; onClose: () => void; onSubmit: (title: string, containerId: string) => void }) {
  const [title, setTitle] = useState(""); const [containerId, setContainerId] = useState(containers[0]?.id ?? "");
  function submit(event: FormEvent) { event.preventDefault(); if (title.trim() && containerId) onSubmit(title, containerId) }
  return <ModalFrame title="Aggiungi un libro" subtitle="Indica il titolo e dove lo riporrai." onClose={onClose}><form onSubmit={submit} className="modal-form"><label>Titolo<input autoFocus required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Es. Il nome della rosa" /></label><label>Contenitore<select required value={containerId} onChange={(event) => setContainerId(event.target.value)}>{containers.map((container) => <option value={container.id} key={container.id}>{container.name}</option>)}</select></label><button className="primary-button" type="submit"><Plus size={18} />Aggiungi libro</button></form></ModalFrame>;
}
function ContainerModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (name: string) => void }) {
  const [name, setName] = useState(""); function submit(event: FormEvent) { event.preventDefault(); if (name.trim()) onSubmit(name) }
  return <ModalFrame title="Nuovo contenitore" subtitle="Aggiungi una posizione per i tuoi libri." onClose={onClose}><form onSubmit={submit} className="modal-form"><label>Nome<input autoFocus required value={name} onChange={(event) => setName(event.target.value)} placeholder="Es. Scatola blu" /></label><button className="primary-button" type="submit"><PackagePlus size={18} />Crea contenitore</button></form></ModalFrame>;
}

function EditBookModal({ book, onClose, onSubmit }: { book: BookRecord; onClose: () => void; onSubmit: (id: string, title: string) => void }) {
  const [title, setTitle] = useState(book.title);
  function submit(event: FormEvent) { event.preventDefault(); if (title.trim()) onSubmit(book.id, title) }
  return <ModalFrame title="Modifica il titolo" subtitle="Correggi il nome del libro. La modifica verrà salvata su questo dispositivo." onClose={onClose}><form onSubmit={submit} className="modal-form"><label>Titolo<input autoFocus required value={title} onChange={(event) => setTitle(event.target.value)} onFocus={(event) => event.currentTarget.select()} /></label><button className="primary-button" type="submit"><Check size={18} />Salva modifica</button></form></ModalFrame>;
}
