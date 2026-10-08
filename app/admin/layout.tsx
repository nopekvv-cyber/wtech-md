import type { Metadata, Viewport } from "next";
import { outfit } from "@/lib/fonts";
import "../globals.css";

import "../workspace.css";

export const metadata: Metadata = {
  title: "WTECH CRM",
  robots: { index: false, follow: false, nocache: true },
};
export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

/** Own root layout: /admin lives outside the locale segment and has no nav, chat or analytics. */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro" className={outfit.variable} data-admin="pearl">
      <body>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
