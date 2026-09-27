import { AnalyzeStudio } from "@/features/analysis/analyze-studio";

export default function AnalyzePage() { return <main className="bottom-space shell py-10 sm:py-16"><div className="mb-8"><p className="eyebrow">ATHAR ENGINE / محرك التحليل</p><p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">أدخل التعديل، ثم شاهد المواد التي قد تمتد إليها آثاره. ابدأ بسيناريو الاحتفاظ بالبيانات لتجربة النموذج.</p></div><AnalyzeStudio /></main>; }
