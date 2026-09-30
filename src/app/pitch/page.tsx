import Link from "next/link";

const blocks = [
  ["المشكلة", "التعديل التشريعي قد يمتد إلى تعريفات والتزامات وإجراءات لا تظهر عند قراءة المادة وحدها."],
  ["الحل", "ATHAR يحوّل النص إلى شبكة أدلة، ثم ينتج أثرًا تشريعيًا وامتثاليًا قابلًا للمراجعة البشرية."],
  ["المستخدمون المستهدفون", "جهات تشريعية ووزارات وهيئات تنظيمية، ثم فرق الحوكمة والمخاطر والامتثال والإدارات القانونية."],
  ["الميزة التقنية", "قواعد قابلة للتفسير + Knowledge Graph + طبقة AI اختيارية لا تقدم ادعاء قانونيًا بلا مصدر."],
  ["نموذج الأعمال", "ترخيص مؤسسي للجهات الحكومية، واشتراك SaaS للمنشآت، وواجهة Legislative Intelligence API مستقبلًا."],
  ["Pilot 1", "مجال Data & Digital Regulation مع 3–5 تشريعات مترابطة، وقياس وقت اكتشاف العلاقات والتنبيهات المفيدة ومقدار المراجعة البشرية."],
];

export default function PitchPage() {
  return <main className="bottom-space shell py-10 sm:py-16"><section className="rounded-[28px] bg-[var(--navy)] p-7 text-white sm:p-10"><p className="text-xs font-bold tracking-[.16em] text-[#85e2cc]">ATHAR / HACKATHON PITCH</p><h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">قبل أن يتغير النص، اعرف ما الذي سيتغير معه.</h1><p className="mt-5 max-w-2xl leading-8 text-[#d1e0e5]">ATHAR: Legislative Impact & Compliance Intelligence. منصة LegalTech لدعم القرار، وليست بديلًا للمختص القانوني.</p><Link href="/analyze" className="secondary-btn mt-7 !border-white/20 !bg-white/10 !text-white">تشغيل سيناريو العرض ←</Link></section><section className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{blocks.map(([title, body], index) => <article key={title} className="card p-6"><span className="text-sm font-black text-[var(--gold)]">0{index + 1}</span><h2 className="mt-6 text-lg font-black">{title}</h2><p className="mt-3 text-sm leading-7 text-[var(--muted)]">{body}</p></article>)}</section><section className="mt-7 card p-6"><p className="eyebrow">الفريق المقترح</p><h2 className="mt-2 text-xl font-black">قوة فريق متعدد التخصصات</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{["Legal Specialist", "AI / Data Engineer", "Full-stack Product Developer", "UX / Product Design"].map((role) => <div key={role} className="rounded-xl bg-[#f6f1e5] p-4 text-sm font-bold">{role}</div>)}</div><p className="mt-5 text-xs leading-6 text-[var(--muted)]">Pilot KPIs: وقت إيجاد العلاقات، العلاقات التي أكدها المراجع، التنبيهات المفيدة، ومقدار المراجعة البشرية المطلوبة. لا يدّعي النموذج أي نتائج قبل تنفيذ Pilot فعلي.</p></section></main>;
}
