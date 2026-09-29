"use client";

import Link from "next/link";
import { CalendarClock, CheckSquare2, Edit3, Filter, MoreHorizontal, Plus, Search, ShieldAlert, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { useLanguage } from "@/components/language-provider";
import { useWorkspace, type Board } from "@/lib/workspace-store";
import type { Task } from "@/lib/mock-data";

export default function BoardPage() {
  const searchParams = useSearchParams();
  const boardId = searchParams.get("board") || "";
  const { language } = useLanguage();
  const { state, addColumn, renameBoard, addTask, updateTask, deleteTask, moveTask, renameColumn, deleteColumn } = useWorkspace();
  const board = state.boards.find(item => item.id === boardId);
  const [query, setQuery] = useState("");
  const [activeTask, setActiveTask] = useState<{ columnId: string; task: Task } | null>(null);
  const [columnForm, setColumnForm] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [editingBoard, setEditingBoard] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [renameColumnId, setRenameColumnId] = useState<string | null>(null);
  const [renameColumnValue, setRenameColumnValue] = useState("");
  const [deleteColumnId, setDeleteColumnId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<"all" | Task["priority"]>("all");
  const [dueFilter, setDueFilter] = useState(false);
  const [blockedFilter, setBlockedFilter] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  if (!board) {
    return (
      <AppShell>
        <div className="mx-auto max-w-5xl p-7">
          <Link href="/app/boards" className="text-sm text-[var(--accent)]">← {language === "ru" ? "К доскам" : "Back to boards"}</Link>
          <h1 className="mt-5 text-2xl font-semibold">{language === "ru" ? "Доска не найдена" : "Board not found"}</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">{language === "ru" ? "Возможно, доска была удалена или ссылка устарела." : "The board may have been deleted or the link is outdated."}</p>
        </div>
      </AppShell>
    );
  }

  const currentBoard: Board = board;
  const total = currentBoard.columns.reduce((sum, column) => sum + column.tasks.length, 0);
  const doneColumn = currentBoard.columns.find(column => column.id === "done") ?? currentBoard.columns[currentBoard.columns.length - 1];
  const done = doneColumn?.tasks.length || 0;
  const progress = total ? Math.round((done / total) * 100) : 0;
  const filtered = currentBoard.columns.map(column => ({
    ...column,
    tasks: column.tasks.filter(task => {
      const haystack = `${task.title} ${task.description || ""} ${task.labels.join(" ")}`.toLowerCase();
      const matchesQuery = haystack.includes(query.trim().toLowerCase());
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      const matchesDue = !dueFilter || Boolean(task.due);
      const matchesBlocked = !blockedFilter || Boolean(task.blocked);
      return matchesQuery && matchesPriority && matchesDue && matchesBlocked;
    }),
  }));

  function createTask(columnId: string) {
    addTask(currentBoard.id, columnId, { title: language === "ru" ? "Новая задача" : "New task", labels: [language === "ru" ? "Работа" : "Work"], priority: "Medium" });
    setToast(language === "ru" ? "Карточка добавлена" : "Card added");
  }

  function saveColumnRename() {
    if (!renameColumnId) return;
    const clean = renameColumnValue.trim();
    if (!clean) return;
    renameColumn(currentBoard.id, renameColumnId, clean);
    setRenameColumnId(null);
    setRenameColumnValue("");
  }

  function deleteColumnConfirmed() {
    if (!deleteColumnId) return;
    deleteColumn(currentBoard.id, deleteColumnId);
    setDeleteColumnId(null);
    setToast(language === "ru" ? "Колонка удалена" : "List deleted");
  }

  function copyLink() {
    const message = language === "ru" ? "Ссылка на доску скопирована" : "Board link copied";
    navigator.clipboard?.writeText(location.href).then(() => setToast(message)).catch(() => setToast(language === "ru" ? "Не удалось скопировать ссылку" : "Could not copy the link"));
  }

  return (
    <AppShell>
      <div className="min-h-full bg-[radial-gradient(circle_at_10%_10%,rgba(53,214,196,.08),transparent_28rem)]">
        <div className="border-b border-white/8 px-4 py-5 sm:px-7">
          <div className="mx-auto max-w-[1500px]">
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/app/boards" className="text-xs text-[var(--muted)] hover:text-white">{language === "ru" ? "Доски" : "Boards"}</Link>
              <span className="text-white/15">/</span>
              {editingBoard ? (
                <input autoFocus value={boardName} onChange={event => setBoardName(event.target.value)} onKeyDown={event => {
                  if (event.key === "Enter") { renameBoard(currentBoard.id, boardName.trim()); setEditingBoard(false); }
                  if (event.key === "Escape") setEditingBoard(false);
                }} onBlur={() => { if (boardName.trim()) renameBoard(currentBoard.id, boardName.trim()); setEditingBoard(false); }} className="h-9 rounded-xl border border-white/10 bg-white/[.025] px-3 text-lg font-semibold outline-none" />
              ) : (
                <h1 className="text-xl font-semibold">{currentBoard.title}</h1>
              )}
              <button type="button" title={language === "ru" ? "Переименовать" : "Rename"} onClick={() => { setBoardName(currentBoard.title); setEditingBoard(true); }} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] hover:bg-white/5 hover:text-white"><Edit3 size={14} /></button>
              <div className="ml-auto flex flex-wrap items-center gap-2">
                <div className="hidden items-center rounded-xl border border-white/8 bg-white/[.025] p-1 sm:flex">
                  <span className="rounded-lg bg-white/8 px-3 py-1.5 text-xs text-white">{language === "ru" ? "Доска" : "Board"}</span>
                  <Link href="/app/calendar" className="rounded-lg px-3 py-1.5 text-xs text-[var(--muted)] hover:text-white">{language === "ru" ? "Календарь" : "Calendar"}</Link>
                </div>
                <div className="relative">
                  <button type="button" aria-label={language === "ru" ? "Фильтры" : "Filters"} onClick={() => setFilterOpen(value => !value)} className="grid h-10 w-10 place-items-center rounded-xl border border-white/8 bg-white/[.025] text-[var(--muted)] hover:text-white"><Filter size={15} /></button>
                  {filterOpen && <div className="absolute right-0 top-12 z-30 w-64 rounded-2xl border border-white/10 bg-[var(--modal)] p-2 shadow-2xl">
                    <div className="px-2 py-2 text-[10px] uppercase tracking-[.16em] text-[var(--muted)]">{language === "ru" ? "Фильтры" : "Filters"}</div>
                    {([["all", language === "ru" ? "Все карточки" : "All cards"], ["High", language === "ru" ? "Высокий приоритет" : "High priority"], ["Medium", language === "ru" ? "Средний приоритет" : "Medium priority"], ["Low", language === "ru" ? "Низкий приоритет" : "Low priority"]] as const).map(([value, label]) => <button type="button" key={value} onClick={() => { setPriorityFilter(value as typeof priorityFilter); setFilterOpen(false); }} className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs text-[var(--muted)] hover:bg-white/5 hover:text-white"><span>{label}</span>{priorityFilter === value && <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />}</button>)}
                    <label className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-[var(--muted)] hover:bg-white/5"><input type="checkbox" checked={dueFilter} onChange={event => setDueFilter(event.target.checked)} />{language === "ru" ? "Только со сроком" : "With due date"}</label>
                    <label className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-[var(--muted)] hover:bg-white/5"><input type="checkbox" checked={blockedFilter} onChange={event => setBlockedFilter(event.target.checked)} />{language === "ru" ? "Только заблокированные" : "Blocked only"}</label>
                  </div>}
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[.025] px-3"><Search size={14} className="text-[var(--muted)]" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder={language === "ru" ? "Поиск по доске" : "Search board"} className="h-10 w-40 bg-transparent text-xs outline-none sm:w-52" /></div>
                <button type="button" onClick={copyLink} className="rounded-xl bg-[var(--accent)] px-3.5 py-2.5 text-xs font-semibold text-[#06211c]">{language === "ru" ? "Поделиться" : "Share"}</button>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <div><p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">{currentBoard.description || (language === "ru" ? "Добавь описание, чтобы команда сразу понимала назначение этой доски." : "Add a description so everyone understands the purpose of this board.")}</p><div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[var(--muted)]"><span>{total} {language === "ru" ? "задач" : "cards"}</span><span>{done} {language === "ru" ? "готово" : "done"}</span><strong className="text-white">{progress}%</strong><div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/7"><div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${progress}%` }} /></div></div></div>
            </div>
          </div>
        </div>

        <div className="scrollbar-thin overflow-x-auto p-4 sm:p-6">
          <div className="mx-auto flex min-w-[1050px] max-w-[1500px] items-start gap-3">
            {filtered.map(column => (
              <section key={column.id} onDragOver={event => event.preventDefault()} onDrop={event => {
                const data = event.dataTransfer.getData("flowboard-task");
                if (!data) return;
                const [fromId, taskId] = data.split(":");
                moveTask(currentBoard.id, taskId, fromId, column.id);
              }} className="w-[280px] shrink-0 rounded-2xl bg-white/[.035] p-2.5">
                <div className="flex items-center justify-between px-1 pb-2">
                  <div className="flex items-center gap-2"><div className="text-xs font-semibold">{column.title}</div><span className="grid h-5 min-w-5 place-items-center rounded-md bg-white/5 px-1 text-[10px] text-[var(--muted)]">{column.tasks.length}</span></div>
                  <div className="flex items-center">
                    <button type="button" onClick={() => { setRenameColumnId(column.id); setRenameColumnValue(column.title); }} title={language === "ru" ? "Переименовать" : "Rename"} className="grid h-7 w-7 place-items-center rounded-lg text-[var(--muted)] hover:bg-white/5 hover:text-white"><Edit3 size={13} /></button>
                    <button type="button" onClick={() => setDeleteColumnId(column.id)} title={language === "ru" ? "Удалить" : "Delete"} className="grid h-7 w-7 place-items-center rounded-lg text-[var(--muted)] hover:bg-[rgba(255,113,113,.07)] hover:text-[var(--danger)]"><Trash2 size={13} /></button>
                  </div>
                </div>
                <div className="content-auto space-y-2">
                  {column.tasks.map(task => <article key={task.id} draggable onDragStart={event => event.dataTransfer.setData("flowboard-task", `${column.id}:${task.id}`)} onClick={() => setActiveTask({ columnId: column.id, task })} className="card cursor-grab rounded-xl p-3 active:cursor-grabbing">
                    <div className="flex items-start justify-between gap-2"><span className="rounded-md bg-white/6 px-1.5 py-1 text-[9px] text-[var(--muted)]">{language === "ru" ? (task.priority === "High" ? "Высокий" : task.priority === "Medium" ? "Средний" : "Низкий") : task.priority}</span>{task.blocked && <ShieldAlert size={14} className="text-[var(--danger)]" />}</div>
                    <div className="mt-2 text-sm font-medium leading-5">{task.title}</div>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">{task.labels.map(label => <span key={label} className="rounded-md border border-white/8 px-1.5 py-1 text-[9px] text-[var(--muted)]">{label}</span>)}</div>
                    <div className="mt-3 flex items-center justify-between text-[10px] text-[var(--muted)]"><div className="flex gap-2.5">{task.checklist && <span className="inline-flex items-center gap-1"><CheckSquare2 size={12} />{task.checklist}</span>}{task.comments ? <span>◌ {task.comments}</span> : null}</div>{task.due && <span className="inline-flex items-center gap-1"><CalendarClock size={11} />{task.due}</span>}</div>
                  </article>)}
                  <button type="button" onClick={() => createTask(column.id)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/8 py-2.5 text-xs text-[var(--muted)] hover:bg-white/[.025] hover:text-white"><Plus size={14} />{language === "ru" ? "Добавить карточку" : "Add card"}</button>
                </div>
              </section>
            ))}
            <button type="button" onClick={() => setColumnForm(true)} className="flex h-12 w-[280px] shrink-0 items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-white/[.015] text-xs text-[var(--muted)] hover:bg-white/[.03] hover:text-white"><Plus size={15} />{language === "ru" ? "Добавить колонку" : "Add list"}</button>
          </div>
        </div>

        {columnForm && <MiniModal title={language === "ru" ? "Новая колонка" : "New list"} onClose={() => setColumnForm(false)}>
          <input autoFocus value={columnName} onChange={event => setColumnName(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && columnName.trim()) { addColumn(currentBoard.id, columnName.trim()); setColumnName(""); setColumnForm(false); } }} placeholder={language === "ru" ? "Например, Тестирование" : "e.g. Review"} className="h-11 w-full rounded-xl border border-white/8 bg-white/[.025] px-3 text-sm text-white outline-none" />
          <button type="button" disabled={!columnName.trim()} onClick={() => { addColumn(currentBoard.id, columnName.trim()); setColumnName(""); setColumnForm(false); }} className="mt-3 w-full rounded-xl bg-[var(--accent)] py-2.5 text-xs font-semibold text-[#06211c] disabled:opacity-40">{language === "ru" ? "Добавить" : "Add"}</button>
        </MiniModal>}

        {renameColumnId && <MiniModal title={language === "ru" ? "Переименовать колонку" : "Rename list"} onClose={() => setRenameColumnId(null)}>
          <input autoFocus value={renameColumnValue} onChange={event => setRenameColumnValue(event.target.value)} onKeyDown={event => { if (event.key === "Enter") saveColumnRename(); }} className="h-11 w-full rounded-xl border border-white/8 bg-white/[.025] px-3 text-sm text-white outline-none" />
          <button type="button" onClick={saveColumnRename} className="mt-3 w-full rounded-xl bg-[var(--accent)] py-2.5 text-xs font-semibold text-[#06211c]">{language === "ru" ? "Сохранить" : "Save"}</button>
        </MiniModal>}

        {deleteColumnId && <MiniConfirm title={language === "ru" ? "Удалить колонку?" : "Delete list?"} description={language === "ru" ? "Все карточки в этой колонке будут удалены." : "All cards in this list will be removed."} confirm={language === "ru" ? "Удалить" : "Delete"} onClose={() => setDeleteColumnId(null)} onConfirm={deleteColumnConfirmed} />}

        {deleteBoardOpen && <MiniConfirm title={language === "ru" ? "Удалить доску?" : "Delete board?"} description={language === "ru" ? "Доску и её карточки нельзя будет восстановить." : "The board and its cards cannot be restored."} confirm={language === "ru" ? "Удалить" : "Delete"} onClose={() => setDeleteBoardOpen(false)} onConfirm={() => { setDeleteBoardOpen(false); routerReplaceBoards(); }} />}
        {activeTask && <TaskModal board={currentBoard} task={activeTask.task} language={language} onClose={() => setActiveTask(null)} onSave={patch => { updateTask(currentBoard.id, activeTask.task.id, patch); setActiveTask({ ...activeTask, task: { ...activeTask.task, ...patch } }); }} onDelete={() => { deleteTask(currentBoard.id, activeTask.task.id); setActiveTask(null); }} />}
        {toast && <div className="fixed bottom-5 left-1/2 z-[120] -translate-x-1/2 rounded-xl border border-white/10 bg-[var(--modal)] px-4 py-3 text-xs shadow-2xl">{toast}</div>}
      </div>
    </AppShell>
  );

}

function MiniModal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"><div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[var(--modal)] p-5 shadow-2xl"><div className="flex items-center justify-between"><h2 className="font-medium">{title}</h2><button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] hover:bg-white/5"><X size={15}/></button></div><div className="mt-4">{children}</div></div></div>;
}

function MiniConfirm({ title, description, confirm, onClose, onConfirm }: { title: string; description: string; confirm: string; onClose: () => void; onConfirm: () => void }) {
  return <div className="fixed inset-0 z-[110] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"><div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[var(--modal)] p-5 shadow-2xl"><h2 className="font-medium">{title}</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-xl border border-white/8 px-4 py-2.5 text-xs text-[var(--muted)]">{title.startsWith("Удалить") ? "Отмена" : "Cancel"}</button><button type="button" onClick={onConfirm} className="rounded-xl bg-[var(--danger)] px-4 py-2.5 text-xs font-semibold text-white">{confirm}</button></div></div></div>;
}

function TaskModal({ board, task, language, onClose, onSave, onDelete }: { board: Board; task: Task; language: "ru" | "en"; onClose: () => void; onSave: (patch: Partial<Task>) => void; onDelete: () => void }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState<Task["priority"]>(task.priority);
  const [due, setDue] = useState(task.due || "");
  const [label, setLabel] = useState(task.labels[0] || "");
  const [blocked, setBlocked] = useState(Boolean(task.blocked));

  return <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"><div className="mx-auto my-8 w-full max-w-2xl rounded-3xl border border-white/10 bg-[var(--modal)] shadow-2xl"><div className="flex items-center justify-between border-b border-white/8 px-5 py-4"><div className="text-xs text-[var(--muted)]">{board.title}</div><button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] hover:bg-white/5"><X size={15}/></button></div><div className="p-5"><input value={title} onChange={event => setTitle(event.target.value)} className="w-full bg-transparent text-2xl font-semibold tracking-[-.03em] outline-none"/><textarea value={description} onChange={event => setDescription(event.target.value)} placeholder={language === "ru" ? "Добавь описание" : "Add a description"} className="mt-4 min-h-28 w-full rounded-2xl border border-white/8 bg-white/[.025] p-3 text-sm leading-6 text-white outline-none"/><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-xs text-[var(--muted)]"><span>{language === "ru" ? "Приоритет" : "Priority"}</span><select value={priority} onChange={event => setPriority(event.target.value as Task["priority"])} className="h-10 rounded-xl border border-white/8 bg-[#0d1314] px-3 text-sm text-white outline-none"><option value="Low">{language === "ru" ? "Низкий" : "Low"}</option><option value="Medium">{language === "ru" ? "Средний" : "Medium"}</option><option value="High">{language === "ru" ? "Высокий" : "High"}</option></select></label><label className="grid gap-2 text-xs text-[var(--muted)]"><span>{language === "ru" ? "Срок" : "Due date"}</span><input type="date" value={due} onChange={event => setDue(event.target.value)} className="h-10 rounded-xl border border-white/8 bg-[#0d1314] px-3 text-sm text-white outline-none"/></label><label className="grid gap-2 text-xs text-[var(--muted)]"><span>{language === "ru" ? "Метка" : "Label"}</span><input value={label} onChange={event => setLabel(event.target.value)} className="h-10 rounded-xl border border-white/8 bg-[#0d1314] px-3 text-sm text-white outline-none"/></label></div><label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={blocked} onChange={event => setBlocked(event.target.checked)}/>{language === "ru" ? "Задача заблокирована" : "Task is blocked"}</label><div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-white/8 pt-4"><button type="button" onClick={onDelete} className="inline-flex items-center gap-2 rounded-xl border border-[rgba(255,113,113,.2)] px-3 py-2.5 text-xs text-[var(--danger)]"><Trash2 size={14}/>{language === "ru" ? "Удалить" : "Delete"}</button><div className="flex gap-2"><button type="button" onClick={onClose} className="rounded-xl border border-white/8 px-4 py-2.5 text-xs text-[var(--muted)]">{language === "ru" ? "Отмена" : "Cancel"}</button><button type="button" onClick={() => { onSave({ title: title.trim() || task.title, description: description.trim(), priority, due: due || undefined, labels: label.trim() ? [label.trim()] : [], blocked }); onClose(); }} className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-[#06211c]">{language === "ru" ? "Сохранить изменения" : "Save changes"}</button></div></div></div></div></div>;
}
