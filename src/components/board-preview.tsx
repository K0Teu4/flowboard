"use client";

import { useEffect, useState } from "react";
import { CalendarClock, CheckSquare2, MessageCircle, MoreHorizontal, Paperclip, Plus, ShieldAlert } from "lucide-react";
import { boardColumns, type Task } from "@/lib/mock-data";
import { useLanguage } from "@/components/language-provider";

const priorityClass: Record<Task["priority"], string> = {
  Low: "bg-white/6 text-[var(--muted)]",
  Medium: "bg-[rgba(242,191,105,.11)] text-[var(--warning)]",
  High: "bg-[rgba(255,113,113,.11)] text-[var(--danger)]",
};

export function BoardPreview({ externalQuery = "", addSignal = 0, filterMode = "all" }: { externalQuery?: string; addSignal?: number; filterMode?: "all" | "high" | "due" | "blocked" }) {
  const { language } = useLanguage();
  const [columns, setColumns] = useState(boardColumns);
  const [dragged, setDragged] = useState<{ taskId: string; from: string } | null>(null);
  const [query, setQuery] = useState(externalQuery);
  const [openTask, setOpenTask] = useState<Task | null>(null);
  const [openColumn, setOpenColumn] = useState<string | null>(null);
  const [lastAddSignal, setLastAddSignal] = useState(addSignal);\n  const [renameColumn, setRenameColumn] = useState<{id:string;title:string}|null>(null);\n  const [renameValue, setRenameValue] = useState("");\n  const [clearColumn, setClearColumn] = useState<string|null>(null);
  const columnTitles = language === "ru" ? { backlog: "Бэклог", progress: "В работе", review: "Проверка", done: "Готово" } : { backlog: "Backlog", progress: "In Progress", review: "Review", done: "Done" };
  const priorityTitles = language === "ru" ? { Low: "Низкий", Medium: "Средний", High: "Высокий" } : { Low: "Low", Medium: "Medium", High: "High" };

  useEffect(() => setQuery(externalQuery), [externalQuery]);
  useEffect(() => {
    if (addSignal === lastAddSignal) return;
    setLastAddSignal(addSignal);
    setColumns(cols => cols.map((column, index) => index === 0 ? { ...column, tasks: [...column.tasks, { id: `demo-${Date.now()}`, title: language === "ru" ? "Новая карточка" : "New card", priority: "Medium", labels: [language === "ru" ? "Работа" : "Work"] }] } : column));
  }, [addSignal, lastAddSignal, language]);

  function move(toColumn: string) {
    if (!dragged || dragged.from === toColumn) return;
    let moving: Task | undefined;
    const next = columns.map((column) => ({ ...column, tasks: column.tasks.filter((task) => { if (column.id === dragged.from && task.id === dragged.taskId) { moving = task; return false; } return true; }) }));
    if (!moving) return;
    setColumns(next.map((column) => column.id === toColumn ? { ...column, tasks: [...column.tasks, moving!] } : column));
    setDragged(null);
  }

  function addToColumn(columnId: string) {
    const title = language === "ru" ? "Новая карточка" : "New card";
    setColumns(cols => cols.map(column => column.id === columnId ? { ...column, tasks: [...column.tasks, { id: `demo-${Date.now()}-${columnId}`, title, priority: "Medium", labels: [language === "ru" ? "Работа" : "Work"] }] } : column));
  }

  return <div className="mt-5 overflow-x-auto pb-1 scrollbar-thin">
    <div className="grid min-w-[980px] grid-cols-4 gap-3">
      {columns.map(column => <section key={column.id} onDragOver={event => event.preventDefault()} onDrop={() => move(column.id)} className="min-h-[420px] rounded-2xl bg-white/[.025] p-2.5">
        <div className="relative flex items-center justify-between px-1 pb-2">
          <div className="flex items-center gap-2"><span className="text-xs font-medium">{columnTitles[column.id as keyof typeof columnTitles]}</span><span className="grid h-5 min-w-5 place-items-center rounded-md bg-white/5 px-1 text-[10px] text-[var(--muted)]">{column.tasks.length}</span></div>
          <button onClick={() => setOpenColumn(openColumn === column.id ? null : column.id)} aria-label={language === "ru" ? `Меню ${column.title}` : `Menu ${column.title}`} className="grid h-7 w-7 place-items-center rounded-lg text-[var(--muted)] hover:bg-white/5"><MoreHorizontal size={15}/></button>
          {openColumn === column.id && <div className="absolute right-0 top-8 z-20 w-44 rounded-xl border border-white/10 bg-[#111819] p-1.5 shadow-xl"><button onClick={()=>addToColumn(column.id)} className="w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-white/5">{language === "ru" ? "Добавить карточку" : "Add card"}</button><button onClick={()=>{setRenameColumn({id:column.id,title:column.title});setRenameValue(column.title);setOpenColumn(null)}} className="w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-white/5">{language === "ru" ? "Переименовать" : "Rename"}</button><button onClick={()=>{setClearColumn(column.id);setOpenColumn(null)}} className="w-full rounded-lg px-3 py-2 text-left text-xs text-[var(--danger)] hover:bg-[rgba(255,113,113,.07)]">{language === "ru" ? "Очистить колонку" : "Clear column"}</button></div>}
        </div>
        <div className="space-y-2">
          {column.tasks.filter(task => { const text = `${task.title} ${task.labels.join(" ")}`.toLowerCase(); const matchesQuery = text.includes(query.toLowerCase()); const matchesFilter = filterMode === "all" || (filterMode === "high" && task.priority === "High") || (filterMode === "due" && !!task.due) || (filterMode === "blocked" && !!task.blocked); return matchesQuery && matchesFilter; }).map(task => <article key={task.id} draggable onDragStart={() => setDragged({taskId:task.id,from:column.id})} onClick={() => setOpenTask(task)} className="card transition-soft cursor-grab rounded-xl p-3 active:cursor-grabbing"><div className="flex items-start justify-between gap-2"><span className={`rounded-md px-1.5 py-1 text-[9px] font-medium ${priorityClass[task.priority]}`}>{priorityTitles[task.priority]}</span>{task.blocked&&<ShieldAlert size={14} className="text-[var(--danger)]"/>}</div><div className="mt-2 text-sm font-medium leading-5">{task.title}</div><div className="mt-2.5 flex flex-wrap gap-1.5">{task.labels.map(label=><span key={label} className="rounded-md border border-white/8 bg-white/[.025] px-1.5 py-1 text-[9px] text-[var(--muted)]">{label}</span>)}</div><div className="mt-3 flex items-center justify-between gap-2 text-[10px] text-[var(--muted)]"><div className="flex items-center gap-2.5">{task.checklist&&<span className="flex items-center gap-1"><CheckSquare2 size={12}/>{task.checklist}</span>}{task.comments?<span className="flex items-center gap-1"><MessageCircle size={12}/>{task.comments}</span>:null}{task.attachments?<span className="flex items-center gap-1"><Paperclip size={12}/>{task.attachments}</span>:null}</div>{task.due&&<span className="flex items-center gap-1"><CalendarClock size={12}/>{task.due}</span>}</div></article>)}
          <button onClick={() => addToColumn(column.id)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/8 py-2.5 text-xs text-[var(--muted)] hover:bg-white/[.025] hover:text-white"><Plus size={14}/>{language === "ru" ? "Добавить карточку" : "Add card"}</button>
        </div>
      </section>)}
    </div>
    {openTask&&<div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={()=>setOpenTask(null)}><div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#111819] p-5 shadow-2xl" onClick={event=>event.stopPropagation()}><div className="flex items-center justify-between"><div className="text-xs text-[var(--muted)]">{language === "ru" ? "Карточка" : "Card"}</div><button onClick={()=>setOpenTask(null)} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/5">×</button></div><h3 className="mt-3 text-xl font-semibold">{openTask.title}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{openTask.description || (language === "ru" ? "В рабочей доске карточку можно редактировать, назначить срок, приоритет и чек-лист." : "In a workspace board you can edit this card, assign a deadline, priority and checklist.")}</p><div className="mt-5 flex flex-wrap gap-2">{openTask.labels.map(label=><span key={label} className="rounded-lg bg-white/5 px-2 py-1 text-[10px] text-[var(--muted)]">{label}</span>)}<span className="rounded-lg bg-white/5 px-2 py-1 text-[10px] text-[var(--muted)]">{priorityTitles[openTask.priority]}</span></div><button onClick={()=>setOpenTask(null)} className="mt-5 w-full rounded-xl bg-[var(--accent)] py-2.5 text-xs font-semibold text-[#06211c]">{language === "ru" ? "Закрыть" : "Close"}</button></div></div>}
    {renameColumn&&<div className="fixed inset-0 z-[80] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"><div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#111819] p-5 shadow-2xl"><div className="flex items-center justify-between gap-3"><h3 className="font-medium">{language === "ru" ? "Переименовать колонку" : "Rename list"}</h3><button type="button" onClick={()=>setRenameColumn(null)} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] hover:bg-white/5"><X size={15}/></button></div><input autoFocus value={renameValue} onChange={e=>setRenameValue(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){const v=renameValue.trim();if(v){setColumns(cols=>cols.map(col=>col.id===renameColumn.id?{...col,title:v}:col));setRenameColumn(null)}}}} className="mt-4 h-11 w-full rounded-xl border border-white/8 bg-white/[.025] px-3 text-sm text-white outline-none"/><div className="mt-3 flex justify-end gap-2"><button type="button" onClick={()=>setRenameColumn(null)} className="rounded-xl border border-white/8 px-4 py-2.5 text-xs text-[var(--muted)]">{language === "ru" ? "Отмена" : "Cancel"}</button><button type="button" onClick={()=>{const v=renameValue.trim();if(v){setColumns(cols=>cols.map(col=>col.id===renameColumn.id?{...col,title:v}:col));setRenameColumn(null)}}} className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-[#06211c]">{language === "ru" ? "Сохранить" : "Save"}</button></div></div></div>}
    {clearColumn&&<div className="fixed inset-0 z-[80] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"><div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#111819] p-5 shadow-2xl"><h3 className="font-medium">{language === "ru" ? "Очистить колонку?" : "Clear list?"}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{language === "ru" ? "Все карточки этой колонки будут удалены из demo-сессии." : "All cards in this list will be removed from the demo session."}</p><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={()=>setClearColumn(null)} className="rounded-xl border border-white/8 px-4 py-2.5 text-xs text-[var(--muted)]">{language === "ru" ? "Отмена" : "Cancel"}</button><button type="button" onClick={()=>{setColumns(cols=>cols.map(col=>col.id===clearColumn?{...col,tasks:[]}:col));setClearColumn(null)}} className="rounded-xl bg-[var(--danger)] px-4 py-2.5 text-xs font-semibold text-white">{language === "ru" ? "Очистить" : "Clear"}</button></div></div></div>}
  </div>;
}
