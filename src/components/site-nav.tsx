"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "الرئيسية", icon: "⌂" },
  { href: "/analyze", label: "حلّل", icon: "⌁" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(height > 0 ? Math.min(100, (window.scrollY / height) * 100) : 0);
      setScrolled(window.scrollY > 14);
    };
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const current = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  return <>
    <header className={`site-header ${pathname === "/analyze" ? "studio-site-header" : ""} ${scrolled ? "site-header-scrolled" : ""}`}>
      <span className="scroll-progress" style={{ transform: `scaleX(${scrollProgress / 100})` }} aria-hidden />
      <div className="site-ribbon" aria-hidden><span /><span /><span /></div>
      <div className="shell flex h-[76px] items-center justify-between gap-4 sm:gap-6">
        <Link href="/" className="flex items-center gap-3 text-[var(--ink)] no-underline" aria-label="أثَر - الصفحة الرئيسية">
          <span className="brand-mark"><Image src="/athar-logo-transparent.png" alt="شعار أثَر" fill sizes="88px" priority className="brand-logo-image" /></span>
          <span><strong className="block text-base leading-4">أثَر</strong><small className="text-[10px] font-bold tracking-[.16em] text-[var(--emerald)]">ATHAR</small></span>
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
