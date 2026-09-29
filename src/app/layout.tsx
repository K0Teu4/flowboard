import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/language-provider";
import { WorkspaceProvider } from "@/lib/workspace-store";

export const metadata: Metadata = {
  title: "Flowboard — Plan. Focus. Ship.",
  description: "A realtime project workspace for focused teams and makers.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <LanguageProvider><WorkspaceProvider>{children}</WorkspaceProvider></LanguageProvider>
      </body>
    </html>
  );
}
