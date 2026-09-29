"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Mail, Pencil, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useLanguage } from "@/components/language-provider";
import { getCurrentUser, updateCurrentUser } from "@/lib/auth-store";
import { useWorkspace } from "@/lib/workspace-store";

export default function ProfilePage() {
  const { language } = useLanguage();
  const { state } = useWorkspace();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, []);

  const tasks = state.boards.flatMap(board => board.columns.flatMap(column => column.tasks));
  const completed = state.boards.reduce((sum, board) => sum + (board.columns.find(column => column.id === "done")?.tasks.length || 0), 0);

  function save() {
    const nextName = name.trim();
    const nextEmail = email.trim().toLowerCase();
    if (!nextName || !nextEmail) return;
    updateCurrentUser({ name: nextName, email: nextEmail });
    setEditing(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl p-4 sm:p-7">
        <Link href="/app/overview" className="inline-flex items-center gap-2 text-xs text-[var(--muted)] hover:text-white"><ArrowLeft size={14}/>{language === "ru" ? "К обзору" : "Back to overview"}</Link>

        <section className="mt-5 overflow-hidden rounded-[30px] border border-white/8 bg-white/[.025]">
          <div className="relative h-36 overflow-hidden bg-[radial-gradient(circle_at_18%_10%,rgba(45,212,191,.18),transparent_22rem),linear-gradient(135deg,#0e1717,#0a0f10)]">
            <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:40px_40px]" />
          </div>
          <div className="relative p-5 pt-0 sm:p-7 sm:pt-0">
            <div className="-mt-10 flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <div className="grid h-20 w-20 place-items-center rounded-3xl border-4 border-[#0a0f10] bg-[var(--accent)] text-xl font-bold text-[#06211c]">{(name || "?").slice(0, 2).toUpperCase()}</div>
                <div className="pb-1"><h1 className="text-2xl font-semibold tracking-[-.03em]">{name || (language === "ru" ? "Новый пользователь" : "New user")}</h1><div className="mt-1 flex items-center gap-2 text-xs text-[var(--muted)]"><Mail size={12}/>{email || (language === "ru" ? "Почта не указана" : "No email")}</div></div>
              </div>
              <button type="button" onClick={() => setEditing(value => !value)} className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/[.025] px-3.5 py-2.5 text-xs text-[var(--muted)] hover:text-white"><Pencil size={14}/>{editing ? (language === "ru" ? "Закрыть" : "Close") : (language === "ru" ? "Изменить профиль" : "Edit profile")}</button>
            </div>

            {editing && <div className="mt-6 grid gap-4 rounded-2xl border border-white/8 bg-black/10 p-4 sm:grid-cols-2"><label className="grid gap-2 text-xs text-[var(--muted)]">{language === "ru" ? "Имя" : "Name"}<input value={name} onChange={event => setName(event.target.value)} className="h-11 rounded-xl border border-white/8 bg-white/[.025] px-3 text-sm text-white outline-none"/></label><label className="grid gap-2 text-xs text-[var(--muted)]">Email<input type="email" value={email} onChange={event => setEmail(event.target.value)} className="h-11 rounded-xl border border-white/8 bg-white/[.025] px-3 text-sm text-white outline-none"/></label><div className="sm:col-span-2 flex items-center justify-between gap-3"><span className="text-xs text-[var(--accent)]">{saved ? (language === "ru" ? "Профиль сохранён" : "Profile saved") : ""}</span><button type="button" onClick={save} className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-[#06211c]">{language === "ru" ? "Сохранить" : "Save"}</button></div></div>}

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <Stat icon={UserRound} label={language === "ru" ? "Доски" : "Boards"} value={state.boards.length}/>
              <Stat icon={CheckCircle2} label={language === "ru" ? "Завершено" : "Completed"} value={completed}/>
              <Stat icon={CheckCircle2} label={language === "ru" ? "Всего задач" : "Total cards"} value={tasks.length}/>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof UserRound; label: string; value: number }) {
  return <div className="rounded-2xl border border-white/8 bg-white/[.02] p-4"><div className="flex items-center justify-between text-xs text-[var(--muted)]"><span>{label}</span><Icon size={15} className="text-[var(--accent)]"/></div><div className="mt-3 text-2xl font-semibold">{value}</div></div>;
}