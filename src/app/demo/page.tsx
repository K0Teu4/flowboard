"use client";

import Link from "next/link";
import { ArrowLeft, Bell, CalendarDays, ChevronDown, Plus, Search, Settings2, Users } from "lucide-react";
import { BoardPreview } from "@/components/board-preview";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";

export default function DemoPage() {
  const { copy } = useLanguage();

  return (
    <div className="shell min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/8 bg-[rgba(10,15,16,.84)] backdrop-blur-xl">
        <div className="flex h-16 items-center gap-4 px-4 sm:px-5">
          <div className="flex items-center gap-5"><Brand /><div className="hidden h-6 w-px bg-white/8 md:block" /><Link href="/" className="hidden items-center gap-2 text-sm text-[var(--muted)] hover:text-white md:flex"><ArrowLeft size={15} /> {copy.back}</Link></div>
          <div className="ml-auto flex items-center gap-1.5"><button aria-label={copy.notifications} className="grid h-9 w-9 place-items-center rounded-xl text-[var(--muted)] hover:bg-white/5"><Bell size={17} /></button><LanguageSwitcher compact /><div className="flex -space-x-2"><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#0a0f10] bg-[#315f59] text-[9px]">DK</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#0a0f10] bg-[#2b7370] text-[9px]">AM</span></div></div>
        </div>
      </header>
      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className="hidden w-56 shrink-0 border-r border-white/8 p-4 lg:block"><div className="text-[11px] uppercase tracking-[.18em] text-[var(--muted)]">{copy.demoWorkspace}</div><div className="mt-3 flex items-center justify-between rounded-2xl bg-white/[.035] p-3"><div><div className="text-sm font-medium">Northstar</div><div className="mt-0.5 text-xs text-[var(--muted)]">{copy.demoWorkspaceCopy}</div></div><ChevronDown size={15} className="text-[var(--muted)]" /></div><nav className="mt-6 grid gap-1 text-sm"><Link href="/app/overview" className="rounded-xl px-3 py-2.5 text-[var(--muted)] hover:bg-white/[.035] hover:text-white">{copy.overview}</Link><div className="rounded-xl bg-[rgba(45,212,191,.09)] px-3 py-2.5 font-medium">{copy.boards}</div><div className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[var(--muted)]"><CalendarDays size={16} /> {copy.calendar}</div><div className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[var(--muted)]"><Users size={16} /> {copy.members}</div><div className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[var(--muted)]"><Settings2 size={16} /> {copy.settings}</div></nav></aside>
        <main className="min-w-0 flex-1 p-4 sm:p-7"><div className="mx-auto max-w-[1500px]"><div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"><div><div className="text-xs text-[var(--muted)]">Northstar / {copy.boards}</div><h1 className="mt-1 text-2xl font-semibold tracking-[-.03em]">{copy.demoBoard}</h1></div><div className="flex flex-wrap items-center gap-2"><button type="button" className="flex items-center gap-2 rounded-xl border border-white/9 bg-white/[.03] px-3 py-2 text-xs text-[var(--muted)]"><Search size={15} /> {copy.searchBoard}</button><button type="button" className="flex items-center gap-2 rounded-xl border border-white/9 bg-white/[.03] px-3 py-2 text-xs text-[var(--muted)]"><Users size={15} /> {copy.share}</button><button type="button" className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-[#06211c]"><Plus size={15} /> {copy.add}</button></div></div><div className="mt-6 rounded-3xl border border-white/8 bg-white/[.025] p-4 sm:p-5"><div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"><div><div className="text-[11px] uppercase tracking-[.18em] text-[var(--muted)]">{copy.pulse}</div><div className="mt-1 text-xl font-semibold">78% {copy.onTrack}</div></div><div className="grid grid-cols-3 gap-6"><div><div className="text-xs text-[var(--muted)]">{copy.done}</div><div className="mt-0.5 font-semibold">12</div></div><div><div className="text-xs text-[var(--muted)]">{copy.active}</div><div className="mt-0.5 font-semibold">4</div></div><div><div className="text-xs text-[var(--muted)]">{copy.blocked}</div><div className="mt-0.5 font-semibold">2</div></div></div></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/7"><div className="h-full w-[78%] rounded-full bg-[var(--accent)]" /></div></div><BoardPreview /></div></main>
      </div>
    </div>
  );
}
