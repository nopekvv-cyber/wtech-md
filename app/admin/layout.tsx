import type { Metadata, Viewport } from "next";
import { outfit } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "wtech.md · admin",
  robots: { index: false, follow: false, nocache: true },
};
export const viewport: Viewport = { themeColor: "#000000", width: "device-width", initialScale: 1 };

/** Own root layout: /admin lives outside the locale segment and has no nav, chat or analytics. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <main id="main" className="min-h-dvh px-5 py-10 md:py-16">
          <div className="mx-auto w-full max-w-[860px]">{children}</div>
        </main>
      </body>
    </html>
  );
}
