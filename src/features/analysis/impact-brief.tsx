"use client";

import { useMemo, useState } from "react";
import { getArticle } from "@/data/demo-legislation";
import type { AtharAnalysis, ComplianceImpact } from "@/types/legislative";

const priorityStyle = { high: "tag-critical", medium: "tag-warning", low: "tag-info" } as const;
const priorityLabel = { high: "أولوية مرتفعة", medium: "تحتاج مراجعة", low: "معلومة" } as const;

export function ImpactBrief({ analysis }: { analysis: AtharAnalysis }) {
  const [impacts, setImpacts] = useState(analysis.complianceImpacts);
  const reviewCount = impacts.filter((item) => item.reviewStatus === "needs_review").length;
  const findings = useMemo(() => analysis.alerts.filter((item) => item.severity !== "info").slice(0, 3), [analysis]);
  const updateReview = (id: string) => setImpacts((items) => items.map((item) => item.id === id ? { ...item, reviewStatus: "reviewed" } : item));
  return <section className="card p-5 sm:p-6 print-break"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="eyebrow">ATHAR DECISION BRIEF / موجز قرار تشريعي</p><h2 className="mt-1 text-xl font-black">ملخص الأثر والمراجعة البشرية</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">الذكاء الاصطناعي يقترح، والأدلة تبرر، والإنسان يقرر. كل نقطة أدناه مرتبطة ببيانات العرض.</p></div><button type="button" className="secondary-btn print:hidden" onClick={() => window.print()}>طباعة تقرير الأثر <span aria-hidden>↙</span></button></div>
    <div className="mt-6 grid gap-3 md:grid-cols-3"><BriefCell label="مستوى الأثر" value={analysis.impactScore} /><BriefCell label="نقاط تحتاج مراجعة" value={String(findings.length)} /><BriefCell label="إجراءات امتثال" value={String(impacts.length)} /></div>
    <div className="mt-6 grid gap-5 xl:grid-cols-2"><div><h3 className="font-black">أهم نقاط المراجعة</h3><div className="mt-3 space-y-3">{findings.map((item) => <article key={item.id} className="rounded-xl border border-[var(--line)] p-4"><strong className="text-sm">{item.title}</strong><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.explanation}</p><p className="mt-2 text-xs font-bold text-[var(--emerald)]">الدليل: {item.sourceArticleIds.map((id) => getArticle(id)?.title ?? id).join(" ← ")}</p></article>)}</div></div>
      <div><div className="flex items-baseline justify-between gap-3"><h3 className="font-black">ATHAR Compliance Impact</h3><span className="text-xs font-bold text-[var(--muted)]">{reviewCount} بانتظار مراجعة</span></div><div className="mt-3 space-y-3">{impacts.map((item) => <ComplianceCard key={item.id} item={item} onReview={updateReview} />)}</div></div></div>
    <p className="mt-6 border-t border-[var(--line)] pt-4 text-xs leading-6 text-[var(--muted)]">حدود النتيجة: هذا موجز أولي مبني على بيانات وقواعد للنموذج الأولي. لا يمثل رأيًا قانونيًا ولا ينبغي اعتماده قبل المراجعة البشرية والمصدر الرسمي.</p>
  </section>;
}

function BriefCell({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-[#f6f1e5] p-4"><strong className="block text-xl font-black text-[var(--navy)]">{value}</strong><span className="mt-1 block text-xs text-[var(--muted)]">{label}</span></div>; }

function ComplianceCard({ item, onReview }: { item: ComplianceImpact; onReview: (id: string) => void }) { return <article className="rounded-xl border border-[var(--line)] p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><span className={`tag ${priorityStyle[item.priority]}`}>{priorityLabel[item.priority]}</span><h4 className="mt-2 text-sm font-black">{item.title}</h4></div>{item.reviewStatus === "needs_review" ? <button type="button" className="text-xs font-bold text-[var(--emerald)] underline underline-offset-4" onClick={() => onReview(item.id)}>وضع علامة «تمت المراجعة»</button> : <span className="tag bg-[#e4f2ec] text-[#086653]">تمت المراجعة</span>}</div><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.explanation}</p><div className="mt-3 grid gap-1 text-xs text-[var(--muted)] sm:grid-cols-2"><span>الجهة: {item.affectedEntity ?? "تحتاج تحديدًا"}</span><span>الإجراء: {item.affectedProcedure ?? "تحتاج تحديدًا"}</span>{item.affectedDeadline && <span>المدة: {item.affectedDeadline}</span>}</div><p className="mt-3 text-xs font-bold text-[var(--emerald)]">المصدر: {item.sourceArticleIds.map((id) => getArticle(id)?.title ?? id).join(" ← ")}</p></article>; }
