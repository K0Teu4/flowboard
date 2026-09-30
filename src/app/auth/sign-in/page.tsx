"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { signInUser } from "@/lib/auth-store";
import { sitePath } from "@/lib/site-path";

export default function SignInPage() {
  const router = useRouter();
  const { copy, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!emailValid) {
      setError(language === "ru" ? "Введи корректный адрес электронной почты." : "Enter a valid email address.");
      return;
    }
    if (!password) {
      setError(language === "ru" ? "Введи пароль." : "Enter your password.");
      return;
    }

    setSubmitting(true);
    try {
      const ok = await signInUser(email, password);
      if (!ok) {
        setError(copy.invalidCredentials);
        return;
      }
      window.location.replace(sitePath("/app/overview/"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-10 sm:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(45,212,191,.12),transparent_28rem),radial-gradient(circle_at_100%_100%,rgba(99,102,241,.08),transparent_24rem)]" />
      <div className="relative w-full max-w-md">
        <div className="mb-7 flex items-center justify-between"><Brand /><LanguageSwitcher compact /></div>
        <div className="rounded-[30px] border border-white/8 bg-[rgba(13,19,20,.88)] p-7 shadow-[0_30px_100px_rgba(0,0,0,.34)] backdrop-blur-xl sm:p-8">
          <h1 className="text-2xl font-semibold tracking-[-.03em]">{copy.welcomeBack}</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy.signInCopy}</p>

          <form className="mt-7 grid gap-4" onSubmit={submit} noValidate>
            <label className="grid gap-2 text-sm">
              <span>{copy.email}</span>
              <input
                autoFocus
                value={email}
                onChange={event => setEmail(event.target.value)}
                className={"focus-ring h-11 rounded-xl border bg-white/[.025] px-3 outline-none focus:border-[var(--accent)] " + (email && !emailValid ? "border-[var(--danger)]/50" : "border-white/9")}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="name@example.com"
              />
              <span className={email && !emailValid ? "text-[11px] text-[var(--danger)]" : "text-[11px] text-[var(--muted)]"}>
                {email && !emailValid ? (language === "ru" ? "Используй формат name@example.com" : "Use the format name@example.com") : (language === "ru" ? "Например: name@example.com" : "For example: name@example.com")}
              </span>
            </label>

            <label className="grid gap-2 text-sm">
              <span>{copy.password}</span>
              <div className="relative">
                <input value={password} onChange={event => setPassword(event.target.value)} className="focus-ring h-11 w-full rounded-xl border border-white/9 bg-white/[.025] px-3 pr-11 outline-none focus:border-[var(--accent)]" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(value => !value)} className="absolute right-1 top-1 grid h-9 w-9 place-items-center rounded-lg text-[var(--muted)] hover:bg-white/5 hover:text-white" aria-label={showPassword ? (language === "ru" ? "Скрыть пароль" : "Hide password") : (language === "ru" ? "Показать пароль" : "Show password")}>{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button>
              </div>
            </label>

            <button type="submit" disabled={submitting} className="mt-2 flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] text-sm font-semibold text-[#06211c] transition-soft hover:bg-[var(--accent-2)] disabled:cursor-wait disabled:opacity-60">
              {submitting ? (language === "ru" ? "Входим…" : "Signing in…") : copy.signInButton}
              {!submitting && <ArrowRight size={15} />}
            </button>
          </form>

          {error && <div className="mt-4 rounded-xl border border-[rgba(255,113,113,.18)] bg-[rgba(255,113,113,.05)] px-3 py-2 text-xs text-[var(--danger)]">{error}</div>}
          <div className="mt-6 flex items-start gap-2 rounded-xl border border-white/8 bg-white/[.02] p-3 text-xs leading-5 text-[var(--muted)]"><ShieldCheck size={14} className="mt-0.5 shrink-0 text-[var(--accent)]" />{language === "ru" ? "Сессия сохраняется отдельно от профиля и не удаляет твои доски при выходе." : "The session is stored separately from your profile, so signing out does not delete your boards."}</div>
          <div className="mt-6 text-center text-sm text-[var(--muted)]">{copy.noAccount} <Link href="/auth/sign-up" className="text-white hover:underline">{copy.createWorkspaceButton}</Link></div>
        </div>
      </div>
    </main>
  );
}
