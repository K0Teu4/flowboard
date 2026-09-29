import Link from "next/link";

export function Brand() {
  return <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight"><span className="grid h-8 w-8 place-items-center rounded-xl bg-[var(--accent)] text-sm text-white shadow-[0_8px_30px_rgba(124,92,255,.35)]">F</span><span>flowboard</span></Link>;
}
