"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";

export default function SignInPage() {
  const router = useRouter();
  const { copy } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const storedEmail = window.localStorage.getItem("flowboard-user-email");
    const storedHash = window.localStorage.getItem("flowboard-password-hash");
    const bytes = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    const hash = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2,"0")).join("");
    if (!storedEmail || !storedHash || storedEmail !== email.trim().toLowerCase() || storedHash !== hash) { setError("Неверная почта или пароль."); return; }
    window.localStorage.setItem("flowboard-account", "created");
    router.push("/app/overview");
  }

  return (
    <main className="grid min-h-screen place-items-center px-5 py-10 sm:py-12">
      <div className="w-full max-w-md">
        <div className="mb-7 flex items-center justify-between"><Brand /><LanguageSwitcher compact /></div>
        <div className="rounded-[30px] border border-white/8 bg-white/[.025] p-7 shadow-[0_30px_90px_rgba(0,0,0,.24)] sm:p-8">
          <h1 className="text-2xl font-semibold tracking-[-.03em]">{copy.welcomeBack}</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy.signInCopy}</p>
          <form className="mt-7 grid gap-4" onSubmit={submit}>
            <label className="grid gap-2 text-sm"><span>{copy.email}</span><input required value={email} onChange={(event) => setEmail(event.target.value)} className="focus-ring h-11 rounded-xl border border-white/9 bg-white/[.025] px-3 outline-none placeholder:text-white/25 focus:border-[var(--accent)]" type="email" placeholder="you@example.com" /></label>
            <label className="grid gap-2 text-sm"><span>{copy.password}</span><input required value={password} onChange={(event) => setPassword(event.target.value)} className="focus-ring h-11 rounded-xl border border-white/9 bg-white/[.025] px-3 outline-none placeholder:text-white/25 focus:border-[var(--accent)]" type="password" placeholder="••••••••" /></label>
            <button type="submit" className="mt-2 flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] text-sm font-semibold text-[#06211c] transition-soft hover:bg-[var(--accent-2)]">{copy.signInButton} <ArrowRight size={15} /></button>
          </form>
          {error && <div className="mt-4 rounded-xl border border-[rgba(255,113,113,.18)] bg-[rgba(255,113,113,.05)] px-3 py-2 text-xs text-[var(--danger)]">{error}</div>}
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-white/8 bg-white/[.02] p-3 text-xs text-[var(--muted)]"><ShieldCheck size={14} className="text-[var(--accent)]" /> Аккаунт проверяется по локально сохранённым данным до подключения Supabase.</div>
          <div className="mt-6 text-center text-sm text-[var(--muted)]">{copy.noAccount} <Link href="/auth/sign-up" className="text-white hover:underline">{copy.createWorkspaceButton}</Link></div>
        </div>
      </div>
    </main>
  );
}
