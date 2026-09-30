"use client";

import Link from "next/link";
import { ArrowLeft, Compass, Radio } from "lucide-react";
import { Brand } from "@/components/brand";
import { useLanguage } from "@/components/language-provider";

export default function NotFound() {
  const { language } = useLanguage();
  const ru = language === "ru";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bg)] px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_42%_at_20%_20%,rgba(45,212,191,.14),transparent_70%),radial-gradient(ellipse_42%_38%_at_82%_28%,rgba(90,112,255,.12),transparent_72%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.026)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.026)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(circle_at_50%_20%,black,transparent_84%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-[1480px] flex-col">
        <header className="flex items-center justify-between py-6"><Brand /><span className="rounded-full border border-white/8 bg-white/[.025] px-3 py-1.5 text-[10px] uppercase tracking-[.18em] text-[var(--muted)]">404</span></header>

        <div className="flex flex-1 items-center py-16">
          <div className="grid w-full gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center xl:gap-20">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-[rgba(45,212,191,.05)] px-3 py-1.5 text-xs text-[var(--muted)]"><Radio size={14} className="text-[var(--accent)]" /> {ru ? "Сигнал потерян" : "Signal lost"}</div>
              <div className="mt-7 text-[clamp(7rem,18vw,14rem)] font-semibold leading-[.78] tracking-[-.09em] text-white/[.075]">404</div>
              <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-.045em] sm:text-4xl xl:text-5xl">{ru ? "Эта страница потерялась между списками." : "This page got lost between the lists."}</h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">{ru ? "Адрес мог устареть, доску могли удалить или ссылка ведёт не туда. Вернись в Flowboard и продолжи работу с актуального места." : "The address may be outdated, the board may have been removed, or the link points somewhere else. Return to Flowboard and continue from a current view."}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-[#06211c]"><ArrowLeft size={14} /> {ru ? "На главную" : "Go home"}</Link>
                <Link href="/app/boards" className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/[.025] px-4 py-2.5 text-xs text-[var(--muted)] hover:text-white"><Compass size={14} /> {ru ? "К доскам" : "Open boards"}</Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute inset-4 rounded-full bg-[rgba(45,212,191,.08)] blur-3xl" />
              <div className="relative rounded-[34px] border border-white/10 bg-[rgba(13,19,20,.78)] p-4 shadow-[0_35px_120px_rgba(0,0,0,.42)] backdrop-blur-xl">
                <div className="rounded-[26px] border border-white/8 bg-[#0d1314] p-4">
                  <div className="flex items-center justify-between border-b border-white/8 pb-4">
                    <div><div className="text-[10px] uppercase tracking-[.16em] text-[var(--muted)]">Flowboard</div><div className="mt-1 text-sm font-medium">{ru ? "Карта доски" : "Board map"}</div></div>
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--danger)]" />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {(ru ? [["Маршрут","не найден"],["Доска","недоступна"],["Список","не найден"],["Сигнал","потерян"]] : [["Route","not found"],["Board","unavailable"],["List","not found"],["Signal","lost"]]).map(([label,value],index) => (
                      <div key={label} className="rounded-2xl border border-white/7 bg-white/[.025] p-4"><div className="text-[10px] uppercase tracking-[.14em] text-[var(--muted)]">{label}</div><div className={index === 3 ? "mt-1.5 font-medium text-[var(--danger)]" : "mt-1.5 font-medium"}>{value}</div></div>
                    ))}
                  </div>
                  <div className="mt-4 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent" />
                  <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[.16em] text-[var(--muted)]"><span>Flowboard</span><span>{ru ? "Маршрут 0/1" : "Route 0/1"}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
