"use client";

import Link from "next/link";
import { Bell, CalendarDays, ChevronDown, LayoutDashboard, LogOut, Search, Settings2, UserRound, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { useWorkspace } from "@/lib/workspace-store";
import { getCurrentUser, signOutUser } from "@/lib/auth-store";
import { sitePath } from "@/lib/site-path";
import { OnboardingGuide } from "@/components/onboarding-guide";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { copy, language } = useLanguage();
  const { state } = useWorkspace();
  const [name, setName] = useState("");
  const [menu, setMenu] = useState<"workspace" | "search" | "notifications" | "account" | null>(null);
  const [query, setQuery] = useState("");
  const displayName = name || (language === "ru" ? "Профиль" : "Profile");

  useEffect(() => {
    const syncName = () => setName(getCurrentUser()?.name || "");
    syncName();
    window.addEventListener("flowboard-auth-changed", syncName);
    return () => window.removeEventListener("flowboard-auth-changed", syncName);
  }, []);
  const results = useMemo(() => {
    if (!query.trim()) return [];
    return state.boards.flatMap(b => b.columns.flatMap(c => c.tasks.map(t => ({ boardId: b.id, board: b.title, task: t.title })))).filter(x => `${x.board} ${x.task}`.toLowerCase().includes(query.toLowerCase())).slice(0, 8);
  }, [query, state.boards]);

  function signOut() {
    signOutUser();
    window.location.replace(sitePath("/"));
  }

  return <div className="shell min-h-screen">
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[rgba(10,15,16,.86)] backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-5">
        <Brand />
        <div className="hidden h-7 w-px bg-white/8 md:block" />
        <button type="button" onClick={() => setMenu(menu === "workspace" ? null : "workspace")} className="hidden items-center gap-2 rounded-xl border border-white/8 bg-white/[.025] px-3 py-2 text-left md:flex"><span className="grid h-6 w-6 place-items-center rounded-lg bg-[var(--accent)] text-[10px] font-bold text-[#06211c]">N</span><span className="text-xs font-medium">{copy.appWorkspace}</span><ChevronDown size={13} className="text-[var(--muted)]" /></button>
        <div className="ml-auto flex items-center gap-1.5">
          <button type="button" onClick={() => setMenu(menu === "search" ? null : "search")} aria-label={copy.search} className="grid h-9 w-9 place-items-center rounded-xl text-[var(--muted)] hover:bg-white/5 hover:text-white lg:w-auto lg:px-3"><Search size={15}/><span className="ml-2 hidden text-xs lg:block">{copy.search}</span></button>
          <LanguageSwitcher compact />
          <button type="button" onClick={() => setMenu(menu === "notifications" ? null : "notifications")} aria-label={copy.notifications} className="relative grid h-9 w-9 place-items-center rounded-xl text-[var(--muted)] hover:bg-white/5 hover:text-white"><Bell size={16}/><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--accent)]"/></button>
          <button type="button" onClick={() => setMenu(menu === "account" ? null : "account")} aria-label={copy.account} className="grid h-9 w-9 place-items-center rounded-full bg-[var(--accent)] text-xs font-bold text-[#06211c]">{name ? name.slice(0,2).toUpperCase() : "F"}</button>
        </div>
      </div>
    </header>

    {menu === "workspace" && <div className="absolute right-4 top-16 z-50 w-72 rounded-2xl border border-white/10 bg-[#111819] p-3 shadow-2xl"><div className="flex items-center justify-between"><div><div className="text-xs text-[var(--muted)]">{copy.workspace}</div><div className="mt-1 font-medium">Flowboard</div></div><span className="rounded-md bg-[rgba(45,212,191,.09)] px-2 py-1 text-[10px] text-[var(--accent)]">Free</span></div><Link href="/app/settings" onClick={()=>setMenu(null)} className="mt-3 block rounded-xl px-3 py-2 text-xs text-[var(--muted)] hover:bg-white/5 hover:text-white">{copy.settings}</Link></div>}
    {menu === "search" && <div className="absolute right-16 top-16 z-50 w-[min(520px,calc(100vw-32px))] rounded-2xl border border-white/10 bg-[#111819] p-3 shadow-2xl"><div className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[.025] px-3"><Search size={15} className="text-[var(--muted)]"/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder={copy.searchBoard} className="h-10 flex-1 bg-transparent text-sm outline-none"/><button onClick={()=>{setQuery("");setMenu(null)}}><X size={15}/></button></div><div className="mt-2 grid gap-1">{results.length ? results.map(r=><Link onClick={()=>setMenu(null)} key={`${r.boardId}-${r.task}`} href={`/app/board?board=${r.boardId}`} className="rounded-xl p-3 hover:bg-white/5"><div className="text-xs text-[var(--muted)]">{r.board}</div><div className="mt-1 text-sm">{r.task}</div></Link>) : <div className="p-4 text-xs text-[var(--muted)]">{query ? (language === "ru" ? "Ничего не найдено" : "Nothing found") : (language === "ru" ? "Введите название задачи или доски" : "Type a task or board name")}</div>}</div></div>}
    {menu === "notifications" && <div className="absolute right-14 top-16 z-50 w-80 rounded-2xl border border-white/10 bg-[#111819] p-3 shadow-2xl"><div className="flex items-center justify-between px-2"><div className="font-medium">{copy.notifications}</div><span className="text-[10px] text-[var(--muted)]">3 {language === "ru" ? "новых" : "new"}</span></div><div className="mt-2 grid gap-1">{state.activity.slice(0,3).map(item=><div key={item.id} className="rounded-xl p-3 hover:bg-white/5"><div className="text-xs leading-5">{item.text}</div><div className="mt-1 text-[10px] text-[var(--muted)]">{language === "ru" ? "только что" : "just now"}</div></div>)}</div></div>}
    {menu === "account" && <div className="absolute right-4 top-16 z-50 w-64 rounded-2xl border border-white/10 bg-[#111819] p-2 shadow-2xl"><div className="flex items-center gap-3 rounded-xl p-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--accent)] text-xs font-bold text-[#06211c]">{name.slice(0,2).toUpperCase()}</div><div className="min-w-0"><div className="truncate text-sm font-medium">{displayName}</div><div className="truncate text-xs text-[var(--muted)]">{language === "ru" ? "Личный аккаунт" : "Personal account"}</div></div></div><Link href="/app/profile" onClick={()=>setMenu(null)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-[var(--muted)] hover:bg-white/5 hover:text-white"><UserRound size={14}/> {language === "ru" ? "Профиль" : "Profile"}</Link><Link href="/app/settings" onClick={()=>setMenu(null)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-[var(--muted)] hover:bg-white/5 hover:text-white"><Settings2 size={14}/> {copy.settings}</Link><button onClick={signOut} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-[var(--muted)] hover:bg-[rgba(255,113,113,.07)] hover:text-[var(--danger)]"><LogOut size={14}/>{language === "ru" ? "Выйти" : "Sign out"}</button></div>}

    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="hidden w-60 shrink-0 border-r border-white/8 bg-black/5 p-4 lg:block">
        <div className="text-[11px] uppercase tracking-[.18em] text-[var(--muted)]">Flowboard</div>
        <nav className="mt-3 grid gap-1 text-sm">
          <SideLink href="/app/overview" icon={LayoutDashboard} text={copy.overview}/>
          <SideLink href="/app/boards" icon={LayoutDashboard} text={copy.boards}/>
          <SideLink href="/app/calendar" icon={CalendarDays} text={copy.calendar}/>
          <SideLink href="/app/members" icon={Users} text={copy.members}/>
          <SideLink href="/app/settings" icon={Settings2} text={copy.settings}/>
        </nav>
        <div className="mt-8 rounded-2xl border border-[var(--accent)]/15 bg-[rgba(45,212,191,.035)] p-4"><div className="text-xs font-medium">{copy.pulse}</div><p className="mt-1 text-[11px] leading-5 text-[var(--muted)]">{language === "ru" ? "Автоматически собирает прогресс, дедлайны и блокеры из реальных задач." : "Automatically collects progress, deadlines and blockers from your tasks."}</p></div>
      </aside>
      <main className="min-w-0 flex-1 pb-16 lg:pb-0">{children}</main>
    </div>
    <OnboardingGuide />
    <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t border-white/8 bg-[rgba(10,15,16,.94)] px-2 py-2 backdrop-blur-xl lg:hidden">
      <MobileLink href="/app/overview" icon={LayoutDashboard} text={copy.overview}/>
      <MobileLink href="/app/boards" icon={LayoutDashboard} text={copy.boards}/>
      <MobileLink href="/app/calendar" icon={CalendarDays} text={copy.calendar}/>
      <MobileLink href="/app/members" icon={Users} text={copy.members}/>
      <MobileLink href="/app/settings" icon={Settings2} text={copy.settings}/>
    </nav>
  </div>;
}

function SideLink({href,icon:Icon,text}:{href:string;icon:typeof LayoutDashboard;text:string}) { return <Link href={href} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[var(--muted)] hover:bg-white/[.035] hover:text-white"><Icon size={16}/>{text}</Link>; }
function MobileLink({href,icon:Icon,text}:{href:string;icon:typeof LayoutDashboard;text:string}) { return <Link href={href} className="grid place-items-center gap-1 rounded-lg px-1 py-1 text-[9px] text-[var(--muted)] hover:text-white"><Icon size={16}/><span>{text}</span></Link>; }
