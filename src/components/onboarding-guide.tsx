"use client";

import Link from "next/link";
import { ArrowRight, Check, ClipboardList, Layers3, MousePointer2, Users, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { sitePath } from "@/lib/site-path";

const KEY = "flowboard-onboarding-v1";

export function OnboardingGuide() {
  const { language } = useLanguage();
  const [open, setOpen] = useState(() => {
    try { return window.localStorage.getItem(KEY) !== "done"; } catch { return false; }
  });
  const [step, setStep] = useState(0);
  const ru = language === "ru";

  if (!open) return null;

  const steps = [
    {
      icon: Layers3,
      title: ru ? "Добро пожаловать в Flowboard" : "Welcome to Flowboard",
      text: ru ? "Здесь ты управляешь проектами через доски, списки и карточки. Начнём с пустого рабочего пространства." : "Manage projects with boards, lists and cards. You start with a clean workspace.",
    },
    {
      icon: ClipboardList,
      title: ru ? "Создай первую доску" : "Create your first board",
      text: ru ? "Открой «Доски», создай проект и выбери шаблон: пустой, продуктовый, контент или личный." : "Open Boards, create a project and choose a template: blank, product, content or personal.",
      href: "/app/boards",
      cta: ru ? "Открыть доски" : "Open boards",
    },
    {
      icon: MousePointer2,
      title: ru ? "Работай с карточками" : "Work with cards",
      text: ru ? "Добавляй карточки, перетаскивай их между списками, меняй порядок и открывай карточку для сроков, приоритета, участников, чек-листа и комментариев." : "Add cards, drag them between lists, reorder them, and open a card to edit dates, priority, members, checklists and comments.",
    },
    {
      icon: Users,
      title: ru ? "Команда появится после приглашения" : "Your team appears after an invite",
      text: ru ? "Новое рабочее пространство не содержит случайных участников. Реальные приглашения по ссылке подключим вместе с общей базой данных." : "A new workspace contains no placeholder members. Real shareable invitations will arrive with the shared backend.",
    },
  ];

  const current = steps[step];
  const Icon = current.icon;

  function finish() {
    try { window.localStorage.setItem(KEY, "done"); } catch {}
    setOpen(false);
  }

  return (
    <div className="fixed inset-0 z-[200] grid place-items-center bg-black/65 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg overflow-hidden rounded-[30px] border border-white/10 bg-[rgba(13,19,20,.96)] shadow-[0_35px_120px_rgba(0,0,0,.5)]">
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <div className="flex items-center gap-2 text-xs text-[var(--muted)]"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[rgba(45,212,191,.09)]"><Icon size={14} className="text-[var(--accent)]" /></span>Flowboard · {ru ? "Быстрый старт" : "Quick start"}</div>
          <button type="button" onClick={finish} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] hover:bg-white/5 hover:text-white" aria-label={ru ? "Закрыть" : "Close"}><X size={15}/></button>
        </div>

        <div className="p-6 sm:p-7">
          <div className="flex items-center gap-1.5">{steps.map((_, index) => <span key={index} className={index <= step ? "h-1.5 flex-1 rounded-full bg-[var(--accent)]" : "h-1.5 flex-1 rounded-full bg-white/8"} />)}</div>
          <div className="mt-8">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[rgba(45,212,191,.08)]"><Icon size={20} className="text-[var(--accent)]"/></div>
            <h2 className="mt-5 text-2xl font-semibold tracking-[-.03em]">{current.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{current.text}</p>
          </div>

          {current.href && <Link href={current.href} onClick={finish} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[var(--accent)]/20 bg-[rgba(45,212,191,.05)] px-3.5 py-2.5 text-xs font-medium text-white">{current.cta}<ArrowRight size={14}/></Link>}

          <div className="mt-8 flex items-center justify-between gap-3">
            <span className="text-xs text-[var(--muted)]">{step + 1} / {steps.length}</span>
            <div className="flex gap-2">
              {step > 0 && <button type="button" onClick={() => setStep(value => value - 1)} className="rounded-xl border border-white/8 px-4 py-2.5 text-xs text-[var(--muted)] hover:text-white">{ru ? "Назад" : "Back"}</button>}
              {step < steps.length - 1 ? (
                <button type="button" onClick={() => setStep(value => value + 1)} className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-[#06211c]">{ru ? "Дальше" : "Next"}<ArrowRight size={14}/></button>
              ) : (
                <button type="button" onClick={finish} className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-[#06211c]"><Check size={14}/>{ru ? "Понятно" : "Got it"}</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
