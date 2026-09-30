import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { PageTransition } from "@/components/page-transition";

export const metadata: Metadata = { title: "ATHAR | أثَر", description: "من النص إلى الأثر — ذكاء تشريعي يربط النصوص بأثرها.", applicationName: "ATHAR" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body><SiteNav /><PageTransition>{children}</PageTransition><SiteFooter /></body></html>;
}
