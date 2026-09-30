"use client";

import Link from "next/link";
import { ArrowRight, Check, Layers3, Radio, Target } from "lucide-react";
import { Brand } from "@/components/brand";
import { boardColumns } from "@/lib/mock-data";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage } from "@/components/language-provider";

export default function Home() {
  const { copy, language } = useLanguage();
  const features = [
    { icon: Layers3, title: copy.visualWorkflow, text: copy.visualWorkflowCopy },
    { icon: Target, title: copy.pulseTitle, text: copy.pulseCopy },
    { icon: Radio, title: copy.realtimeTitle, text: copy.realtimeCopy },
  ];

  return (
    <main className="landing-shell min-h-screen overflow-hidden">
      <div className="landing-orb landing-orb-a" />
      <div className="landing-orb landing-orb-b" />

      <header className="relative mx-auto flex max-w-6xl items-center gap-5 px-5 py-5 sm:px-6 sm:py-6">
        <Brand />
        <nav className="hidden flex-1 items-center justify-center gap-7 text-sm text-[var(--muted)] md:flex">
          <a href="#features" className="hover:text-white">{copy.navFeatures}</a>
          <a href="#board" className="hover:text-white">{copy.boards}</a>
          <Link href="/pricing" className="hover:text-white">{copy.navPricing}</Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher compact />
          <Link href="/auth/sign-in" className="hidden rounded-xl px-3.5 py-2 text-sm text-[var(--muted)] hover:text-white sm:block">{copy.signIn}</Link>
          <Link href="/auth/sign-up" className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[#06211c] shadow-[0_10px_34px_rgba(45,212,191,.16)] transition-soft hover:-translate-y-0.5 hover:bg-[var(--accent-2)]">{copy.startFree}</Link>
        </div>
      </header>

      <section className="relative mx-auto max-w-[1480px] px-5 pb-16 pt-12 sm:px-7 sm:pt-16 lg:px-10 lg:pb-20 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[.82fr_1.18fr] xl:gap-14">
          <div className="animate-float-in">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/9 bg-white/[.035] px-3 py-1.5 text-xs text-[var(--muted)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />{copy.builtForMomentum}</div>
            <h1 className="max-w-3xl whitespace-pre-line text-5xl font-semibold leading-[.96] tracking-[-.065em] sm:text-6xl xl:text-[78px]"><span className="gradient-text">{copy.heroTitle}</span></h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg">{copy.heroCopy}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/auth/sign-up" className="group inline-flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-3.5 text-sm font-semibold text-[#06211c] shadow-[0_18px_52px_rgba(45,212,191,.18)] transition-soft hover:-translate-y-0.5 hover:bg-[var(--accent-2)]">{copy.startFree}<ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" /></Link>
              <a href="#board" className="inline-flex items-center gap-2 rounded-2xl border border-white/9 bg-white/[.03] px-5 py-3.5 text-sm font-medium text-white transition-soft hover:bg-white/[.06]">{language === "ru" ? "Посмотреть доску" : "See the board"}</a>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--muted)]">
              <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-[var(--success)]" /> {copy.realtime}</span>
              <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-[var(--success)]" /> {copy.noCard}</span>
              <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-[var(--success)]" /> {copy.smallTeams}</span>
            </div>
          </div>

          <div id="board" className="relative min-w-0">
            <div className="absolute -inset-6 rounded-[40px] bg-[radial-gradient(circle_at_50%_50%,rgba(45,212,191,.10),transparent_58%)] blur-2xl" />
            <div className="relative rounded-[30px] border border-white/10 bg-[rgba(13,19,20,.78)] p-2 shadow-[0_35px_120px_rgba(0,0,0,.42)] backdrop-blur-xl">
              <div className="overflow-hidden rounded-[24px] border border-white/8 bg-[#0d1314]">
                <div className="flex h-14 items-center justify-between border-b border-white/8 px-4 sm:px-5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-[rgba(45,212,191,.10)] text-xs font-semibold text-[var(--accent)]">F</div>
                    <div><div className="text-[10px] uppercase tracking-[.16em] text-[var(--muted)]">{language === "ru" ? "Рабочая доска" : "Project board"}</div><div className="text-sm font-medium">{copy.demoBoard}</div></div>
                  </div>
                  <div className="hidden items-center gap-5 sm:flex"><span className="text-xs text-[var(--muted)]">78% {copy.onTrack}</span><div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/7"><div className="h-full w-[78%] rounded-full bg-[var(--accent)]" /></div></div>
                </div>
                <div className="scrollbar-thin overflow-x-auto p-3 sm:p-4">
                  <div className="grid min-w-[700px] grid-cols-4 gap-2.5 sm:gap-3">
                    {boardColumns.map(column => (
                      <div key={column.id} className="rounded-2xl border border-white/6 bg-white/[.02] p-2">
                        <div className="flex items-center justify-between px-1 pb-2"><div className="text-[11px] font-medium">{column.title}</div><div className="text-[9px] text-[var(--muted)]">{column.tasks.length}</div></div>
                        <div className="space-y-1.5">
                          {column.tasks.slice(0, 3).map(task => (
                            <div key={task.id} className="card rounded-xl p-2.5">
                              <div className="flex items-center justify-between gap-2"><span className="text-[9px] text-[var(--muted)]">{task.labels[0]}</span><span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /></div>
                              <div className="mt-1.5 text-[12px] font-medium leading-4">{task.title}</div>
                              <div className="mt-2.5 flex items-center justify-between text-[9px] text-[var(--muted)]"><span>{task.due ? task.due : language === "ru" ? "Без срока" : "No due date"}</span><span>{task.assignee || "—"}</span></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative mx-auto max-w-[1480px] px-5 py-14 sm:px-7 sm:py-16 lg:px-10 lg:py-20">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl border border-white/8 bg-white/[.022] p-6 transition-soft hover:-translate-y-0.5 hover:bg-white/[.035]">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[rgba(45,212,191,.08)]"><Icon size={19} className="text-[var(--accent)]" /></div>
              <h2 className="mt-6 text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-[30px] border border-white/8 bg-gradient-to-r from-white/[.035] to-transparent p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div><div className="text-xs uppercase tracking-[.18em] text-[var(--muted)]">{language === "ru" ? "Начало" : "Start here"}</div><h2 className="mt-2 text-2xl font-semibold tracking-[-.03em]">{language === "ru" ? "Создай пустое рабочее пространство за минуту." : "Start with a clean workspace in a minute."}</h2></div>
            <Link href="/auth/sign-up" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[#06211c]">{copy.startFree}<ArrowRight size={16}/></Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
