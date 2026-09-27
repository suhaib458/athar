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
  const useDemo = () => { setLegislationId("data-protection"); setCurrentText(retentionDemo.currentText); setProposedText(retentionDemo.proposedText); };
  const analyze = () => {
    setIsLoading(true);
    const analysis = atharEngine.analyze({ targetArticleId: "dp-12", currentText: currentText || retentionDemo.currentText, proposedText: proposedText || retentionDemo.proposedText });
    window.sessionStorage.setItem("athar-demo-analysis", JSON.stringify(analysis));
    router.push(`/analysis/${analysis.id}`);
  };
  return <section className="card overflow-hidden"><div className="flex flex-col justify-between gap-4 border-b border-[var(--line)] bg-[#fbf9f4] p-5 sm:flex-row sm:items-center sm:p-7"><div><span className="tag tag-demo">بيانات تجريبية لأغراض النموذج الأولي</span><h1 className="mt-3 text-2xl font-black text-[var(--navy)] sm:text-3xl">حلّل الأثر التشريعي</h1><p className="mt-2 text-sm text-[var(--muted)]">يعمل ATHAR Engine محليًا بقواعد قابلة للتفسير، من دون API خارجي.</p></div><button className="secondary-btn shrink-0" type="button" onClick={useDemo}>استخدم سيناريو العرض <span aria-hidden>↙</span></button></div><div className="p-5 sm:p-7"><label className="mb-2 block text-sm font-bold" htmlFor="legislation">التشريع التجريبي</label><select id="legislation" className="field mb-6" value={legislationId} onChange={(event) => setLegislationId(event.target.value)}>{legislations.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select><div className="grid gap-5 lg:grid-cols-2"><div><label className="mb-2 block text-sm font-bold" htmlFor="current-text">النص الحالي</label><textarea id="current-text" className="field min-h-45 resize-y leading-8" value={currentText} onChange={(event) => setCurrentText(event.target.value)} placeholder="الصق النص الحالي هنا، أو استخدم سيناريو العرض." /></div><div><label className="mb-2 block text-sm font-bold" htmlFor="proposed-text">التعديل المقترح</label><textarea id="proposed-text" className="field min-h-45 resize-y leading-8" value={proposedText} onChange={(event) => setProposedText(event.target.value)} placeholder="اكتب الصياغة المقترحة هنا." /></div></div><div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-[var(--line)] pt-5 sm:flex-row sm:items-center"><p className="max-w-xl text-xs leading-5 text-[var(--muted)]">لا يقدّم أثَر رأيًا قانونيًا نهائيًا؛ يعرض إشارات للمراجعة ومدى اتصالها ببيانات النموذج التجريبية.</p><button className="primary-btn min-w-55" type="button" onClick={analyze} disabled={isLoading}>{isLoading ? "يجري تتبّع الأثر…" : "حلّل الأثر التشريعي"} <span aria-hidden>←</span></button></div></div></section>;
}
