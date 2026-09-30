"use client";

import { MotionReveal } from "@/components/motion-reveal";

const process = [
  ["01", "نصوص متفرقة", "مصادر وصيغ وإحالات موزعة بين طبقات مختلفة."],
  ["02", "أثر مخفي", "قد يرتبط التعديل بالحذف والإشعار والسجل دون أن يظهر فورًا."],
  ["03", "قرار أوضح", "أثَر يرسم شبكة الأدلة قبل أن يفسرها."],
];

const pipeline = [
  ["01", "اختَر نصًا", "أدخل النص الحالي والتعديل المقترح."],
  ["02", "حلّل القواعد", "يفحص المحرك المصطلحات والإحالات والاعتمادات."],
  ["03", "ارسم الأثر", "تظهر المواد المرتبطة في شبكة تفاعلية."],
  ["04", "راجع الدليل", "كل تنبيه يشرح سببه ومصدره التجريبي."],
];

export function PremiumProcess() {
  return <section className="section-surface shell py-20 sm:py-28"><div className="grid gap-10 lg:grid-cols-2 lg:items-end"><MotionReveal><div><p className="eyebrow">المشكلة</p><h2 className="section-title mt-3">التشريع ليس وثيقة منفصلة.</h2></div></MotionReveal><MotionReveal delay={0.08}><p className="max-w-xl text-lg leading-8 text-[var(--muted)]">العلاقات بين المواد والتشريعات والأنظمة والإجراءات غالبًا غير مرئية عند مراجعة تعديل واحد. والنتيجة: وقت أطول، ومخاطر يصعب شرحها، وأثر لا يظهر إلا متأخرًا.</p></MotionReveal></div><div className="process-flow mt-12">{process.map(([number, title, text], index) => <MotionReveal key={number} delay={index * 0.1} scale><article className="card process-card p-6"><b className="text-3xl text-[var(--emerald)]">{number}</b><p className="mt-6 font-bold text-[var(--ink)]">{title}</p><p className="mt-2 text-sm leading-6 text-[var(--ink)]">{text}</p></article></MotionReveal>)}</div></section>;
}

export function PremiumPipeline() {
  return <section id="how" className="pipeline-section py-20 sm:py-28"><div className="shell"><MotionReveal><div className="max-w-2xl"><p className="eyebrow">كيف يعمل ATHAR</p><h2 className="section-title mt-3">نبني العلاقة أولًا، ثم نفسّر أثرها.</h2></div></MotionReveal><div className="pipeline-grid mt-12">{pipeline.map(([number, title, text], index) => <MotionReveal key={number} delay={index * 0.09} scale><article className="card pipeline-step p-6"><span className="pipeline-number">{number}</span><span className="pipeline-dot" aria-hidden /><h3 className="mt-8 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p></article></MotionReveal>)}</div></div></section>;
}
