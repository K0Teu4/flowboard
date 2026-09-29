"use client";

import Link from "next/link";
import { CalendarClock, Check, CheckSquare2, Edit3, Filter, MoreHorizontal, Paperclip, Plus, Search, ShieldAlert, Star, Trash2, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { useLanguage } from "@/components/language-provider";
import { useWorkspace, type Board } from "@/lib/workspace-store";
import type { Task } from "@/lib/mock-data";

const backgrounds: Record<string, string> = {
  mint: "radial-gradient(circle at 15% 15%, rgba(45,212,191,.20), transparent 28rem), linear-gradient(135deg,#0b1414,#0a0f10 52%,#0b1013)",
  blue: "radial-gradient(circle at 85% 12%, rgba(88,142,255,.20), transparent 28rem), linear-gradient(135deg,#0b111b,#0a0f10 52%,#0b1013)",
  amber: "radial-gradient(circle at 18% 10%, rgba(242,191,105,.17), transparent 28rem), linear-gradient(135deg,#16120d,#0a0f10 52%,#0b1013)",
  graphite: "linear-gradient(135deg,#15191d,#0a0f10 62%,#0b1013)",
};

export default function BoardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const boardId = searchParams.get("board") || "";
  const { language } = useLanguage();
  const {
    state,
    addColumn,
    renameBoard,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    renameColumn,
    deleteColumn,
    duplicateBoard,
    toggleFavorite,
    setBackground,
    deleteBoard,
    addComment,
    addChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem,
  } = useWorkspace();

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
  const [deleteBoardOpen, setDeleteBoardOpen] = useState(false);
  const [boardMenuOpen, setBoardMenuOpen] = useState(false);
  const [backgroundOpen, setBackgroundOpen] = useState(false);
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
    addTask(currentBoard.id, columnId, {
      title: language === "ru" ? "Новая задача" : "New task",
      labels: [language === "ru" ? "Работа" : "Work"],
      priority: "Medium",
    });
    setToast(language === "ru" ? "Карточка добавлена" : "Card added");
  }

  function saveColumnRename() {
    const clean = renameColumnValue.trim();
    if (!renameColumnId || !clean) return;
    renameColumn(currentBoard.id, renameColumnId, clean);
    setRenameColumnId(null);
    setRenameColumnValue("");
  }

  function copyLink() {
    const fallback = language === "ru" ? "Ссылка скопирована" : "Link copied";
    navigator.clipboard?.writeText(window.location.href).then(() => setToast(fallback)).catch(() => setToast(language === "ru" ? "Не удалось скопировать ссылку" : "Could not copy link"));
  }

  function duplicate() {
    const clone = duplicateBoard(currentBoard.id);
    if (!clone) return;
    setBoardMenuOpen(false);
    setToast(language === "ru" ? "Доска продублирована" : "Board duplicated");
    router.push(`/app/board?board=${clone.id}`);
  }

  return (
    <AppShell>
      <div className="min-h-full" style={{ background: backgrounds[currentBoard.background || "mint"] }}>
        <div className="border-b border-white/8 bg-black/10 backdrop-blur-sm px-4 py-5 sm:px-7">
          <div className="mx-auto max-w-[1500px]">
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/app/boards" className="text-xs text-[var(--muted)] hover:text-white">{language === "ru" ? "Доски" : "Boards"}</Link>
              <span className="text-white/15">/</span>
              {editingBoard ? (
                <input autoFocus value={boardName} onChange={event => setBoardName(event.target.value)} onKeyDown={event => {
                  if (event.key === "Enter") { renameBoard(currentBoard.id, boardName); setEditingBoard(false); }
                  if (event.key === "Escape") setEditingBoard(false);
                }} onBlur={() => { if (boardName.trim()) renameBoard(currentBoard.id, boardName); setEditingBoard(false); }} className="h-9 rounded-xl border border-white/10 bg-white/[.03] px-3 text-lg font-semibold outline-none" />
              ) : <h1 className="text-xl font-semibold">{currentBoard.title}</h1>}
              <button type="button" title={language === "ru" ? "Переименовать" : "Rename"} onClick={() => { setBoardName(currentBoard.title); setEditingBoard(true); }} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] hover:bg-white/5 hover:text-white"><Edit3 size={14} /></button>
              <button type="button" title={language === "ru" ? "Избранное" : "Favorite"} aria-pressed={Boolean(currentBoard.favorite)} onClick={() => toggleFavorite(currentBoard.id)} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] hover:bg-white/5 hover:text-white">
                <Star size={14} fill={currentBoard.favorite ? "currentColor" : "none"} className={currentBoard.favorite ? "text-[var(--warning)]" : ""} />
              </button>

              <div className="relative">
                <button type="button" onClick={() => setBoardMenuOpen(value => !value)} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] hover:bg-white/5 hover:text-white" aria-label={language === "ru" ? "Меню доски" : "Board menu"}><MoreHorizontal size={16} /></button>
                {boardMenuOpen && <div className="absolute left-0 top-10 z-40 w-60 rounded-2xl border border-white/10 bg-[var(--modal)] p-2 shadow-2xl">
                  <button type="button" onClick={duplicate} className="w-full rounded-xl px-3 py-2.5 text-left text-xs text-[var(--muted)] hover:bg-white/5 hover:text-white">{language === "ru" ? "Дублировать доску" : "Duplicate board"}</button>
                  <button type="button" onClick={() => setBackgroundOpen(value => !value)} className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs text-[var(--muted)] hover:bg-white/5 hover:text-white"><span>{language === "ru" ? "Фон доски" : "Board background"}</span><span className="text-[10px]">›</span></button>
                  {backgroundOpen && <div className="grid grid-cols-4 gap-1.5 px-2 pb-2">
                    {Object.entries(backgrounds).map(([key]) => <button type="button" key={key} title={key} onClick={() => { setBackground(currentBoard.id, key); setBoardMenuOpen(false); setBackgroundOpen(false); setToast(language === "ru" ? "Фон изменён" : "Background updated"); }} className="h-8 rounded-lg border border-white/10" style={{ background: backgrounds[key] }} />)}
                  </div>}
                  <button type="button" onClick={() => setDeleteBoardOpen(true)} className="w-full rounded-xl px-3 py-2.5 text-left text-xs text-[var(--danger)] hover:bg-[rgba(255,113,113,.07)]">{language === "ru" ? "Удалить доску" : "Delete board"}</button>
                </div>}
              </div>

              <div className="ml-auto flex flex-wrap items-center gap-2">
                <div className="hidden items-center rounded-xl border border-white/8 bg-white/[.025] p-1 sm:flex">
                  <span className="rounded-lg bg-white/8 px-3 py-1.5 text-xs text-white">{language === "ru" ? "Доска" : "Board"}</span>
                  <Link href="/app/calendar" className="rounded-lg px-3 py-1.5 text-xs text-[var(--muted)] hover:text-white">{language === "ru" ? "Календарь" : "Calendar"}</Link>
                </div>
                <div className="relative">
                  <button type="button" onClick={() => setFilterOpen(value => !value)} className="grid h-10 w-10 place-items-center rounded-xl border border-white/8 bg-white/[.025] text-[var(--muted)] hover:text-white" aria-label={language === "ru" ? "Фильтры" : "Filters"}><Filter size={15} /></button>
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

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--muted)]">
              <span>{total} {language === "ru" ? "задач" : "cards"}</span>
              <span>{done} {language === "ru" ? "готово" : "done"}</span>
              <span className="font-semibold text-white">{progress}%</span>
              <div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/7"><div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${progress}%` }} /></div>
              <span>{language === "ru" ? "Изменения сохраняются автоматически" : "Changes save automatically"}</span>
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
              }} className="w-[280px] shrink-0 rounded-2xl border border-white/7 bg-black/10 p-2.5 backdrop-blur-sm">
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

        {deleteColumnId && <MiniConfirm title={language === "ru" ? "Удалить колонку?" : "Delete list?"} description={language === "ru" ? "Все карточки в этой колонке будут удалены." : "All cards in this list will be removed."} confirm={language === "ru" ? "Удалить" : "Delete"} cancel={language === "ru" ? "Отмена" : "Cancel"} onClose={() => setDeleteColumnId(null)} onConfirm={() => { deleteColumn(currentBoard.id, deleteColumnId); setDeleteColumnId(null); setToast(language === "ru" ? "Колонка удалена" : "List deleted"); }} />}
        {deleteBoardOpen && <MiniConfirm title={language === "ru" ? "Удалить доску?" : "Delete board?"} description={language === "ru" ? "Доска и её карточки будут удалены из этого браузера." : "The board and its cards will be removed from this browser."} confirm={language === "ru" ? "Удалить" : "Delete"} cancel={language === "ru" ? "Отмена" : "Cancel"} onClose={() => setDeleteBoardOpen(false)} onConfirm={() => { deleteBoard(currentBoard.id); setDeleteBoardOpen(false); router.push("/app/boards"); }} />}
        {activeTask && <TaskModal
          board={currentBoard}
          task={activeTask.task}
          members={state.members}
          language={language}
          onClose={() => setActiveTask(null)}
          onSave={patch => { updateTask(currentBoard.id, activeTask.task.id, patch); setActiveTask({ ...activeTask, task: { ...activeTask.task, ...patch } }); }}
          onDelete={() => { deleteTask(currentBoard.id, activeTask.task.id); setActiveTask(null); }}
          onComment={body => addComment(currentBoard.id, activeTask.task.id, body)}
          onAddChecklist={text => addChecklistItem(currentBoard.id, activeTask.task.id, text)}
          onToggleChecklist={itemId => toggleChecklistItem(currentBoard.id, activeTask.task.id, itemId)}
          onDeleteChecklist={itemId => deleteChecklistItem(currentBoard.id, activeTask.task.id, itemId)}
        />}
        {toast && <div className="fixed bottom-5 left-1/2 z-[120] -translate-x-1/2 rounded-xl border border-white/10 bg-[var(--modal)] px-4 py-3 text-xs shadow-2xl">{toast}</div>}
      </div>
    </AppShell>
  );
}

function MiniModal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
    <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[var(--modal)] p-5 shadow-2xl">
      <div className="flex items-center justify-between gap-4"><h2 className="font-medium">{title}</h2><button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] hover:bg-white/5"><X size={15}/></button></div>
      <div className="mt-4">{children}</div>
    </div>
  </div>;
}

function MiniConfirm({ title, description, confirm, cancel, onClose, onConfirm }: { title: string; description: string; confirm: string; cancel: string; onClose: () => void; onConfirm: () => void }) {
  return <div className="fixed inset-0 z-[110] grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
    <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[var(--modal)] p-5 shadow-2xl">
      <h2 className="font-medium">{title}</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
      <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-xl border border-white/8 px-4 py-2.5 text-xs text-[var(--muted)]">{cancel}</button><button type="button" onClick={onConfirm} className="rounded-xl bg-[var(--danger)] px-4 py-2.5 text-xs font-semibold text-white">{confirm}</button></div>
    </div>
  </div>;
}

function TaskModal({
  board, task, members, language, onClose, onSave, onDelete, onComment, onAddChecklist, onToggleChecklist, onDeleteChecklist
}: {
  board: Board;
  task: Task;
  members: { name: string; initials: string; status: string; role: string }[];
  language: "ru" | "en";
  onClose: () => void;
  onSave: (patch: Partial<Task>) => void;
  onDelete: () => void;
  onComment: (body: string) => void;
  onAddChecklist: (text: string) => void;
  onToggleChecklist: (itemId: string) => void;
  onDeleteChecklist: (itemId: string) => void;
}) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState<Task["priority"]>(task.priority);
  const [due, setDue] = useState(task.due || "");
  const [label, setLabel] = useState(task.labels[0] || "");
  const [assignee, setAssignee] = useState(task.assignee || "");
  const [blocked, setBlocked] = useState(Boolean(task.blocked));
  const [comment, setComment] = useState("");
  const [checkText, setCheckText] = useState("");
  const [items, setItems] = useState(task.checklistItems || []);
  const [comments, setComments] = useState(task.commentItems || []);

  function addCheck() {
    const clean = checkText.trim();
    if (!clean) return;
    onAddChecklist(clean);
    const item = { id: crypto.randomUUID(), text: clean, done: false };
    setItems(prev => [...prev, item]);
    setCheckText("");
  }

  function toggleCheck(itemId: string) {
    onToggleChecklist(itemId);
    setItems(prev => prev.map(item => item.id === itemId ? { ...item, done: !item.done } : item));
  }

  function removeCheck(itemId: string) {
    onDeleteChecklist(itemId);
    setItems(prev => prev.filter(item => item.id !== itemId));
  }

  function submitComment() {
    const body = comment.trim();
    if (!body) return;
    onComment(body);
    const author = "Dmitry";
    setComments(prev => [...prev, { id: crypto.randomUUID(), author, body, createdAt: new Date().toISOString() }]);
    setComment("");
  }

  return <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
    <div className="mx-auto my-8 w-full max-w-3xl rounded-3xl border border-white/10 bg-[var(--modal)] shadow-2xl">
      <div className="flex items-center justify-between gap-4 border-b border-white/8 px-5 py-4"><div className="text-xs text-[var(--muted)]">{board.title}</div><button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] hover:bg-white/5"><X size={15}/></button></div>
      <div className="p-5">
        <input value={title} onChange={event => setTitle(event.target.value)} className="w-full bg-transparent text-2xl font-semibold tracking-[-.03em] outline-none" />
        <textarea value={description} onChange={event => setDescription(event.target.value)} placeholder={language === "ru" ? "Добавь описание" : "Add a description"} className="mt-4 min-h-28 w-full rounded-2xl border border-white/8 bg-white/[.025] p-3 text-sm leading-6 text-white outline-none" />

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label={language === "ru" ? "Приоритет" : "Priority"}><select value={priority} onChange={event => setPriority(event.target.value as Task["priority"])} className="field-input"><option value="Low">{language === "ru" ? "Низкий" : "Low"}</option><option value="Medium">{language === "ru" ? "Средний" : "Medium"}</option><option value="High">{language === "ru" ? "Высокий" : "High"}</option></select></Field>
          <Field label={language === "ru" ? "Срок" : "Due date"}><input type="date" value={due} onChange={event => setDue(event.target.value)} className="field-input" /></Field>
          <Field label={language === "ru" ? "Метка" : "Label"}><input value={label} onChange={event => setLabel(event.target.value)} className="field-input" placeholder={language === "ru" ? "Например, UX" : "e.g. UX"} /></Field>
          <Field label={language === "ru" ? "Участник" : "Member"}><select value={assignee} onChange={event => setAssignee(event.target.value)} className="field-input"><option value="">{language === "ru" ? "Не назначен" : "Unassigned"}</option>{members.map(member => <option key={member.initials} value={member.initials}>{member.name} · {member.initials}</option>)}</select></Field>
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={blocked} onChange={event => setBlocked(event.target.checked)} />{language === "ru" ? "Задача заблокирована" : "Task is blocked"}</label>

        <section className="mt-6 rounded-2xl border border-white/8 bg-white/[.02] p-4">
          <div className="flex items-center gap-2 text-sm font-medium"><CheckSquare2 size={16} className="text-[var(--accent)]" />{language === "ru" ? "Чек-лист" : "Checklist"}{items.length > 0 && <span className="text-xs text-[var(--muted)]">{items.filter(item => item.done).length}/{items.length}</span>}</div>
          <div className="mt-3 grid gap-2">{items.map(item => <div key={item.id} className="flex items-center gap-2 rounded-xl bg-black/10 p-2"><button type="button" onClick={() => toggleCheck(item.id)} className="grid h-6 w-6 place-items-center rounded-md border border-white/10">{item.done && <Check size={13} className="text-[var(--accent)]" />}</button><span className={item.done ? "flex-1 text-sm text-[var(--muted)] line-through" : "flex-1 text-sm"}>{item.text}</span><button type="button" onClick={() => removeCheck(item.id)} className="text-[var(--muted)] hover:text-[var(--danger)]"><X size={13}/></button></div>)}</div>
          <div className="mt-3 flex gap-2"><input value={checkText} onChange={event => setCheckText(event.target.value)} onKeyDown={event => { if (event.key === "Enter") addCheck(); }} placeholder={language === "ru" ? "Добавить пункт" : "Add checklist item"} className="field-input flex-1" /><button type="button" onClick={addCheck} disabled={!checkText.trim()} className="rounded-xl bg-white/7 px-3 text-xs font-medium text-white disabled:opacity-40"><Plus size={14}/></button></div>
        </section>

        <section className="mt-4 rounded-2xl border border-white/8 bg-white/[.02] p-4">
          <div className="flex items-center gap-2 text-sm font-medium"><Users size={16} className="text-[var(--accent)]" />{language === "ru" ? "Комментарии" : "Comments"}<span className="text-xs text-[var(--muted)]">{comments.length}</span></div>
          <div className="mt-3 grid gap-2">{comments.map(item => <div key={item.id} className="rounded-xl bg-black/10 p-3"><div className="flex items-center justify-between gap-3"><span className="text-xs font-medium">{item.author}</span><span className="text-[10px] text-[var(--muted)]">{new Date(item.createdAt).toLocaleString(language === "ru" ? "ru-RU" : "en-US", { month: "short", day: "numeric" })}</span></div><p className="mt-1 text-sm leading-5 text-[var(--muted)]">{item.body}</p></div>)}</div>
          <div className="mt-3 flex gap-2"><input value={comment} onChange={event => setComment(event.target.value)} onKeyDown={event => { if (event.key === "Enter") submitComment(); }} placeholder={language === "ru" ? "Напиши комментарий" : "Write a comment"} className="field-input flex-1" /><button type="button" onClick={submitComment} disabled={!comment.trim()} className="rounded-xl bg-white/7 px-3 text-xs font-medium text-white disabled:opacity-40">→</button></div>
        </section>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-white/8 pt-4">
          <button type="button" onClick={onDelete} className="inline-flex items-center gap-2 rounded-xl border border-[rgba(255,113,113,.2)] px-3 py-2.5 text-xs text-[var(--danger)]"><Trash2 size={14}/>{language === "ru" ? "Удалить" : "Delete"}</button>
          <div className="flex gap-2"><button type="button" onClick={onClose} className="rounded-xl border border-white/8 px-4 py-2.5 text-xs text-[var(--muted)]">{language === "ru" ? "Отмена" : "Cancel"}</button><button type="button" onClick={() => { onSave({ title: title.trim() || task.title, description: description.trim(), priority, due: due || undefined, labels: label.trim() ? [label.trim()] : [], assignee: assignee || undefined, blocked, checklistItems: items, checklist: items.length ? `${items.filter(item => item.done).length}/${items.length}` : undefined, commentItems: comments, comments: comments.length }); onClose(); }} className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-[#06211c]">{language === "ru" ? "Сохранить изменения" : "Save changes"}</button></div>
        </div>
      </div>
    </div>
  </div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-2 text-xs text-[var(--muted)]"><span>{label}</span>{children}</label>;
}