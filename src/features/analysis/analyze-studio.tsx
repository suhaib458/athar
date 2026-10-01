"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { legislations, retentionDemo } from "@/data/demo-legislation";
import { atharEngine } from "@/lib/athar/engine";

export function StudioIcon({ scales = false }: { scales?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{scales ? <><path d="M12 3v17M5 21h14M4 7h16M5 7l-3 7h6L5 7Zm14 0-3 7h6l-3-7Z"/><path d="M2 14c1 3 5 3 6 0m8 0c1 3 5 3 6 0"/></> : <><path d="M14 2H5v20h14V7l-5-5Z"/><path d="M14 2v6h5M8 12h8M8 16h8"/></>}</svg>;
}

export function AnalyzeStudio() {
  const router = useRouter();
  const [legislationId, setLegislationId] = useState("data-protection");
  const [currentText, setCurrentText] = useState("");
  const [proposedText, setProposedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  const timers = useRef<number[]>([]);
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);
  const useDemo = () => { setLegislationId("data-protection"); setCurrentText(retentionDemo.currentText); setProposedText(retentionDemo.proposedText); };
  const analyze = () => {
    if (isLoading) return;
    const analysis = atharEngine.analyze({ targetArticleId: "dp-12", currentText: currentText || retentionDemo.currentText, proposedText: proposedText || retentionDemo.proposedText });
    setIsLoading(true); setAnalysisStage(0);
    timers.current = [1, 2, 3].map((stage, index) => window.setTimeout(() => setAnalysisStage(stage), 280 + index * 300));
    timers.current.push(window.setTimeout(() => { window.sessionStorage.setItem("athar-demo-analysis", JSON.stringify(analysis)); router.push(`/analysis/${analysis.id}`); }, 1350));
  };
  const stages = ["جارٍ قراءة النص التشريعي…", "جارٍ استخراج المواد…", "جارٍ تحليل العلاقات…", "جارٍ بناء الأثر…"];
  return <section className="legal-workspace" aria-label="مساحة تحليل الأثر">
    <div className="studio-legislation">
      <span className="studio-label" id="legislation-label"><span className="studio-icon"><StudioIcon /></span>التشريع</span>
      <details className="legislation-menu" ref={menu} onKeyDown={event => { if (event.key === "Escape" && menu.current) { menu.current.open = false; menu.current.querySelector("summary")?.focus(); } }}>
        <summary aria-labelledby="legislation-label legislation-value" aria-disabled={isLoading} onClick={event => { if (isLoading) event.preventDefault(); }}><StudioIcon /><span id="legislation-value">{legislations.find(item => item.id === legislationId)?.title}</span><span className="menu-chevron" aria-hidden>⌄</span></summary>
        <fieldset className="legislation-options" disabled={isLoading}><legend className="sr-only">اختر التشريع</legend>{legislations.map(item => <label key={item.id}><input type="radio" name="legislation" value={item.id} checked={legislationId === item.id} onChange={() => { setLegislationId(item.id); if (menu.current) { menu.current.open = false; menu.current.querySelector("summary")?.focus(); } }} /><span>{item.title}</span><span className="option-check" aria-hidden>✓</span></label>)}</fieldset>
      </details>
    </div>
    <div className="studio-editors">
      {[{ id: "current-text", title: "النص الحالي", value: currentText, update: setCurrentText, placeholder: "الصق النص الحالي هنا، أو استخدم سيناريو العرض.", hint: "أدخل النص الحالي للتشريع المراد تحليله." }, { id: "proposed-text", title: "التعديل المقترح", value: proposedText, update: setProposedText, placeholder: "اكتب الصياغة المقترحة هنا.", hint: "صف التعديل أو الصياغة الجديدة المقترحة." }].map(field => <div className="studio-editor" key={field.id}>
        <div className="editor-heading"><label className="studio-label" htmlFor={field.id}><span className="studio-icon"><StudioIcon /></span>{field.title}{field.value.trim() && <span className="editor-check" aria-label="النص مُدخل">✓</span>}</label>{field.id === "current-text" && <button className="fill-example" type="button" onClick={useDemo} disabled={isLoading}>تعبئة مثال</button>}</div>
        <textarea id={field.id} className="studio-textarea" rows={7} maxLength={5000} value={field.value} onChange={event => field.update(event.target.value)} placeholder={field.placeholder} disabled={isLoading} aria-describedby={`${field.id}-hint ${field.id}-count`} />
        <div className="editor-caption"><span id={`${field.id}-hint`}>{field.hint}</span><span id={`${field.id}-count`} dir="ltr">{field.value.length} / 5000</span></div>
      </div>)}
    </div>
    <div className="studio-actions"><p><span aria-hidden>◇</span>لا يقدّم أثَر رأيًا قانونيًا نهائيًا؛ يعرض إشارات للمراجعة ومدى اتصالها ببيانات النموذج الأولي.</p><button className="studio-submit" type="button" onClick={analyze} disabled={isLoading}>{isLoading ? <span className="studio-loader" aria-hidden /> : <span aria-hidden>✧</span>}{isLoading ? "جارٍ تحليل الأثر…" : "حلّل الأثر التشريعي"}<span aria-hidden>←</span></button></div>
    <div className="studio-status" role="status" aria-live="polite">{isLoading && <><span>{stages[analysisStage]}</span><div className="studio-stage-track">{stages.map((stage, index) => <span key={stage} className={index <= analysisStage ? "complete" : ""} />)}</div></>}</div>
  </section>;
}
