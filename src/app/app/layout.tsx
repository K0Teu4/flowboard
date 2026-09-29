"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    if (window.localStorage.getItem("flowboard-account") !== "created") router.replace("/auth/sign-in");
    else setChecked(true);
  }, [router]);
  if (!checked) return <div className="grid min-h-screen place-items-center text-sm text-[var(--muted)]">Проверяем аккаунт…</div>;
  return children;
}
