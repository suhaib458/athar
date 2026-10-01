import { AnalyzeStudio, StudioIcon } from "@/features/analysis/analyze-studio";

export default function AnalyzePage() {
  return <main className="bottom-space legal-studio-page">
    <section className="studio-hero">
      <div className="legal-architecture" aria-hidden><div className="architecture-pediment" /><div className="architecture-columns"><i /><i /><i /><i /></div><div className="architecture-scales"><StudioIcon scales /></div></div>
      <div className="shell studio-hero-content"><p className="eyebrow">ATHAR ENGINE / محرك التحليل</p><div className="studio-title"><span><StudioIcon scales /></span><h1>حلّل الأثر التشريعي</h1></div><p>مساحة عمل ATHAR تقرأ التعديل وتربطه بإشارات قابلة للتفسير.</p></div>
    </section>
    <div className="shell studio-form-shell"><AnalyzeStudio /></div>
  </main>;
}
