"use client";

import { Link2, ShieldCheck, Users, X, Copy, Check } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useLanguage } from "@/components/language-provider";
import { useWorkspace } from "@/lib/workspace-store";
import { sitePath } from "@/lib/site-path";

export default function MembersPage() {
  const { language } = useLanguage();
  const { state } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const ru = language === "ru";

  function createInviteLink() {
    const token = typeof window !== "undefined" && window.crypto?.randomUUID ? window.crypto.randomUUID() : Math.random().toString(36).slice(2);
    const url = sitePath("/join/?invite=" + encodeURIComponent(token));
    navigator.clipboard?.writeText(window.location.origin + url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl p-4 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[.16em] text-[var(--muted)]">Flowboard</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-.04em]">{ru ? "Участники" : "Members"}</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">
              {ru ? "Команда добавляется только после приглашения. В новом рабочем пространстве нет случайных участников." : "People appear here only after they join. New workspaces start with no placeholder members."}
            </p>
          </div>
          <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[#06211c]">
            <Link2 size={15} /> {ru ? "Пригласить" : "Invite"}
          </button>
        </div>

        <section className="mt-7 rounded-[30px] border border-white/8 bg-white/[.025] p-7 sm:p-9">
          {state.members.length ? (
            <div className="grid gap-3">
              {state.members.map(member => (
                <div key={member.name} className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-black/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-white/7 text-xs font-semibold">{member.initials}</div>
                    <div><div className="font-medium">{member.name}</div><div className="mt-1 text-xs text-[var(--muted)]">{member.role}</div></div>
                  </div>
                  <span className="text-xs text-[var(--muted)]">{member.status === "online" ? (ru ? "В сети" : "Online") : (ru ? "Не в сети" : "Offline")}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-xl text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[rgba(45,212,191,.08)]"><Users size={28} className="text-[var(--accent)]" /></div>
              <h2 className="mt-5 text-xl font-semibold">{ru ? "Команда пока пустая" : "Your team is empty"}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{ru ? "Пригласи коллегу, когда будешь готов. Реальная ссылка будет привязана к общему рабочему пространству после подключения Supabase." : "Invite teammates when you're ready. The real shareable invitation will connect to the shared workspace once Supabase is connected."}</p>
              <button type="button" onClick={() => setOpen(true)} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/[.025] px-4 py-2.5 text-sm text-white hover:bg-white/[.05]"><Link2 size={15}/>{ru ? "Создать ссылку-приглашение" : "Create invite link"}</button>
            </div>
          )}
        </section>
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/65 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-[30px] border border-white/10 bg-[rgba(13,19,20,.96)] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div><div className="grid h-10 w-10 place-items-center rounded-2xl bg-[rgba(45,212,191,.08)]"><ShieldCheck size={18} className="text-[var(--accent)]"/></div><h2 className="mt-5 text-xl font-semibold">{ru ? "Приглашение команды" : "Invite your team"}</h2></div>
              <button type="button" onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] hover:bg-white/5"><X size={15}/></button>
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{ru ? "Создай персональную ссылку. Сейчас приложение работает без серверной БД, поэтому участники ещё не синхронизируются между разными устройствами." : "Create a shareable link. The current build is local-only, so members are not synchronized between different devices yet."}</p>
            <button type="button" onClick={createInviteLink} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] py-3 text-sm font-semibold text-[#06211c]">{copied ? <Check size={15}/> : <Copy size={15}/>} {copied ? (ru ? "Ссылка скопирована" : "Link copied") : (ru ? "Скопировать ссылку" : "Copy link")}</button>
            <div className="mt-4 rounded-xl border border-white/8 bg-black/10 p-3 text-[11px] leading-5 text-[var(--muted)]">{ru ? "После подключения Supabase эта ссылка будет создавать полноценное приглашение в конкретное рабочее пространство." : "After Supabase is connected, this link will create a real invitation to the specific workspace."}</div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
