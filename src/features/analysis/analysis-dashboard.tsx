"use client";

import { useState } from "react";
import { getArticle, retentionDemo } from "@/data/demo-legislation";
import { atharEngine } from "@/lib/athar/engine";
import { RippleGraph } from "@/features/graph/ripple-graph";
import { TextDiff } from "@/features/analysis/text-diff";
import type { AtharAnalysis, Severity } from "@/types/legislative";

const severityClass: Record<Severity, string> = { critical: "tag-critical", warning: "tag-warning", info: "tag-info" };
const severityText: Record<Severity, string> = { critical: "مرتفع", warning: "يحتاج مراجعة", info: "معلومة" };
const typeText = { potential_conflict: "تعارض محتمل", undefined_term: "مصطلح", broken_reference: "إحالة", duplicate: "تقارب", dependency: "اعتماد" } as const;

function useAnalysis() {
  const [analysis] = useState<AtharAnalysis>(() => {
    if (typeof window === "undefined") return atharEngine.analyze(retentionDemo);
    const saved = window.sessionStorage.getItem("athar-demo-analysis");
    if (!saved) return atharEngine.analyze(retentionDemo);
    try { return JSON.parse(saved) as AtharAnalysis; } catch { return atharEngine.analyze(retentionDemo); }
  });
  return analysis;
}

export function AnalysisDashboard() {
  const analysis = useAnalysis(); const target = getArticle(analysis.targetArticleId)!;
  const scrollGraph = () => document.getElementById("ripple")?.scrollIntoView({ behavior: "smooth", block: "start" });
  return <main className="bottom-space shell py-8 sm:py-12"><section className="rounded-[24px] bg-[var(--navy)] p-5 text-white sm:p-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><span className="tag bg-[#f8d87c] text-[#5b4309]">نتيجة Demo Mode</span><p className="mt-4 text-sm text-[#9fc4d1]">ATHAR ENGINE / نتيجة التحليل</p><h1 className="mt-1 text-2xl font-black sm:text-3xl">أثر تعديل مادة {target.articleNumber}: {target.title}</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-[#d1e0e5]">{analysis.summary}</p></div><button type="button" onClick={scrollGraph} className="secondary-btn !border-white/20 !bg-white/10 !text-white">اذهب إلى الأثر المتسلسل ↓</button></div><div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4"><Metric label="درجة الأثر" value={analysis.impactScore} accent="text-[#f3d878]" /><Metric label="مواد مرتبطة" value={String(analysis.impactedArticleIds.length)} accent="text-[#89e5cf]" /><Metric label="تشريعات متأثرة" value={String(analysis.impactedLegislationIds.length)} accent="text-[#89e5cf]" /><Metric label="تنبيهات قابلة للتفسير" value={String(analysis.alerts.length)} accent="text-[#ffb5aa]" /></div></section><section className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_.85fr]"><TextDiff currentText={analysis.currentText} proposedText={analysis.proposedText} /><section className="card p-5 sm:p-6"><p className="eyebrow">ATHAR RADAR / كاشف التعارضات</p><h2 className="mt-1 text-xl font-black">تنبيهات قابلة للمراجعة</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">المحرك يقدّم أدلة وفرضيات فحص، لا حكمًا قانونيًا نهائيًا.</p><div className="mt-5 space-y-3">{analysis.alerts.slice(0, 5).map((item) => <article key={item.id} className="rounded-xl border border-[var(--line)] p-4"><div className="flex items-start justify-between gap-3"><div><span className={`tag ${severityClass[item.severity]}`}>{severityText[item.severity]}</span><h3 className="mt-2 text-sm font-black">{item.title}</h3></div><span className="text-xs font-bold text-[var(--muted)]">ثقة {item.confidence}%</span></div><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.explanation}</p><div className="mt-3 flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-bold text-[var(--emerald)]">{typeText[item.type]}</span><button type="button" className="text-xs font-bold text-[var(--navy)] underline underline-offset-4" onClick={scrollGraph}>عرض العلاقة في الخريطة</button></div></article>)}</div></section></section><section id="ripple" className="mt-6 scroll-mt-5"><RippleGraph analysis={analysis} /></section><section className="mt-6 rounded-2xl border border-[#e7d99e] bg-[#fff8de] p-5 text-sm leading-7 text-[#604b12]"><strong>تنبيه مهم:</strong> هذه النتيجة مبنية على «بيانات تجريبية لأغراض النموذج الأولي». ATHAR AI أداة دعم قرار تشريعي ولا تشكل استشارة قانونية ملزمة.</section></main>;
}
function Metric({ label, value, accent }: { label: string; value: string; accent: string }) { return <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><strong className={`block text-2xl font-black sm:text-3xl ${accent}`}>{value}</strong><span className="mt-1 block text-xs text-[#b8d0d9]">{label}</span></div>; }
