"use client";

import Link from "next/link";
import { ArrowRight, Check, ChevronRight, CircleDashed, Layers3, Radio, Sparkles, Users } from "lucide-react";
import { Brand } from "@/components/brand";
import { boardColumns } from "@/lib/mock-data";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage } from "@/components/language-provider";

const pulse = ["12", "4", "2"] as const;

export default function Home() {
  const { copy } = useLanguage();
  const labels = [copy.done, copy.active, copy.blocked];
  const features = [
    { icon: Layers3, title: copy.visualWorkflow, text: copy.visualWorkflowCopy },
    { icon: Radio, title: copy.realtimeTitle, text: copy.realtimeCopy },
    { icon: CircleDashed, title: copy.pulseTitle, text: copy.pulseCopy },
  ];

  return (
    <main className="shell min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-fade" />
      <header className="relative mx-auto flex max-w-6xl items-center gap-5 px-6 py-5 sm:py-6">
        <Brand />
        <nav className="hidden flex-1 items-center justify-center gap-7 text-sm text-[var(--muted)] md:flex">
          <a href="#features" className="hover:text-[var(--text)]">{copy.navFeatures}</a>
          <a href="#pulse" className="hover:text-[var(--text)]">{copy.navPulse}</a>
          <Link href="/demo" className="hover:text-[var(--text)]">{copy.navDemo}</Link>
          <a href="/pricing" className="hover:text-[var(--text)]">{copy.navPricing}</a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher compact />
          <Link href="/auth/sign-in" className="hidden rounded-xl px-3.5 py-2 text-sm text-[var(--muted)] hover:text-[var(--text)] sm:block">{copy.signIn}</Link>
          <Link href="/auth/sign-up" className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[#06211c] shadow-[0_10px_32px_rgba(45,212,191,.14)] transition-soft hover:-translate-y-0.5 hover:bg-[var(--accent-2)]">{copy.startFree}</Link>
        </div>
      </header>

      <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-16 lg:pb-32 lg:pt-24">
        <div className="max-w-3xl animate-float-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5 text-xs text-[var(--muted)]"><Sparkles size={14} className="text-[var(--accent)]" /> {copy.builtForMomentum}</div>
          <h1 className="whitespace-pre-line text-5xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-7xl"><span className="gradient-text">{copy.heroTitle}</span></h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">{copy.heroCopy}</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/auth/sign-up" className="group inline-flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-3.5 text-sm font-semibold text-[#06211c] shadow-[0_16px_50px_rgba(45,212,191,.2)] transition-soft hover:-translate-y-0.5 hover:bg-[var(--accent-2)]">{copy.startFree} <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" /></Link>
            <Link href="/demo" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[.03] px-5 py-3.5 text-sm font-medium text-white transition-soft hover:bg-white/[.06]">{copy.tryDemo} <ChevronRight size={17} /></Link>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--muted)]">
            <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-[var(--success)]" /> {copy.realtime}</span>
            <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-[var(--success)]" /> {copy.noCard}</span>
            <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-[var(--success)]" /> {copy.smallTeams}</span>
          </div>
        </div>

        <div className="mt-16 rounded-[28px] border border-white/10 bg-[#0d1314]/85 p-2 shadow-[0_30px_110px_rgba(0,0,0,.38)] lg:mt-20">
          <div className="overflow-hidden rounded-[22px] border border-white/8 bg-[#0d1314]">
            <div className="flex h-14 items-center justify-between border-b border-white/8 px-4 sm:px-5">
              <div className="flex items-center gap-3"><div className="grid h-8 w-8 place-items-center rounded-lg bg-white/7 text-xs">W</div><div><div className="text-xs text-[var(--muted)]">{copy.workspace}</div><div className="text-sm font-medium">{copy.demoBoard}</div></div></div>
              <div className="flex items-center gap-3"><div className="hidden text-xs text-[var(--muted)] sm:block">3 {copy.collaborators}</div><div className="flex -space-x-1.5"><span className="grid h-7 w-7 place-items-center rounded-full border-2 border-[#0d1314] bg-[#315f59] text-[9px]">DK</span><span className="grid h-7 w-7 place-items-center rounded-full border-2 border-[#29505a] bg-[#2b7370] text-[9px]">AM</span><span className="grid h-7 w-7 place-items-center rounded-full border-2 border-[#6d5a42] bg-[#776243] text-[9px]">MK</span></div></div>
            </div>
            <div className="border-b border-white/8 px-4 py-4 sm:px-5"><div className="flex flex-wrap items-end justify-between gap-4"><div><div className="text-xs uppercase tracking-[.18em] text-[var(--muted)]">{copy.pulse}</div><div className="mt-1 text-2xl font-semibold">78% {copy.onTrack}</div></div><div className="flex gap-5 text-xs text-[var(--muted)]">{pulse.map((value, index) => <div key={value}><div className="text-base font-semibold text-white">{value}</div><div>{labels[index]}</div></div>)}</div></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/7"><div className="h-full w-[78%] rounded-full bg-[var(--accent)]" /></div></div>
            <div className="scrollbar-thin overflow-x-auto p-4 sm:p-5"><div className="grid min-w-[760px] grid-cols-4 gap-3">{boardColumns.map((column) => <div key={column.id} className="rounded-2xl bg-white/[.025] p-2.5"><div className="flex items-center justify-between px-1 pb-2"><div className="text-xs font-medium">{column.title}</div><div className="text-[10px] text-[var(--muted)]">{column.tasks.length}</div></div><div className="space-y-2">{column.tasks.slice(0, 3).map((task) => <div key={task.id} className="card transition-soft rounded-xl p-3"><div className="text-[11px] text-[var(--muted)]">{task.labels[0]}</div><div className="mt-1.5 text-sm font-medium leading-5">{task.title}</div><div className="mt-3 flex items-center justify-between text-[10px] text-[var(--muted)]"><span>{task.due ?? "No deadline"}</span><span>{task.assignee ?? "—"}</span></div></div>)}</div></div>)}</div></div>
          </div>
        </div>
      </section>

      <section id="features" className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-xl"><div className="text-xs uppercase tracking-[.18em] text-[var(--muted)]">{copy.coreWorkflow}</div><h2 className="mt-3 text-3xl font-semibold tracking-[-.03em] sm:text-4xl">{copy.everythingOnBoard}</h2><p className="mt-4 leading-7 text-[var(--muted)]">{copy.workflowCopy}</p></div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => <div key={title} className="rounded-3xl border border-white/8 bg-white/[.025] p-6"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-[rgba(45,212,191,.08)]"><Icon size={19} className="text-[var(--accent)]" /></div><h3 className="mt-6 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p></div>)}
        </div>
      </section>

      <section id="pulse" className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="rounded-[30px] border border-white/8 bg-gradient-to-br from-white/[.055] to-white/[.015] p-8 sm:p-10 lg:p-12"><div className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]"><div><div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.035] px-3 py-1.5 text-xs text-[var(--muted)]"><Users size={14} /> {copy.sharedContext}</div><h2 className="mt-5 text-3xl font-semibold tracking-[-.03em] sm:text-4xl">{copy.boardSays}<br /><span className="text-[var(--muted)]">{copy.pulseSays}</span></h2><p className="mt-4 max-w-xl leading-7 text-[var(--muted)]">{copy.pulseCopy}</p></div><div className="rounded-3xl border border-white/8 bg-[#0c1213] p-5"><div className="text-xs uppercase tracking-[.18em] text-[var(--muted)]">{copy.today}</div><div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1"><div className="rounded-2xl bg-white/[.03] p-4"><div className="text-xs text-[var(--muted)]">{copy.focus}</div><div className="mt-1 font-medium">Build dashboard</div></div><div className="rounded-2xl bg-white/[.03] p-4"><div className="text-xs text-[var(--muted)]">{copy.risk}</div><div className="mt-1 font-medium">Workspace roles are blocked</div></div><div className="rounded-2xl bg-white/[.03] p-4"><div className="text-xs text-[var(--muted)]">{copy.nextMilestone}</div><div className="mt-1 font-medium">Private beta · Oct 12</div></div></div></div></div></div>
      </section>

      <div id="footer">
        <SiteFooter />
      </div>
    </main>
  );
}
