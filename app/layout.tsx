import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import SWRegister from "./sw-register";

export const metadata: Metadata = {
  title: "Migiq",
  description: "Personal knowledge tracker",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "Migiq", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#fafaf7",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="sticky top-0 z-10 bg-paper/95 backdrop-blur border-b border-black/5">
          <nav className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-semibold tracking-tight">
              migiq
            </Link>
            <div className="flex items-center gap-3 text-sm">
              <Link href="/" className="text-muted hover:text-ink">List</Link>
              <Link href="/tags" className="text-muted hover:text-ink">Tags</Link>
              <Link
                href="/capture"
                className="bg-ink text-paper rounded-full px-3 py-1.5 hover:opacity-90"
              >
                + Add
              </Link>
            </div>
          </nav>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-4">{children}</main>
        <SWRegister />
      </body>
    </html>
  );
}
