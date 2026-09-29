"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, toggleLanguage, copy } = useLanguage();
  return (
    <button
      type="button"
      onClick={toggleLanguage}
      title={`${copy.language}: ${language === "ru" ? copy.languageRussian : copy.languageEnglish}`}
      className={`inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/[.025] text-xs text-[var(--muted)] transition-soft hover:border-white/15 hover:bg-white/[.05] hover:text-[var(--text)] ${compact ? "h-9 px-2.5" : "px-3 py-2"}`}
      aria-label={copy.language}
    >
      <Languages size={14} />
      <span>{language === "ru" ? "RU" : "EN"}</span>
    </button>
  );
}
