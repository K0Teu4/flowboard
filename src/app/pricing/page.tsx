"use client";

import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage } from "@/components/language-provider";

export default function PricingPage() {
  const { language } = useLanguage();
  const ru = language === "ru";
  const labels = ru
    ? {
        eyebrow: "Тарифы",
        title: "Начни бесплатно. Масштабируй, когда проект вырастет.",
        copy: "На старте Flowboard не ограничивает тебя оплатой. Сначала собери привычку работать на доске, затем подключим командные и расширенные возможности.",
        free: "Free",
        freeCopy: "Для личных проектов и первых рабочих пространств.",
        pro: "Pro",
        proCopy: "Для небольших команд и активной совместной работы.",
        soon: "Будет доступно после запуска биллинга",
        start: "Начать бесплатно",
        features: [
          "Kanban-доски и карточки",
          "Project Pulse",
          "Поиск и фильтры",
          "Дедлайны и чек-листы",
          "Локальное сохранение в demo-режиме",
        ],
        proFeatures: [
          "Всё из Free",
          "Командные workspace",
          "Realtime collaboration",
          "Расширенные роли",
          "Уведомления и activity",
        ],
      }
    : {
        eyebrow: "Pricing",
        title: "Start free. Scale when the project grows.",
        copy: "Flowboard is intentionally free to start. Build the habit first, then unlock team and advanced capabilities as the product matures.",
        free: "Free",
        freeCopy: "For personal projects and first workspaces.",
        pro: "Pro",
        proCopy: "For small teams and active collaboration.",
        soon: "Available when billing launches",
        start: "Start free",
        features: [
          "Kanban boards and cards",
          "Project Pulse",
          "Search and filters",
          "Deadlines and checklists",
          "Local persistence in demo mode",
        ],
        proFeatures: [
          "Everything in Free",
          "Team workspaces",
          "Realtime collaboration",
          "Advanced roles",
          "Notifications and activity",
        ],
      };

  return (
    <main className="shell min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Brand />
        <div className="flex items-center gap-2">
          <Link href="/" className="rounded-xl px-3 py-2 text-sm text-[var(--muted)] hover:text-white">{ru ? "Главная" : "Home"}</Link>
          <LanguageSwitcher compact />
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-14 lg:pt-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-[rgba(45,212,191,.06)] px-3 py-1.5 text-xs text-[var(--muted)]"><Sparkles size={14} className="text-[var(--accent)]" /> {labels.eyebrow}</div>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-.04em] sm:text-6xl">{labels.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">{labels.copy}</p>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <PricingCard title={labels.free} copy={labels.freeCopy} features={labels.features} action={labels.start} href="/auth/sign-up" />
          <PricingCard title={labels.pro} copy={labels.proCopy} features={labels.proFeatures} action={labels.soon} href="/auth/sign-up" disabled />
        </div>
        <div className="mt-7 flex items-center">
          
          <span className="text-xs text-[var(--muted)]">{ru ? "Биллинг появится после стабильного MVP." : "Billing will arrive after the stable MVP."}</span>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function PricingCard({ title, copy, features, action, href, disabled = false }: { title: string; copy: string; features: string[]; action: string; href: string; disabled?: boolean }) {
  return (
    <section className={`rounded-[28px] border p-6 sm:p-7 ${disabled ? "border-white/8 bg-white/[.02]" : "border-[var(--accent)]/25 bg-[rgba(45,212,191,.045)]"}`}>
      <div className="text-2xl font-semibold">{title}</div>
      <p className="mt-2 min-h-12 text-sm leading-6 text-[var(--muted)]">{copy}</p>
      <div className="mt-7 grid gap-3">{features.map(feature => <div key={feature} className="flex items-start gap-2 text-sm"><Check size={15} className="mt-0.5 shrink-0 text-[var(--accent)]" />{feature}</div>)}</div>
      {disabled ? <div className="mt-8 rounded-xl border border-white/8 px-4 py-3 text-center text-xs text-[var(--muted)]">{action}</div> : <Link href={href} className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3 text-xs font-semibold text-[#06211c]">{action}<ArrowRight size={14}/></Link>}
    </section>
  );
}
