"use client";

import { Check, LogOut, Palette, RotateCcw, ShieldCheck, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { deleteLocalAccount, getCurrentUser, updateCurrentUser } from "@/lib/auth-store";
import { useWorkspace } from "@/lib/workspace-store";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const { language, copy } = useLanguage();
  const { resetWorkspace } = useWorkspace();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, []);

  const dirty = (() => {
    const user = getCurrentUser();
    return Boolean(user && (name.trim() !== user.name || email.trim().toLowerCase() !== user.email));
  })();

  function saveProfile() {
    const nextName = name.trim();
    const nextEmail = email.trim().toLowerCase();
    if (!nextName || !nextEmail) return;
    updateCurrentUser({ name: nextName, email: nextEmail });
    setName(nextName);
    setEmail(nextEmail);
    setNotice(language === "ru" ? "Профиль сохранён" : "Profile saved");
    window.setTimeout(() => setNotice(""), 1800);
  }

  function deleteAccount() {
    resetWorkspace();
    deleteLocalAccount();
    router.replace("/");
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl p-4 sm:p-7">
        <div>
          <div className="text-xs uppercase tracking-[.18em] text-[var(--muted)]">Flowboard</div>
          <h1 className="mt-1 text-2xl font-semibold">{language === "ru" ? "Настройки" : "Settings"}</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {language === "ru" ? "Профиль, язык и данные рабочего пространства." : "Profile, language and workspace data."}
          </p>
        </div>

        <div className="mt-7 grid gap-4">
          <section className="rounded-3xl border border-white/8 bg-white/[.025] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--accent)] text-sm font-bold text-[#06211c]">
                {(name || "?").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="font-medium">{language === "ru" ? "Профиль" : "Profile"}</h2>
                <p className="mt-1 text-xs text-[var(--muted)]">{email || (language === "ru" ? "Нет почты" : "No email")}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-xs text-[var(--muted)]">
                <span>{copy.name}</span>
                <input value={name} onChange={event => setName(event.target.value)} className="focus-ring h-11 rounded-xl border border-white/8 bg-black/10 px-3 text-sm text-white outline-none" />
              </label>
              <label className="grid gap-2 text-xs text-[var(--muted)]">
                <span>{copy.email}</span>
                <input type="email" value={email} onChange={event => setEmail(event.target.value)} className="focus-ring h-11 rounded-xl border border-white/8 bg-black/10 px-3 text-sm text-white outline-none" />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button type="button" disabled={!dirty} onClick={saveProfile} className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-[#06211c] disabled:cursor-not-allowed disabled:opacity-40">
                {notice ? <Check size={14} /> : <UserRound size={14} />}
                {notice || (language === "ru" ? "Сохранить профиль" : "Save profile")}
              </button>
              {!dirty && <span className="text-[11px] text-[var(--muted)]">{language === "ru" ? "Изменений нет" : "No unsaved changes"}</span>}
            </div>
          </section>

          <section className="rounded-3xl border border-white/8 bg-white/[.025] p-5 sm:p-6">
            <div className="flex items-center gap-2"><Palette size={17} className="text-[var(--accent)]" /><h2 className="font-medium">{language === "ru" ? "Интерфейс" : "Interface"}</h2></div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <div><div className="text-sm">{copy.language}</div><div className="mt-1 text-xs text-[var(--muted)]">{language === "ru" ? "Язык интерфейса сохраняется в этом браузере." : "Interface language is stored in this browser."}</div></div>
              <LanguageSwitcher />
            </div>
            <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/7 bg-black/10 p-4">
              <div><div className="text-sm">{language === "ru" ? "Тема" : "Theme"}</div><div className="mt-1 text-xs text-[var(--muted)]">{language === "ru" ? "Тёмная тема оптимизирована для работы с досками." : "Dark theme is tuned for focused board work."}</div></div>
              <span className="rounded-lg bg-white/6 px-3 py-1.5 text-[11px] text-white">{language === "ru" ? "Тёмная" : "Dark"}</span>
            </div>
          </section>

          <section className="rounded-3xl border border-[rgba(255,113,113,.15)] bg-[rgba(255,113,113,.025)] p-5 sm:p-6">
            <div className="flex items-center gap-2"><RotateCcw size={17} className="text-[var(--danger)]" /><h2 className="font-medium">{language === "ru" ? "Данные аккаунта" : "Account data"}</h2></div>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-[var(--muted)]">{language === "ru" ? "Удаление аккаунта удалит локальный профиль и все доски этого профиля на этом устройстве." : "Deleting the account removes the local profile and all boards belonging to this profile on this device."}</p>
            <button type="button" onClick={() => setDeleteOpen(true)} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[rgba(255,113,113,.2)] px-4 py-2.5 text-xs text-[var(--danger)]"><LogOut size={14} />{language === "ru" ? "Удалить локальный аккаунт" : "Delete local account"}</button>
          </section>
        </div>
      </div>

      {deleteOpen && <div className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
        <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[var(--modal)] p-5 shadow-2xl">
          <div className="flex items-start justify-between gap-4"><div><div className="grid h-9 w-9 place-items-center rounded-xl bg-[rgba(255,113,113,.08)]"><ShieldCheck size={17} className="text-[var(--danger)]" /></div><h2 className="mt-4 font-medium">{language === "ru" ? "Удалить аккаунт?" : "Delete account?"}</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{language === "ru" ? "Это удалит профиль, сессию и локальные доски. Действие нельзя отменить." : "This removes the profile, session and local boards. This cannot be undone."}</p></div><button type="button" onClick={() => setDeleteOpen(false)} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] hover:bg-white/5"><X size={15} /></button></div>
          <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setDeleteOpen(false)} className="rounded-xl border border-white/8 px-4 py-2.5 text-xs text-[var(--muted)]">{copy.cancel}</button><button type="button" onClick={deleteAccount} className="rounded-xl bg-[var(--danger)] px-4 py-2.5 text-xs font-semibold text-white">{language === "ru" ? "Удалить аккаунт" : "Delete account"}</button></div>
        </div>
      </div>}
    </AppShell>
  );
}
