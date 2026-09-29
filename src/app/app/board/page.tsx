import { Suspense } from "react";
import BoardPageClient from "./board-page-client";

export default function BoardRoute() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center text-sm text-[var(--muted)]">
          Открываем доску…
        </div>
      }
    >
      <BoardPageClient />
    </Suspense>
  );
}
