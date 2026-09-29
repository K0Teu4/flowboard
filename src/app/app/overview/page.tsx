"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, CalendarClock, CheckCircle2, CircleAlert, Clock3, LayoutDashboard, Plus, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { useLanguage } from "@/components/language-provider";
import { useWorkspace } from "@/lib/workspace-store";

export default function Overview() {
  const { copy } = useLanguage();
  const router = useRouter();
  const { state, createBoard } = useWorkspace();
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("Dmitry");
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const account = window.localStorage.getItem("flowboard-account");
    if (account !== "created") router.replace("/auth/sign-up");
    setName(window.localStorage.getItem("flowboard-user-name") || "Dmitry");
    setReady(true);
  }, [router]);

  const stats = useMemo(() => {
    const tasks = state.boards.flatMap(b => b.columns.flatMap(c => c.tasks));
    return {
      total: tasks.length,
      done: state.boards.reduce((sum,b)=>sum+(b.columns.find(c=>c.id==='done')?.tasks.length||0),0),
      blocked: tasks.filter(t=>t.blocked).length,
      due: tasks.filter(t=>t.due).length,
    };
  }, [state.boards]);

  const focus = state.boards.flatMap(b=>b.columns.flatMap(c=>c.tasks.map(t=>({ ...t, boardId:b.id, board:b.title, column:c.title })))).filter(t=>t.blocked || t.priority==='High' || t.due).slice(0,5);
  const progress = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;

  function submitBoard(){ const v=title.trim(); if(!v)return; const board=createBoard(v, "Новая рабочая доска Flowboard"); setTitle(""); setCreating(false); router.push(`/app/boards/${board.id}`); }

  if (!ready) return <div className="grid min-h-screen place-items-center text-sm text-[var(--muted)]">Загрузка workspace…</div>;

  return <AppShell><div className="mx-auto max-w-6xl p-4 sm:p-7"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/15 bg-[rgba(45,212,191,.04)] px-3 py-1.5 text-xs text-[var(--muted)]"><Sparkles size={13} className="text-[var(--accent)]"/> Project Pulse</div><h1 className="mt-3 text-3xl font-semibold tracking-[-.04em]">{copy.goodAfternoon}, {name}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">{copy.overviewCopy}</p></div><button onClick={()=>setCreating(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-[#06211c]"><Plus size={14}/>Создать доску</button></div>
  <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric icon={CheckCircle2} label="Завершено" value={`${stats.done}`} helper={`${stats.total} задач всего`}/><Metric icon={Clock3} label="С дедлайном" value={`${stats.due}`} helper="задач со сроком"/><Metric icon={CircleAlert} label="Блокеры" value={`${stats.blocked}`} helper={stats.blocked?"требуют внимания":"всё чисто"}/><Metric icon={BarChart3} label="Прогресс" value={`${progress}%`} helper="по всем доскам"/></div>
  <div className="mt-6 grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
    <section className="rounded-3xl border border-white/8 bg-white/[.025] p-5 sm:p-6"><div className="flex items-start justify-between gap-3"><div><div className="text-xs uppercase tracking-[.18em] text-[var(--muted)]">Рабочие пространства</div><h2 className="mt-1 text-lg font-semibold">Твои доски</h2></div><Link href="/app/boards" className="text-xs text-[var(--muted)] hover:text-white">Все доски →</Link></div><div className="mt-5 grid gap-2">{state.boards.slice(0,5).map(board=>{const total=board.columns.reduce((a,c)=>a+c.tasks.length,0),done=board.columns.find(c=>c.id==='done')?.tasks.length||0,p=total?Math.round(done/total*100):0;return <Link href={`/app/board?board=${board.id}`} key={board.id} className="rounded-2xl border border-white/7 bg-black/10 p-4 transition-soft hover:-translate-y-0.5 hover:border-[var(--accent)]/25"><div className="flex items-start justify-between gap-4"><div className="min-w-0"><div className="truncate font-medium">{board.title}</div><div className="mt-1 text-xs text-[var(--muted)]">{total} задач · {board.columns.length} колонок</div></div><ArrowRight size={15} className="text-[var(--muted)]"/></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/7"><div className="h-full rounded-full bg-[var(--accent)]" style={{width:`${p}%`}}/></div></Link>})}{!state.boards.length&&<div className="rounded-2xl border border-dashed border-white/10 p-8 text-center"><LayoutDashboard className="mx-auto text-[var(--muted)]"/><div className="mt-3 text-sm font-medium">Начни с первой доски</div><p className="mt-1 text-xs text-[var(--muted)]">Создай проект, добавь колонки и задачи.</p></div>}</div></section>
    <section className="rounded-3xl border border-white/8 bg-white/[.025] p-5 sm:p-6"><div className="flex items-center justify-between"><div><div className="text-xs uppercase tracking-[.18em] text-[var(--muted)]">Фокус</div><h2 className="mt-1 text-lg font-semibold">Что требует внимания</h2></div><CalendarClock size={18} className="text-[var(--accent)]"/></div><div className="mt-5 grid gap-2">{focus.length?focus.map(t=><Link key={`${t.boardId}-${t.id}`} href={`/app/boards/${t.boardId}`} className="rounded-2xl border border-white/7 bg-black/10 p-3 hover:border-[var(--accent)]/20"><div className="text-sm font-medium">{t.title}</div><div className="mt-1 flex flex-wrap gap-2 text-[10px] text-[var(--muted)]"><span>{t.board}</span><span>{t.priority}</span>{t.due&&<span>срок: {t.due}</span>}{t.blocked&&<span className="text-[var(--danger)]">заблокировано</span>}</div></Link>):<div className="py-10 text-center text-xs text-[var(--muted)]">Фокус чист. Добавь сроки или приоритеты, чтобы задачи появились здесь.</div>}</div></section>
  </div>
  <section className="mt-4 rounded-3xl border border-white/8 bg-gradient-to-br from-[rgba(45,212,191,.06)] to-white/[.02] p-5 sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-xs uppercase tracking-[.18em] text-[var(--muted)]">Путь проекта</div><h2 className="mt-1 text-lg font-semibold">Backlog → Work → Review → Done</h2><p className="mt-1 text-xs leading-5 text-[var(--muted)]">Flowboard считает состояние по задачам, а не по вручную выставленному проценту.</p></div><Link href="/app/boards" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/[.025] px-4 py-2.5 text-xs text-[var(--muted)] hover:text-white"><Search size={14}/>Открыть доски</Link></div></section>
  {creating&&<div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111819] p-5 shadow-2xl"><h2 className="text-lg font-semibold">Новая доска</h2><p className="mt-1 text-xs text-[var(--muted)]">Будут созданы базовые Kanban-колонки.</p><input autoFocus value={title} onChange={e=>setTitle(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submitBoard()} className="mt-4 h-11 w-full rounded-xl border border-white/8 bg-black/10 px-3 text-sm outline-none" placeholder="Название проекта"/><div className="mt-3 flex justify-end gap-2"><button onClick={()=>setCreating(false)} className="rounded-xl border border-white/8 px-4 py-2.5 text-xs text-[var(--muted)]">Отмена</button><button onClick={submitBoard} className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-[#06211c]">Создать</button></div></div></div>}
  </div></AppShell>;
}
function Metric({icon:Icon,label,value,helper}:{icon:typeof CheckCircle2;label:string;value:string;helper:string}){return <div className="rounded-2xl border border-white/8 bg-white/[.025] p-4"><div className="flex items-center justify-between"><div className="text-xs text-[var(--muted)]">{label}</div><Icon size={15} className="text-[var(--accent)]"/></div><div className="mt-3 text-2xl font-semibold">{value}</div><div className="mt-1 text-[10px] text-[var(--muted)]">{helper}</div></div>}
