"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "الرئيسية", icon: "⌂" },
  { href: "/analyze", label: "حلّل", icon: "⌁" },
  { href: "/citizen", label: "اشرحلي حقي", icon: "◌" },
  { href: "/copilot", label: "المساعد", icon: "✦" },
];

export function SiteNav() {
  const pathname = usePathname();
  const current = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  return <>
    <header className="bg-[var(--navy)] text-white">
      <div className="shell flex h-[68px] items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 text-white no-underline" aria-label="أثَر - الصفحة الرئيسية">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[var(--emerald)] text-lg font-black">أ</span>
          <span><strong className="block text-base leading-4">أثَر</strong><small className="text-[10px] tracking-[.16em] text-[#a7c1cf]">ATHAR AI</small></span>
        </Link>
        <nav className="desktop-nav flex items-center gap-6" aria-label="التنقل الرئيسي">
          {navItems.map((item) => <Link key={item.href} className="nav-link" href={item.href} aria-current={current(item.href) ? "page" : undefined}>{item.label}</Link>)}
        </nav>
        <Link href="/analyze" className="primary-btn !bg-white !px-4 !py-2 !text-[var(--navy)] hover:!bg-[#e6f5f0]">ابدأ التحليل <span aria-hidden>←</span></Link>
      </div>
    </header>
    <nav className="mobile-nav" aria-label="التنقل على الهاتف">
      {navItems.map((item) => <Link key={item.href} href={item.href} aria-current={current(item.href) ? "page" : undefined}><span className="block text-base leading-4" aria-hidden>{item.icon}</span>{item.label}</Link>)}
    </nav>
  </>;
}
