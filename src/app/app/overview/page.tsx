import Link from "next/link";
import { ArrowUpRight, CalendarDays, CheckCircle2, CircleAlert, Clock3, LayoutDashboard, Plus, Search, Settings2, Users } from "lucide-react";
import { Brand } from "@/components/brand";
import { boardColumns } from "@/lib/mock-data";

const boards = [
  { title: "Website redesign", progress: 78, status: "On track", tasks: 17 },
  { title: "Flowboard launch", progress: 46, status: "In progress", tasks: 13 },
  { title: "Content system", progress: 31, status: "Needs focus", tasks: 8 },
];

type MetricProps = { icon: typeof CheckCircle2; label: string; value: string; helper: string };

export default function Overview() {
  const total = boardColumns.reduce((acc, column) => acc + column.tasks.length, 0);

  return (
    <div className="shell min-h-screen">
      <header className="flex h-16 items-center justify-between border-b border-white/8 px-5"><Brand /><div className="flex items-center gap-2"><button className="hidden h-9 items-center gap-2 rounded-xl border border-white/8 bg-white/[.025] px-3 text-xs text-[var(--muted)] sm:flex"><Search size={15} /> Search workspace</button><div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--accent)] text-xs font-semibold">DK</div></div></header>
      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className="hidden w-60 shrink-0 border-r border-white/8 p-4 lg:block"><div className="text-[11px] uppercase tracking-[.18em] text-[var(--muted)]">Northstar</div><nav className="mt-3 grid gap-1 text-sm"><div className="flex items-center gap-2 rounded-xl bg-white/[.055] px-3 py-2.5"><LayoutDashboard size={16} /> Overview</div><Link href="/demo" className="rounded-xl px-3 py-2.5 text-[var(--muted)] hover:bg-white/[.035] hover:text-white">Boards</Link><div className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[var(--muted)]"><CalendarDays size={16} /> Calendar</div><div className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[var(--muted)]"><Users size={16} /> Members</div><div className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[var(--muted)]"><Settings2 size={16} /> Settings</div></nav><div className="mt-10 rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/7 p-4"><div className="text-xs font-medium">Demo workspace</div><p className="mt-1 text-[11px] leading-5 text-[var(--muted)]">Connect Supabase and Liveblocks to turn this foundation into a real account.</p></div></aside>
        <main className="min-w-0 flex-1 p-5 sm:p-7"><div className="mx-auto max-w-6xl"><div><div className="text-xs text-[var(--muted)]">Tuesday, September 29</div><h1 className="mt-1 text-2xl font-semibold tracking-[-.03em]">Good afternoon, Dmitry</h1><p className="mt-2 text-sm text-[var(--muted)]">Here is what needs attention across your workspace.</p></div>
          <div className="mt-7 grid gap-3 sm:grid-cols-3"><Metric icon={CheckCircle2} label="Completed" value="12" helper="this week" /><Metric icon={Clock3} label="Due today" value="5" helper="2 are high priority" /><Metric icon={CircleAlert} label="Blocked" value="2" helper="needs attention" /></div>
          <div className="mt-8 grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
            <section className="rounded-3xl border border-white/8 bg-white/[.025] p-5 sm:p-6"><div className="flex items-center justify-between"><div><div className="text-xs uppercase tracking-[.18em] text-[var(--muted)]">Projects</div><h2 className="mt-1 text-lg font-semibold">Active boards</h2></div><Link href="/demo" className="inline-flex items-center gap-1 text-xs text-[var(--muted)] hover:text-white">Open demo <ArrowUpRight size={14} /></Link></div><div className="mt-5 grid gap-2">{boards.map((board) => <Link href="/demo" key={board.title} className="group rounded-2xl border border-white/7 bg-white/[.02] p-4 transition-soft hover:-translate-y-0.5 hover:border-[var(--accent)]/25"><div className="flex items-start justify-between gap-4"><div><div className="font-medium">{board.title}</div><div className="mt-1 text-xs text-[var(--muted)]">{board.tasks} visible tasks · {board.status}</div></div><div className="text-sm font-semibold">{board.progress}%</div></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/7"><div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${board.progress}%` }} /></div></Link>)}</div></section>
            <section className="rounded-3xl border border-white/8 bg-white/[.025] p-5 sm:p-6"><div className="text-xs uppercase tracking-[.18em] text-[var(--muted)]">Focus today</div><h2 className="mt-1 text-lg font-semibold">Keep momentum</h2><div className="mt-5 grid gap-3">{[{ title: "Build dashboard", meta: "Due today · High" }, { title: "Workspace roles", meta: "Blocked · Backend" }, { title: "Landing polish", meta: "Due tomorrow · Low" }].map((item) => <div key={item.title} className="rounded-2xl bg-white/[.02] p-4"><div className="text-sm font-medium">{item.title}</div><div className="mt-1 text-xs text-[var(--muted)]">{item.meta}</div></div>)}</div><button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/8 py-2.5 text-xs text-[var(--muted)] hover:text-white"><Plus size={14} /> Add focus task</button></section>
          </div>
          <div className="mt-8 text-xs text-[var(--muted)]">{total} sample cards are included in the interactive demo.</div>
        </div></main>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, helper }: MetricProps) {
  return <div className="rounded-2xl border border-white/8 bg-white/[.025] p-4"><div className="flex items-center gap-2 text-xs text-[var(--muted)]"><Icon size={14} className="text-[var(--accent)]" />{label}</div><div className="mt-3 text-2xl font-semibold tracking-[-.03em]">{value}</div><div className="mt-1 text-xs text-[var(--muted)]">{helper}</div></div>;
}
