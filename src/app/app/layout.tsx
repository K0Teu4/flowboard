"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasSession } from "@/lib/auth-store";
import { sitePath } from "@/lib/site-path";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    if (!hasSession()) window.location.replace(sitePath("/auth/sign-in/"));
    else setChecked(true);
  }, [router]);
  if (!checked) return <div className="grid min-h-screen place-items-center bg-[var(--bg)] text-sm text-[var(--muted)]">Проверяем сессию…</div>;
  return children;
}
