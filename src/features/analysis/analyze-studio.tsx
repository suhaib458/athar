"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { legislations, retentionDemo } from "@/data/demo-legislation";
import { atharEngine } from "@/lib/athar/engine";

export function AnalyzeStudio() {
  const router = useRouter();
  const [legislationId, setLegislationId] = useState("data-protection");
  const [currentText, setCurrentText] = useState("");
  const [proposedText, setProposedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  const useDemo = () => { setLegislationId("data-protection"); setCurrentText(retentionDemo.currentText); setProposedText(retentionDemo.proposedText); };
  const completeAnalysis = (analysis: ReturnType<typeof atharEngine.analyze>) => {
    setIsLoading(true);
    setAnalysisStage(0);
    [1, 2, 3].forEach((stage, index) => window.setTimeout(() => setAnalysisStage(stage), 280 + index * 300));
    window.setTimeout(() => { window.sessionStorage.setItem("athar-demo-analysis", JSON.stringify(analysis)); router.push(`/analysis/${analysis.id}`); }, 1350);
  };
  const analyze = () => {
    completeAnalysis(atharEngine.analyze({ targetArticleId: "dp-12", currentText: currentText || retentionDemo.currentText, proposedText: proposedText || retentionDemo.proposedText }));
  };
  const stages = ["جارٍ قراءة النص التشريعي…", "جارٍ استخراج المواد…", "جارٍ تحليل العلاقات…", "جارٍ بناء الأثر…"];
  return <section className="card workspace-card overflow-hidden"><div className="flex flex-col justify-between gap-4 border-b border-[var(--line)] bg-[#fbf9f4]/80 p-5 sm:flex-row sm:items-center sm:p-7"><div><span className="tag tag-demo">بيانات النموذج الأولي</span><h1 className="mt-3 text-2xl font-black text-[var(--navy)] sm:text-3xl">حلّل الأثر التشريعي</h1><p className="mt-2 text-sm text-[var(--muted)]">مساحة عمل ATHAR تقرأ التعديل وتربطه بإشارات قابلة للتفسير.</p></div><div className="flex flex-wrap gap-2"><button className="secondary-btn shrink-0" type="button" onClick={useDemo} disabled={isLoading}>استخدم سيناريو العرض <span aria-hidden>↙</span></button></div></div><div className="p-5 sm:p-7">{isLoading && <div className="mb-6 rounded-2xl border border-[#cfe3d7] bg-[#f4fbf6] p-4" role="status" aria-live="polite"><div className="flex items-center justify-between gap-3"><strong className="text-sm text-[var(--navy)]">{stages[analysisStage]}</strong><span className="text-xs font-bold text-[var(--emerald)]">ATHAR</span></div><div className="analysis-status mt-4">{stages.map((stage, index) => <span key={stage} className={index <= analysisStage ? "!border-[#83bea0] !text-[var(--emerald)]" : ""}>{index + 1}</span>)}</div></div>}<label className="mb-2 block text-sm font-bold" htmlFor="legislation">التشريع</label><select id="legislation" className="field mb-6" value={legislationId} onChange={(event) => setLegislationId(event.target.value)} disabled={isLoading}>{legislations.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select><div className="grid gap-5 lg:grid-cols-2"><div><label className="mb-2 block text-sm font-bold" htmlFor="current-text">النص الحالي</label><textarea id="current-text" className="field min-h-45 resize-y leading-8" value={currentText} onChange={(event) => setCurrentText(event.target.value)} placeholder="الصق النص الحالي هنا، أو استخدم سيناريو العرض." disabled={isLoading} /></div><div><label className="mb-2 block text-sm font-bold" htmlFor="proposed-text">التعديل المقترح</label><textarea id="proposed-text" className="field min-h-45 resize-y leading-8" value={proposedText} onChange={(event) => setProposedText(event.target.value)} placeholder="اكتب الصياغة المقترحة هنا." disabled={isLoading} /></div></div><div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-[var(--line)] pt-5 sm:flex-row sm:items-center"><p className="max-w-xl text-xs leading-5 text-[var(--muted)]">لا يقدّم أثَر رأيًا قانونيًا نهائيًا؛ يعرض إشارات للمراجعة ومدى اتصالها ببيانات النموذج الأولي.</p><button className="primary-btn min-w-55" type="button" onClick={analyze} disabled={isLoading}>{isLoading ? stages[analysisStage] : "حلّل الأثر التشريعي"} <span aria-hidden>←</span></button></div></div></section>;
}
