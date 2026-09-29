"use client";
import Link from "next/link";
import { LayoutGrid, Plus, Search, Star, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useLanguage } from "@/components/language-provider";
import { useWorkspace } from "@/lib/workspace-store";

export default function BoardsPage() {
  const { copy, language } = useLanguage();
  const { state, createBoard, deleteBoard, toggleFavorite } = useWorkspace();
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const boards = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return state.boards.filter((board) => board.title.toLowerCase().includes(needle));
  }, [state.boards, query]);

  function submit() {
    const value = title.trim();
    if (!value) return;
    createBoard(value);
    setTitle("");
    setCreating(false);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl p-4 sm:p-7">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[.18em] text-[var(--muted)]">{language === "ru" ? "Рабочее пространство" : "Workspace"}</div>
            <h1 className="mt-1 text-2xl font-semibold tracking-[-.03em]">{copy.boards}</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">{language === "ru" ? "Все рабочие доски в одном месте." : "All your boards in one place."}</p>
          </div>
          <button type="button" onClick={() => setCreating(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-[#06211c]">
            <Plus size={14} />
            {language === "ru" ? "Создать доску" : "Create board"}
          </button>
        </header>

        {creating && (
          <section className="mt-6 rounded-2xl border border-white/8 bg-white/[.025] p-4">
            <label className="grid gap-2">
              <span className="text-xs text-[var(--muted)]">{language === "ru" ? "Название" : "Name"}</span>
              <input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") submit(); if (event.key === "Escape") { setCreating(false); setTitle(""); } }} className="focus-ring h-11 rounded-xl border border-white/8 bg-black/10 px-3 text-sm outline-none" placeholder={language === "ru" ? "Например, Запуск приложения" : "e.g. Product launch"} />
            </label>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={submit} className="rounded-xl bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-[#06211c]">{language === "ru" ? "Создать" : "Create"}</button>
              <button type="button" onClick={() => { setCreating(false); setTitle(""); }} className="rounded-xl border border-white/8 px-3 py-2 text-xs text-[var(--muted)]">{copy.cancel}</button>
            </div>
          </section>
        )}

        <div className="mt-7 flex items-center gap-2 rounded-xl border border-white/8 bg-white/[.025] px-3">
          <Search size={15} className="text-[var(--muted)]" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 flex-1 bg-transparent text-sm outline-none" placeholder={language === "ru" ? "Поиск досок" : "Search boards"} />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {boards.map((board) => {
            const total = board.columns.reduce((sum, column) => sum + column.tasks.length, 0);
            const done = board.columns.find((column) => column.id === "done")?.tasks.length || 0;
            const progress = total ? Math.round((done / total) * 100) : 0;
            return (
              <article key={board.id} className="group rounded-3xl border border-white/8 bg-white/[.025] p-5 transition-soft hover:-translate-y-0.5 hover:border-[var(--accent)]/25">
                <div className="flex items-start justify-between gap-3">
                  <Link href={"/app/board?board=" + board.id} className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-[rgba(45,212,191,.08)]"><LayoutGrid size={16} className="text-[var(--accent)]" /></div>
                      <div className="truncate font-medium">{board.title}</div>
                    </div>
                    <p className="mt-3 line-clamp-2 text-xs leading-5 text-[var(--muted)]">{board.description || (language === "ru" ? "Рабочая доска Flowboard." : "A Flowboard project board.")}</p>
                  </Link>
                  <div className="flex items-center gap-1">
                    <button type="button" title={language === "ru" ? "Избранное" : "Favorite"} aria-pressed={Boolean(board.favorite)} onClick={() => toggleFavorite(board.id)} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] hover:bg-white/5 hover:text-white">
                      <Star size={14} fill={board.favorite ? "currentColor" : "none"} className={board.favorite ? "text-[var(--warning)]" : ""} />
                    </button>
                    <button type="button" title={language === "ru" ? "Удалить" : "Delete"} onClick={() => setDeleteId(board.id)} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] opacity-0 transition group-hover:opacity-100 hover:bg-[rgba(255,113,113,.08)] hover:text-[var(--danger)]">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between text-[10px] text-[var(--muted)]">
                  <span>{total} {language === "ru" ? "задач" : "cards"}</span>
                  <span>{progress}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/7"><div className="h-full rounded-full bg-[var(--accent)]" style={{ width: progress + "%" }} /></div>
              </article>
            );
          })}
        </div>

        {boards.length === 0 && (
          <div className="mt-6 rounded-3xl border border-dashed border-white/10 p-10 text-center">
            <LayoutGrid className="mx-auto text-[var(--muted)]" />
            <h2 className="mt-4 text-lg font-medium">{language === "ru" ? "Досок пока нет" : "No boards yet"}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{language === "ru" ? "Создай первую доску и начни добавлять задачи." : "Create your first board and start adding tasks."}</p>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[var(--modal)] p-5 shadow-2xl">
            <h2 className="font-medium">{language === "ru" ? "Удалить доску?" : "Delete board?"}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{language === "ru" ? "Доска и все её карточки будут удалены из этого браузера." : "The board and all its cards will be removed from this browser."}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setDeleteId(null)} className="rounded-xl border border-white/8 px-4 py-2.5 text-xs text-[var(--muted)]">{copy.cancel}</button>
              <button type="button" onClick={() => { if (deleteId) deleteBoard(deleteId); setDeleteId(null); }} className="rounded-xl bg-[var(--danger)] px-4 py-2.5 text-xs font-semibold text-white">{language === "ru" ? "Удалить" : "Delete"}</button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
