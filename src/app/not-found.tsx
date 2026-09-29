import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Brand } from "@/components/brand";

export default function NotFound() {
  return (
    <main className="shell grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-10 flex justify-center"><Brand /></div>
        <div className="text-7xl font-semibold tracking-[-.05em] text-white/10">404</div>
        <h1 className="mt-3 text-2xl font-semibold">Страница не найдена</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Проверь адрес или вернись на главную страницу Flowboard.</p>
        <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-[#06211c]"><ArrowLeft size={14}/>На главную</Link>
      </div>
    </main>
  );
}
