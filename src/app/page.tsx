import Link from "next/link";
import { ArrowRight, Check, ChevronRight, CircleDashed, Layers3, Radio, Sparkles, Users } from "lucide-react";
import { Brand } from "@/components/brand";
import { boardColumns } from "@/lib/mock-data";

const pulse = [
  ["12", "done"],
  ["4", "active"],
  ["2", "blocked"],
];

export default function Home() {
  return (
    <main className="shell min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-fade" />
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Brand />
        <nav className="hidden items-center gap-7 text-sm text-[var(--muted)] md:flex">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#pulse" className="hover:text-white">Project Pulse</a>
          <Link href="/demo" className="hover:text-white">Live demo</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/auth/sign-in" className="hidden rounded-xl px-4 py-2 text-sm text-[var(--muted)] hover:text-white sm:block">Sign in</Link>
          <Link href="/auth/sign-up" className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition-soft hover:bg-white/85">Start free</Link>
        </div>
      </header>

      <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-16 lg:pb-32 lg:pt-24">
        <div className="max-w-3xl animate-float-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5 text-xs text-[var(--muted)]"><Sparkles size={14} className="text-[var(--accent)]" /> Built for projects that need momentum</div>
          <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-7xl"><span className="gradient-text">Plan. Focus.<br />Ship.</span></h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">A modern visual workspace for small teams and makers. Manage work in realtime, spot bottlenecks early, and keep everyone focused on the next important thing.</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/auth/sign-up" className="group inline-flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_50px_rgba(124,92,255,.24)] transition-soft hover:-translate-y-0.5 hover:bg-[var(--accent-2)]">Start for free <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" /></Link>
            <Link href="/demo" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[.03] px-5 py-3.5 text-sm font-medium text-white transition-soft hover:bg-white/[.06]">Try the demo <ChevronRight size={17} /></Link>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--muted)]">
            <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-[var(--success)]" /> Realtime collaboration</span>
            <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-[var(--success)]" /> No credit card</span>
            <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-[var(--success)]" /> Built for small teams</span>
          </div>
        </div>

        <div className="mt-16 rounded-[28px] border border-white/10 bg-[#0d1116]/85 p-2 shadow-[0_30px_110px_rgba(0,0,0,.38)] lg:mt-20">
          <div className="overflow-hidden rounded-[22px] border border-white/8 bg-[#0d1116]">
            <div className="flex h-14 items-center justify-between border-b border-white/8 px-4 sm:px-5">
              <div className="flex items-center gap-3"><div className="grid h-8 w-8 place-items-center rounded-lg bg-white/7 text-xs">W</div><div><div className="text-xs text-[var(--muted)]">Workspace</div><div className="text-sm font-medium">Website redesign</div></div></div>
              <div className="flex items-center gap-3"><div className="hidden text-xs text-[var(--muted)] sm:block">3 collaborators online</div><div className="flex -space-x-1.5"><span className="grid h-7 w-7 place-items-center rounded-full border-2 border-[#0d1116] bg-[#6f53d8] text-[9px]">DK</span><span className="grid h-7 w-7 place-items-center rounded-full border-2 border-[#0d1116] bg-[#296b70] text-[9px]">AM</span><span className="grid h-7 w-7 place-items-center rounded-full border-2 border-[#0d1116] bg-[#8b556a] text-[9px]">MK</span></div></div>
            </div>
            <div className="border-b border-white/8 px-4 py-4 sm:px-5"><div className="flex flex-wrap items-end justify-between gap-4"><div><div className="text-xs uppercase tracking-[.18em] text-[var(--muted)]">Project Pulse</div><div className="mt-1 text-2xl font-semibold">78% on track</div></div><div className="flex gap-5 text-xs text-[var(--muted)]">{pulse.map(([value, label]) => <div key={label}><div className="text-base font-semibold text-white">{value}</div><div>{label}</div></div>)}</div></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/7"><div className="h-full w-[78%] rounded-full bg-[var(--accent)]" /></div></div>
            <div className="scrollbar-thin overflow-x-auto p-4 sm:p-5"><div className="grid min-w-[760px] grid-cols-4 gap-3">{boardColumns.map((column) => <div key={column.id} className="rounded-2xl bg-white/[.025] p-2.5"><div className="flex items-center justify-between px-1 pb-2"><div className="text-xs font-medium">{column.title}</div><div className="text-[10px] text-[var(--muted)]">{column.tasks.length}</div></div><div className="space-y-2">{column.tasks.slice(0, 3).map((task) => <div key={task.id} className="card transition-soft rounded-xl p-3"><div className="text-[11px] text-[var(--muted)]">{task.labels[0]}</div><div className="mt-1.5 text-sm font-medium leading-5">{task.title}</div><div className="mt-3 flex items-center justify-between text-[10px] text-[var(--muted)]"><span>{task.due ?? "No deadline"}</span><span>{task.assignee ?? "—"}</span></div></div>)}</div></div>)}</div></div>
          </div>
        </div>
      </section>

      <section id="features" className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-xl"><div className="text-xs uppercase tracking-[.18em] text-[var(--muted)]">Core workflow</div><h2 className="mt-3 text-3xl font-semibold tracking-[-.03em] sm:text-4xl">Everything important on one board.</h2><p className="mt-4 leading-7 text-[var(--muted)]">Start simple with Kanban. Add detail only when the project needs it.</p></div>
        <div className="mt-12 grid gap-4 md:grid-cols-3" >
          {[{icon: Layers3, title:"Visual workflow", text:"Cards, lists, labels, deadlines and checklists without visual clutter."},{icon: Radio, title:"Realtime by default", text:"Presence, live updates and collaborative workspaces powered by Liveblocks."},{icon: CircleDashed, title:"Project Pulse", text:"A lightweight health snapshot surfaces progress, blockers and upcoming risk."}].map(({icon:Icon,title,text}) => <div key={title} className="rounded-3xl border border-white/8 bg-white/[.025] p-6"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/7"><Icon size={19} className="text-[var(--accent)]" /></div><h3 className="mt-6 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p></div>)}
        </div>
      </section>

      <section id="pulse" className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="rounded-[30px] border border-white/8 bg-gradient-to-br from-white/[.055] to-white/[.015] p-8 sm:p-10 lg:p-12"><div className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]"><div><div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.035] px-3 py-1.5 text-xs text-[var(--muted)]"><Users size={14} /> Designed around shared context</div><h2 className="mt-5 text-3xl font-semibold tracking-[-.03em] sm:text-4xl">The board tells you what is happening.<br /><span className="text-[var(--muted)]">Pulse tells you why it matters.</span></h2><p className="mt-4 max-w-xl leading-7 text-[var(--muted)]">Flowboard turns board activity into a compact project signal — without adding another complex analytics dashboard.</p></div><div className="rounded-3xl border border-white/8 bg-[#0c1015] p-5"><div className="text-xs uppercase tracking-[.18em] text-[var(--muted)]">Today</div><div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1"><div className="rounded-2xl bg-white/[.03] p-4"><div className="text-xs text-[var(--muted)]">Focus</div><div className="mt-1 font-medium">Build dashboard</div></div><div className="rounded-2xl bg-white/[.03] p-4"><div className="text-xs text-[var(--muted)]">Risk</div><div className="mt-1 font-medium">Workspace roles are blocked</div></div><div className="rounded-2xl bg-white/[.03] p-4"><div className="text-xs text-[var(--muted)]">Next milestone</div><div className="mt-1 font-medium">Private beta · Oct 12</div></div></div></div></div></div>
      </section>

      <footer className="relative mx-auto flex max-w-6xl flex-col gap-3 border-t border-white/8 px-6 py-10 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between"><Brand /><div>Flowboard · v0.1 foundation</div></footer>
    </main>
  );
}
