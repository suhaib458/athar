import Link from "next/link";
import { FeatureIcon } from "@/components/visuals";
import { MotionReveal } from "@/components/motion-reveal";
import { PremiumPipeline, PremiumProcess } from "@/components/home-premium-sections";

const features = [
  ["ATHAR Engine", "محرك التحليل", "يفحص التعديل بقواعد قابلة للتفسير ومراجع واضحة.", "◈"],
  ["ATHAR Ripple", "الأثر المتسلسل", "يكشف كيف يصل التعديل إلى مواد وأنظمة وإجراءات مرتبطة.", "⌁"],
  ["ATHAR Radar", "كاشف التعارضات", "ينبه إلى التعارضات المحتملة، لا يصدر حكمًا قانونيًا نهائيًا.", "◎"],
  ["Compliance Impact", "أثر الامتثال", "يرتب الالتزامات والإجراءات والجهات التي قد تحتاج مراجعة.", "◌"],
];

export default function Home() {
  return <main className="bottom-space overflow-hidden">
    <section className="hero-reference premium-hero py-16 sm:py-24">
      <div className="hero-data-layer" aria-hidden><span /><span /><span /><i /><i /><i /></div>
      <div className="grid-pattern absolute inset-0" /><div className="absolute -left-28 top-8 size-80 rounded-full bg-[var(--emerald)] opacity-10 blur-3xl" /><div className="absolute bottom-0 right-0 size-80 rounded-full bg-[#c69a38] opacity-10 blur-3xl" />
      <div className="hero-frame" aria-hidden><span /><span /><span /><span /></div>
      <div className="shell relative max-w-4xl">
        <MotionReveal><div className="mx-auto max-w-3xl text-center"><div className="mb-7 flex items-center justify-center gap-3"><span className="gold-dot" /><span className="text-sm font-bold text-[#214936]">ذكاء تشريعي قابل للتفسير</span></div>
          <p className="mb-3 text-lg font-bold">أثَر <span className="mr-2 text-xs tracking-[.22em]">ATHAR AI</span></p>
          <h1 className="mx-auto max-w-3xl text-[clamp(3.1rem,8vw,6.7rem)] font-black leading-[.96] tracking-[-.075em]">من النص<br /><span className="text-[#e9c76b]">إلى الأثر</span></h1>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-8 text-[#214936] sm:text-xl">قبل أن يتغير النص، اعرف ما الذي سيتغير معه. أثَر يحلل أثر التعديل ويربط كل إشارة بدليل.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3"><Link href="/analyze" className="primary-btn !px-5 !py-3">جرّب تحليل الأثر <span aria-hidden>←</span></Link><a href="#how" className="secondary-btn">شاهد سيناريو العرض</a></div>
          <p className="mt-8 text-xs text-[#345544]">يعمل نموذج العرض محليًا بالكامل • لا يحتاج إلى مفتاح AI أو إنترنت</p>
          <div className="hero-proof" aria-label="خصائص أثَر الأساسية">
            <div><strong>قابل للتفسير</strong><span>كل تنبيه يرافقه دليل</span></div>
            <div><strong>مراجعة بشرية</strong><span>لا يصدر حكمًا قانونيًا نهائيًا</span></div>
            <div><strong>عرض مباشر</strong><span>سيناريو جاهز للهاكاثون</span></div>
          </div>
        </div></MotionReveal>
      </div>
    </section>
    <PremiumProcess />
    <PremiumPipeline />
    <section className="shell py-20 sm:py-28"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="eyebrow">منظومة أثَر</p><h2 className="section-title mt-3">واجهة واحدة، مكوّنات مترابطة.</h2></div><Link className="secondary-btn" href="/analyze">جرّب النموذج ←</Link></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{features.map(([english, arabic, text, glyph]) => <article className="card p-6" key={english}><FeatureIcon glyph={glyph} /><p className="mt-6 text-xs font-bold tracking-[.12em] text-[var(--emerald)]">{english}</p><h3 className="mt-1 text-lg font-black">{arabic}</h3><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{text}</p></article>)}</div></section>
    <section className="shell py-20 text-center sm:py-28"><p className="eyebrow">الذكاء الاصطناعي في القانون</p><h2 className="section-title mx-auto mt-3 max-w-2xl">محرك ذكاء تشريعي لتحليل أثر التعديلات والامتثال.</h2><p className="mx-auto mt-4 max-w-xl leading-7 text-[var(--muted)]">ATHAR AI منصة دعم قرار: تحدد العلاقة، وتربطها بدليل، وتُظهر ما قد يحتاج مراجعة بشرية قبل اعتماد النص.</p><Link href="/analyze" className="primary-btn mt-8">حلّل سيناريو العرض ←</Link></section>
  </main>;
}
