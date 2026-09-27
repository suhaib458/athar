"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "الرئيسية", icon: "⌂" },
  { href: "/analyze", label: "حلّل", icon: "⌁" },
];

export function SiteNav() {
  const pathname = usePathname();
  const current = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  return <>
    <header className="site-header">
      <div className="site-ribbon" aria-hidden><span /><span /><span /></div>
      <div className="shell flex h-[76px] items-center justify-between gap-4 sm:gap-6">
        <Link href="/" className="flex items-center gap-3 text-[var(--ink)] no-underline" aria-label="أثَر - الصفحة الرئيسية">
          <span className="brand-mark">أ</span>
          <span><strong className="block text-base leading-4">أثَر</strong><small className="text-[10px] font-bold tracking-[.16em] text-[var(--emerald)]">ATHAR AI</small></span>
        </Link>
        <nav className="desktop-nav nav-capsule" aria-label="التنقل الرئيسي">
          {navItems.map((item) => <Link key={item.href} className="nav-link" href={item.href} aria-current={current(item.href) ? "page" : undefined}>{item.label}</Link>)}
        </nav>
        <Link href="/analyze" className="primary-btn !px-4 !py-2">ابدأ التحليل <span aria-hidden>←</span></Link>
      </div>
    </header>
    <nav className="mobile-nav" aria-label="التنقل على الهاتف">
      {navItems.map((item) => <Link key={item.href} href={item.href} aria-current={current(item.href) ? "page" : undefined}><span className="block text-base leading-4" aria-hidden>{item.icon}</span>{item.label}</Link>)}
    </nav>
  </>;
}
