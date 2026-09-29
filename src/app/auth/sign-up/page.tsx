"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";

export default function SignUpPage() {
  const router = useRouter();
  const { copy } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || password.length < 6) { setError("Заполни все поля. Пароль — минимум 6 символов."); return; }
    const bytes = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    const hash = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2,"0")).join("");
    window.localStorage.setItem("flowboard-account", "created");
    window.localStorage.setItem("flowboard-user-name", name.trim());
    window.localStorage.setItem("flowboard-user-email", email.trim().toLowerCase());
    window.localStorage.setItem("flowboard-password-hash", hash);
    router.push("/app/overview");
  }

  return (
    <main className="grid min-h-screen place-items-center px-5 py-10 sm:py-12">
      <div className="w-full max-w-md">
        <div className="mb-7 flex items-center justify-between"><Brand /><LanguageSwitcher compact /></div>
        <div className="rounded-[30px] border border-white/8 bg-white/[.025] p-7 shadow-[0_30px_90px_rgba(0,0,0,.24)] sm:p-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-[rgba(45,212,191,.06)] px-3 py-1.5 text-xs text-[var(--muted)]"><Sparkles size={14} className="text-[var(--accent)]" /> Flowboard</div>
          <h1 className="text-2xl font-semibold tracking-[-.03em]">{copy.createWorkspace}</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy.createWorkspaceCopy}</p>
          <form className="mt-7 grid gap-4" onSubmit={submit}>
            <label className="grid gap-2 text-sm"><span>{copy.name}</span><input required value={name} onChange={(event) => setName(event.target.value)} className="focus-ring h-11 rounded-xl border border-white/9 bg-white/[.025] px-3 outline-none focus:border-[var(--accent)]" placeholder="Dmitry" /></label>
            <label className="grid gap-2 text-sm"><span>{copy.email}</span><input required value={email} onChange={(event) => setEmail(event.target.value)} className="focus-ring h-11 rounded-xl border border-white/9 bg-white/[.025] px-3 outline-none focus:border-[var(--accent)]" type="email" placeholder="you@example.com" /></label>
            <label className="grid gap-2 text-sm"><span>{copy.password}</span><input required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="focus-ring h-11 rounded-xl border border-white/9 bg-white/[.025] px-3 outline-none focus:border-[var(--accent)]" type="password" placeholder="••••••••" /></label>
            <button type="submit" className="mt-2 flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] text-sm font-semibold text-[#06211c] transition-soft hover:bg-[var(--accent-2)]">{copy.createWorkspaceButton} <ArrowRight size={15} /></button>
          </form>
          {error && <div className="rounded-xl border border-[rgba(255,113,113,.18)] bg-[rgba(255,113,113,.05)] px-3 py-2 text-xs text-[var(--danger)]">{error}</div>}
          <div className="mt-6 grid gap-2 text-xs text-[var(--muted)]"><span className="flex items-center gap-2"><Check size={13} className="text-[var(--success)]" /> {copy.realtimeTitle}</span><span className="flex items-center gap-2"><Check size={13} className="text-[var(--success)]" /> {copy.visualWorkflow}</span><span className="flex items-center gap-2"><Check size={13} className="text-[var(--success)]" /> {copy.pulseTitle}</span></div>
          <p className="mt-5 border-t border-white/8 pt-4 text-xs leading-5 text-[var(--muted)]">{copy.authNote}</p>
          <div className="mt-5 text-center text-sm text-[var(--muted)]">{copy.alreadyAccount} <Link href="/auth/sign-in" className="text-white hover:underline">{copy.signIn}</Link></div>
        </div>
      </div>
    </main>
  );
}
