"use client";

import Link from "next/link";
import { ArrowUpRight, Bell, CalendarDays, CheckCircle2, CircleAlert, Clock3, LayoutDashboard, Plus, Search, Settings2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { boardColumns } from "@/lib/mock-data";

const sampleBoards = [
  { title: "Website redesign", progress: 78, status: "On track", tasks: 17 },
  { title: "Flowboard launch", progress: 46, status: "In progress", tasks: 13 },
  { title: "Content system", progress: 31, status: "Needs focus", tasks: 8 },
];

type MetricProps = { icon: typeof CheckCircle2; label: string; value: string; helper: string };
type LocalBoard = { title: string; progress: number };

export default function Overview() {
  const { copy } = useLanguage();
  const [registered, setRegistered] = useState(false);
  const [name, setName] = useState("Dmitry");
  const [boards, setBoards] = useState<LocalBoard[]>([]);
  const [creatingBoard, setCreatingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  useEffect(() => {
    setRegistered(window.localStorage.getItem("flowboard-account") === "created");
    setName(window.localStorage.getItem("flowboard-user-name") || "Dmitry");
    const storedBoards = window.localStorage.getItem("flowboard-boards");
    if (storedBoards) {
      try {
        setBoards(JSON.parse(storedBoards) as LocalBoard[]);
      } catch {
        setBoards([]);
      }
    }
  }, []);

  const total = boardColumns.reduce((acc, column) => acc + column.tasks.length, 0);

  function createBoard() {
    const title = newBoardName.trim();
    if (!title) return;
    const next = [...boards, { title, progress: 0 }];
    setBoards(next);
    window.localStorage.setItem("flowboard-boards", JSON.stringify(next));
    setNewBoardName("");
    setCreatingBoard(false);
  }

  return (
    <div className="shell min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/8 bg-[rgba(10,15,16,.84)] backdrop-blur-xl">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-5">
          <Brand />
          <div className="hidden h-7 w-px bg-white/8 md:block" />
          <button type="button" className="hidden items-center gap-2 rounded-xl border border-white/8 bg-white/[.025] px-3 py-2 text-left md:flex"><span className="grid h-6 w-6 place-items-center rounded-lg bg-[var(--accent)] text-[10px] font-bold text-[#06211c]">N</span><span className="text-xs font-medium">{copy.appWorkspace}</span><span className="text-[10px] text-[var(--muted)]">⌄</span></button>
          <div className="ml-auto flex items-center gap-1.5">
            <button aria-label={copy.search} type="button" className="hidden h-9 items-center gap-2 rounded-xl border border-white/8 bg-white/[.025] px-3 text-xs text-[var(--muted)] lg:flex"><Search size={14} /> {copy.search}</button>
            <LanguageSwitcher compact />
            <button aria-label={copy.notifications} type="button" className="grid h-9 w-9 place-items-center rounded-xl text-[var(--muted)] hover:bg-white/5 hover:text-white"><Bell size={16} /></button>
            <button aria-label={copy.account} type="button" className="grid h-9 w-9 place-items-center rounded-full bg-[var(--accent)] text-xs font-bold text-[#06211c]">{name.slice(0, 2).toUpperCase()}</button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className="hidden w-60 shrink-0 border-r border-white/8 bg-black/5 p-4 lg:block">
          <div className="text-[11px] uppercase tracking-[.18em] text-[var(--muted)]">{copy.appWorkspace}</div>
          <nav className="mt-3 grid gap-1 text-sm">
            <div className="flex items-center gap-2 rounded-xl bg-[rgba(45,212,191,.09)] px-3 py-2.5 font-medium"><LayoutDashboard size={16} className="text-[var(--accent)]" /> {copy.overview}</div>
            <Link href="/demo" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[var(--muted)] hover:bg-white/[.035] hover:text-white">{copy.boards}</Link>
            <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[var(--muted)]"><CalendarDays size={16} /> {copy.calendar}</div>
            <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[var(--muted)]"><Users size={16} /> {copy.members}</div>
            <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[var(--muted)]"><Settings2 size={16} /> {copy.settings}</div>
          </nav>
          <div className="mt-8 rounded-2xl border border-[var(--accent)]/20 bg-[rgba(45,212,191,.045)] p-4"><div className="text-xs font-medium">{copy.appWorkspace}</div><p className="mt-1 text-[11px] leading-5 text-[var(--muted)]">{registered ? copy.noBoardsCopy : "Demo preview. Register to get your own empty workspace."}</p></div>
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-7">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div><div className="text-xs text-[var(--muted)]">{registered ? copy.appWorkspace : "Demo preview"}</div><h1 className="mt-1 text-2xl font-semibold tracking-[-.03em]">{copy.goodAfternoon}, {name}</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">{copy.overviewCopy}</p></div>
              {!registered && <Link href="/auth/sign-up" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-[#06211c]">{copy.startFree}<ArrowUpRight size={14} /></Link>}
            </div>

            {registered ? (
              <section className="mt-8 rounded-[28px] border border-white/8 bg-white/[.025] p-7 sm:p-9">
                <div className="grid gap-5">
                  {boards.length === 0 ? (
                    <>
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[rgba(45,212,191,.09)]"><LayoutDashboard size={20} className="text-[var(--accent)]" /></div>
                      <div><h2 className="text-xl font-semibold">{copy.noBoardsTitle}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">{copy.noBoardsCopy}</p></div>
                    </>
                  ) : (
                    <div><div className="text-xs uppercase tracking-[.18em] text-[var(--muted)]">{copy.activeBoards}</div><div className="mt-4 grid gap-2 sm:grid-cols-2">{boards.map((board) => <div key={board.title} className="rounded-2xl border border-white/7 bg-white/[.02] p-4"><div className="flex items-start justify-between gap-4"><div className="font-medium">{board.title}</div><div className="text-xs text-[var(--muted)]">{board.progress}%</div></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/7"><div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${board.progress}%` }} /></div></div>)}</div></div>
                  )}
                  {creatingBoard ? (
                    <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
                      <label className="grid gap-2 text-xs text-[var(--muted)]"><span>{copy.boardName}</span><input autoFocus value={newBoardName} onChange={(event) => setNewBoardName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") createBoard(); }} className="focus-ring h-10 rounded-xl border border-white/9 bg-white/[.025] px-3 text-sm text-white outline-none focus:border-[var(--accent)]" placeholder={copy.boardNamePlaceholder} /></label>
                      <div className="mt-3 flex gap-2"><button type="button" onClick={createBoard} className="rounded-xl bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-[#06211c]">{copy.save}</button><button type="button" onClick={() => { setCreatingBoard(false); setNewBoardName(""); }} className="rounded-xl border border-white/8 px-3 py-2 text-xs text-[var(--muted)]">{copy.cancel}</button></div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2"><button type="button" onClick={() => setCreatingBoard(true)} className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-[#06211c]"><Plus size={14} className="mr-1 inline" />{copy.createBoard}</button><Link href="/demo" className="rounded-xl border border-white/8 bg-white/[.025] px-4 py-2.5 text-xs text-[var(--muted)] hover:text-white">{copy.viewDemo}</Link></div>
                  )}
                </div>
              </section>
            ) : (
              <>
                <div className="mt-7 grid gap-3 sm:grid-cols-3"><Metric icon={CheckCircle2} label={copy.completed} value="12" helper={copy.done} /><Metric icon={Clock3} label={copy.dueToday} value="5" helper={copy.needsAttention} /><Metric icon={CircleAlert} label={copy.blocked} value="2" helper={copy.needsAttention} /></div>
                <div className="mt-8 grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
                  <section className="rounded-3xl border border-white/8 bg-white/[.025] p-5 sm:p-6"><div className="flex items-center justify-between"><div><div className="text-xs uppercase tracking-[.18em] text-[var(--muted)]">{copy.pulse}</div><h2 className="mt-1 text-lg font-semibold">{copy.activeBoards}</h2></div><Link href="/demo" className="inline-flex items-center gap-1 text-xs text-[var(--muted)] hover:text-white">{copy.openDemo} <ArrowUpRight size={14} /></Link></div><div className="mt-5 grid gap-2">{sampleBoards.map((board) => <Link href="/demo" key={board.title} className="group rounded-2xl border border-white/7 bg-white/[.02] p-4 transition-soft hover:-translate-y-0.5 hover:border-[var(--accent)]/25"><div className="flex items-start justify-between gap-4"><div><div className="font-medium">{board.title}</div><div className="mt-1 text-xs text-[var(--muted)]">{board.tasks} tasks · {board.status}</div></div><div className="text-sm font-semibold">{board.progress}%</div></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/7"><div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${board.progress}%` }} /></div></Link>)}</div></section>
                  <section className="rounded-3xl border border-white/8 bg-white/[.025] p-5 sm:p-6"><div className="text-xs uppercase tracking-[.18em] text-[var(--muted)]">{copy.focusToday}</div><h2 className="mt-1 text-lg font-semibold">{copy.keepMomentum}</h2><div className="mt-5 grid gap-3">{[{ title: "Build dashboard", meta: "Due today · High" }, { title: "Workspace roles", meta: "Blocked · Backend" }, { title: "Landing polish", meta: "Due tomorrow · Low" }].map((item) => <div key={item.title} className="rounded-2xl bg-white/[.02] p-4"><div className="text-sm font-medium">{item.title}</div><div className="mt-1 text-xs text-[var(--muted)]">{item.meta}</div></div>)}</div><button type="button" className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/8 py-2.5 text-xs text-[var(--muted)] hover:text-white"><Plus size={14} /> {copy.addFocus}</button></section>
                </div>
                <div className="mt-8 text-xs text-[var(--muted)]">{total} sample cards are available on the Demo page.</div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, helper }: MetricProps) {
  return <div className="rounded-2xl border border-white/8 bg-white/[.025] p-4"><div className="flex items-center gap-2 text-xs text-[var(--muted)]"><Icon size={14} className="text-[var(--accent)]" />{label}</div><div className="mt-3 text-2xl font-semibold tracking-[-.03em]">{value}</div><div className="mt-1 text-xs text-[var(--muted)]">{helper}</div></div>;
}
