import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-[var(--accent)] text-sm text-[#05221d] shadow-[0_8px_30px_rgba(45,212,191,.24)]">F</span>
      <span>flowboard</span>
    </Link>
  );
}
