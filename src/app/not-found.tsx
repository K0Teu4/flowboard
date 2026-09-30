import Link from "next/link";
import { ArrowLeft, Compass, Radio } from "lucide-react";
import { Brand } from "@/components/brand";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bg)] px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,.14),transparent_24rem),radial-gradient(circle_at_80%_30%,rgba(99,102,241,.11),transparent_28rem)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.026)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.026)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col">
        <header className="flex items-center justify-between py-6"><Brand /><span className="rounded-full border border-white/8 bg-white/[.025] px-3 py-1.5 text-[10px] uppercase tracking-[.18em] text-[var(--muted)]">404</span></header>
        <div className="flex flex-1 items-center py-16">
          <div className="grid w-full gap-12 lg:grid-cols-[1fr_.8fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-[rgba(45,212,191,.05)] px-3 py-1.5 text-xs text-[var(--muted)]"><Radio size={14} className="text-[var(--accent)]" /> Сигнал потерян</div>
              <div className="mt-6 text-[clamp(7rem,18vw,13rem)] font-semibold leading-[.78] tracking-[-.09em] text-white/[.08]">404</div>
              <h1 className="mt-4 max-w-lg text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Похоже, эта доска больше не существует.</h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)]">Адрес мог устареть, доску могли удалить, или ссылка указывает не туда. Вернись в Flowboard и продолжи работу с актуального места.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-[#06211c]"><ArrowLeft size={14} /> На главную</Link>
                <Link href="/app/boards" className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/[.025] px-4 py-2.5 text-xs text-[var(--muted)] hover:text-white"><Compass size={14} /> К доскам</Link>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute inset-6 rounded-full bg-[rgba(45,212,191,.08)] blur-3xl" />
              <div className="relative aspect-square rounded-[34px] border border-white/10 bg-[rgba(13,19,20,.78)] p-5 shadow-[0_30px_100px_rgba(0,0,0,.38)] backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/8 pb-4"><div className="text-xs text-[var(--muted)]">Flowboard / ошибка маршрута</div><div className="h-2 w-2 rounded-full bg-[var(--danger)]" /></div>
                <div className="mt-5 grid gap-3">
                  {[["Маршрут", "не найден"], ["Доска", "недоступна"], ["Сигнал", "потерян"]].map(([label, value], index) => <div key={label} className="rounded-2xl border border-white/7 bg-white/[.025] p-4"><div className="text-[10px] uppercase tracking-[.15em] text-[var(--muted)]">{label}</div><div className={index === 2 ? "mt-1 font-medium text-[var(--danger)]" : "mt-1 font-medium"}>{value}</div></div>)}
                </div>
                <div className="mt-5 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent" />
                <div className="mt-4 text-[10px] uppercase tracking-[.18em] text-[var(--muted)]">Flowboard / lost route</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
