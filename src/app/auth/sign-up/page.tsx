"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Eye, EyeOff, Sparkles } from "lucide-react";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { readStoredUser, registerUser } from "@/lib/auth-store";
import { sitePath } from "@/lib/site-path";

export default function SignUpPage() {
  const { copy, language } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const passwordRules = useMemo(() => ({
    length: password.length >= 8,
    letter: /[A-Za-zА-Яа-яЁё]/.test(password),
    number: /\d/.test(password),
  }), [password]);
  const passwordValid = passwordRules.length && passwordRules.letter && passwordRules.number;
  const confirmValid = passwordConfirm.length > 0 && password === passwordConfirm;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!name.trim()) return setError(language === "ru" ? "Укажи имя." : "Enter your name.");
    if (!emailValid) return setError(language === "ru" ? "Проверь адрес электронной почты." : "Check your email address.");
    if (!passwordValid) return setError(language === "ru" ? "Пароль не соответствует требованиям." : "Password does not meet the requirements.");
    if (!confirmValid) return setError(language === "ru" ? "Пароли не совпадают." : "Passwords do not match.");

    const existing = readStoredUser();
    if (existing?.email === email.trim().toLowerCase()) {
      setError(copy.accountExists);
      return;
    }

    setSubmitting(true);
    try {
      await registerUser(name, email, password);
      window.location.replace(sitePath("/app/overview/"));
    } finally {
      setSubmitting(false);
    }
  }

  const rule = (ok: boolean, text: string) => (
    <div className={ok ? "flex items-center gap-2 text-[var(--success)]" : "flex items-center gap-2 text-[var(--muted)]"}>
      <span className={ok ? "grid h-4 w-4 place-items-center rounded-full bg-[rgba(69,223,170,.12)]" : "grid h-4 w-4 place-items-center rounded-full border border-white/10"}>
        {ok ? <Check size={10} /> : null}
      </span>
      <span>{text}</span>
    </div>
  );

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-10 sm:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(45,212,191,.12),transparent_28rem),radial-gradient(circle_at_0%_100%,rgba(99,102,241,.08),transparent_24rem)]" />
      <div className="relative w-full max-w-md">
        <div className="mb-7 flex items-center justify-between"><Brand /><LanguageSwitcher compact /></div>
        <div className="rounded-[30px] border border-white/8 bg-[rgba(13,19,20,.88)] p-7 shadow-[0_30px_100px_rgba(0,0,0,.34)] backdrop-blur-xl sm:p-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-[rgba(45,212,191,.06)] px-3 py-1.5 text-xs text-[var(--muted)]"><Sparkles size={14} className="text-[var(--accent)]" /> Flowboard</div>
          <h1 className="text-2xl font-semibold tracking-[-.03em]">{copy.createWorkspace}</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy.createWorkspaceCopy}</p>

          <form className="mt-7 grid gap-4" onSubmit={submit} noValidate>
            <label className="grid gap-2 text-sm">
              <span>{copy.name}</span>
              <input autoFocus value={name} onChange={event => setName(event.target.value)} className="focus-ring h-11 rounded-xl border border-white/9 bg-white/[.025] px-3 outline-none focus:border-[var(--accent)]" placeholder={language === "ru" ? "Как тебя зовут?" : "Your name"} />
            </label>

            <label className="grid gap-2 text-sm">
              <span>{copy.email}</span>
              <input value={email} onChange={event => setEmail(event.target.value)} className={"focus-ring h-11 rounded-xl border bg-white/[.025] px-3 outline-none focus:border-[var(--accent)] " + (email && !emailValid ? "border-[var(--danger)]/50" : "border-white/9")} type="email" inputMode="email" autoComplete="email" placeholder="name@example.com" />
              <span className={email && !emailValid ? "text-[11px] text-[var(--danger)]" : "text-[11px] text-[var(--muted)]"}>
                {email && !emailValid ? (language === "ru" ? "Нужен корректный адрес в формате name@example.com" : "Use a valid address such as name@example.com") : (language === "ru" ? "Например: name@example.com" : "For example: name@example.com")}
              </span>
            </label>

            <label className="grid gap-2 text-sm">
              <span>{copy.password}</span>
              <div className="relative">
                <input value={password} onChange={event => setPassword(event.target.value)} onFocus={() => setPasswordFocused(true)} onBlur={() => setPasswordFocused(false)} className="focus-ring h-11 w-full rounded-xl border border-white/9 bg-white/[.025] px-3 pr-11 outline-none focus:border-[var(--accent)]" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? (language === "ru" ? "Скрыть пароль" : "Hide password") : (language === "ru" ? "Показать пароль" : "Show password")} className="absolute right-1 top-1 grid h-9 w-9 place-items-center rounded-lg text-[var(--muted)] hover:bg-white/5 hover:text-white">{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button>
              </div>
              {passwordFocused && (
                <div className="rounded-xl border border-white/8 bg-white/[.02] p-3 text-[11px]">
                  <div className="mb-2 text-[var(--muted)]">{language === "ru" ? "Пароль должен содержать:" : "Password requirements:"}</div>
                  <div className="grid gap-1.5">{rule(passwordRules.length, language === "ru" ? "не меньше 8 символов" : "at least 8 characters")}{rule(passwordRules.letter, language === "ru" ? "хотя бы одну букву" : "at least one letter")}{rule(passwordRules.number, language === "ru" ? "хотя бы одну цифру" : "at least one number")}</div>
                </div>
              )}
            </label>

            <label className="grid gap-2 text-sm">
              <span>{language === "ru" ? "Подтверждение пароля" : "Confirm password"}</span>
              <div className="relative">
                <input value={passwordConfirm} onChange={event => setPasswordConfirm(event.target.value)} className={"focus-ring h-11 w-full rounded-xl border bg-white/[.025] px-3 pr-11 outline-none focus:border-[var(--accent)] " + (passwordConfirm && !confirmValid ? "border-[var(--danger)]/50" : "border-white/9")} type={showConfirm ? "text" : "password"} autoComplete="new-password" placeholder="••••••••" />
                <button type="button" onClick={() => setShowConfirm(value => !value)} aria-label={showConfirm ? (language === "ru" ? "Скрыть подтверждение" : "Hide confirmation") : (language === "ru" ? "Показать подтверждение" : "Show confirmation")} className="absolute right-1 top-1 grid h-9 w-9 place-items-center rounded-lg text-[var(--muted)] hover:bg-white/5 hover:text-white">{showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}</button>
              </div>
              {passwordConfirm && <span className={"text-[11px] " + (confirmValid ? "text-[var(--success)]" : "text-[var(--danger)]")}>{confirmValid ? (language === "ru" ? "Пароли совпадают" : "Passwords match") : (language === "ru" ? "Пароли не совпадают" : "Passwords do not match")}</span>}
            </label>

            <button type="submit" disabled={submitting} className="mt-2 flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] text-sm font-semibold text-[#06211c] transition-soft hover:bg-[var(--accent-2)] disabled:cursor-wait disabled:opacity-60">
              {submitting ? (language === "ru" ? "Создаём пространство…" : "Creating workspace…") : copy.createWorkspaceButton}
              {!submitting && <ArrowRight size={15} />}
            </button>
          </form>

          {error && <div className="mt-4 rounded-xl border border-[rgba(255,113,113,.18)] bg-[rgba(255,113,113,.05)] px-3 py-2 text-xs text-[var(--danger)]">{error}</div>}
          <div className="mt-6 grid gap-2 text-xs text-[var(--muted)]">
            <span className="flex items-center gap-2"><Check size={13} className="text-[var(--success)]" /> {language === "ru" ? "Пустое рабочее пространство" : "Fresh workspace"}</span>
            <span className="flex items-center gap-2"><Check size={13} className="text-[var(--success)]" /> {copy.visualWorkflow}</span>
            <span className="flex items-center gap-2"><Check size={13} className="text-[var(--success)]" /> {language === "ru" ? "Профиль сохраняется" : "Profile is saved"}</span>
          </div>
          <p className="mt-5 border-t border-white/8 pt-4 text-xs leading-5 text-[var(--muted)]">{copy.authNote}</p>
          <div className="mt-5 text-center text-sm text-[var(--muted)]">{copy.alreadyAccount} <Link href="/auth/sign-in" className="text-white hover:underline">{copy.signIn}</Link></div>
        </div>
      </div>
    </main>
  );
}
