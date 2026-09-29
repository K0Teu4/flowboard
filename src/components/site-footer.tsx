"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";

export function SiteFooter() {
  const { copy } = useLanguage();
  const productLinks = copy.footerProductLinks.split("|");
  const resourceLinks = copy.footerResourceLinks.split("|");

  return (
    <footer className="relative border-t border-white/8 bg-black/10">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_.8fr_.8fr]">
          <div>
            <Brand />
            <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--muted)]">{copy.footerTagline}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/demo" className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/[.025] px-3 py-2 text-xs text-[var(--muted)] transition-soft hover:bg-white/[.05] hover:text-[var(--text)]">
                {copy.footerDemo}<ArrowUpRight size={14} />
              </Link>
              <LanguageSwitcher />
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--text)]">{copy.footerProduct}</div>
            <div className="mt-4 grid gap-3 text-sm text-[var(--muted)]">
              <a href="#features" className="hover:text-[var(--text)]">{productLinks[0]}</a>
              <a href="#pulse" className="hover:text-[var(--text)]">{productLinks[1]}</a>
              <Link href="/demo" className="hover:text-[var(--text)]">{productLinks[2]}</Link>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--text)]">{copy.footerResources}</div>
            <div className="mt-4 grid gap-3 text-sm text-[var(--muted)]">
              <a href="https://github.com/K0Teu4/flowboard" target="_blank" rel="noreferrer" className="hover:text-[var(--text)]">{resourceLinks[0]}</a>
              <a href="https://github.com/K0Teu4/flowboard/tree/main/docs" target="_blank" rel="noreferrer" className="hover:text-[var(--text)]">{resourceLinks[1]}</a>
              <a href="https://github.com/K0Teu4/flowboard/actions" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-[var(--text)]"><CheckCircle2 size={14} className="text-[var(--success)]" />{copy.footerStatus}</a>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/8 pt-5 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Flowboard</span>
          <span>{copy.footerVersion}</span>
        </div>
      </div>
    </footer>
  );
}
