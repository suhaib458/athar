import { demoArticles, getArticle } from "../../data/demo-legislation";
import type { AnalysisInput, AtharAlert, AtharAnalysis, ComplianceImpact, Evidence } from "../../types/legislative";
import { z } from "zod";

export const analysisInputSchema = z.object({ targetArticleId: z.string().min(1), currentText: z.string().min(1), proposedText: z.string().min(1) });
export type ValidatedAnalysisInput = z.infer<typeof analysisInputSchema>;

const stopWords = new Set(["تحتفظ", "الجهة", "بالبيانات", "البيانات", "الشخصية", "للمدة", "لمدة", "من", "في", "على", "عن", "الى", "إلى", "أو", "مع", "كل", "عند", "أن", "لا", "ما", "التي", "هذا", "هذه"]);
const normalize = (value: string) => value.replace(/[،.؛:()«»]/g, " ").replace(/\s+/g, " ").trim();
const tokens = (value: string) => normalize(value).split(" ").filter((word) => word.length > 2 && !stopWords.has(word));
const unique = <T,>(values: T[]) => [...new Set(values)];
const alert = (id: string, data: Omit<AtharAlert, "id">): AtharAlert => ({ id, ...data });

function articleEvidence(articleId: string, excerpt?: string): Evidence {
  const article = getArticle(articleId) ?? demoArticles[0];
  return { id: `evidence-${article.id}`, sourceId: article.id, sourceType: article.type === "procedure" ? "procedure" : "article", excerpt: excerpt ?? article.text, sourceLabel: article.source.label, sourceUrl: article.source.url, isOfficial: article.source.type === "official" };
}

function ruleEvidence(id: string, excerpt: string): Evidence {
  return { id, sourceId: id, sourceType: "rule", excerpt, sourceLabel: "قاعدة ATHAR الحتمية — بيانات النموذج الأولي", isOfficial: false };
}

export class AtharEngine {
  analyze(input: AnalysisInput): AtharAnalysis {
    const validated = analysisInputSchema.parse(input) as ValidatedAnalysisInput;
    const target = getArticle(validated.targetArticleId) ?? demoArticles[0];
    const alerts: AtharAlert[] = [];
    const evidence = new Map<string, Evidence>();
    const addEvidence = (...items: Evidence[]) => items.forEach((item) => evidence.set(item.id, item));
    const targetEvidence = articleEvidence(target.id, validated.currentText);
    addEvidence(targetEvidence, ruleEvidence("rule-no-source", "No source, no legal claim — لا تُعرض أي نتيجة قانونية بلا مصدر مرتبط."));

    const proposalTokens = tokens(validated.proposedText);
    const currentTokens = new Set(tokens(validated.currentText));
    const knownDefinitions = new Set(demoArticles.flatMap((article) => article.definitions.flatMap(tokens)));
    const termsNeedingReview = unique(proposalTokens.filter((term) => term.length > 4 && !knownDefinitions.has(term) && !tokens(target.text).includes(term) && !/^خمس|سنوات$/.test(term)));
    const definitionEvidence = articleEvidence("dp-01");
    addEvidence(definitionEvidence);
    if (termsNeedingReview.length > 0) {
      alerts.push(alert("undefined-term", { type: "undefined_term", severity: "warning", title: "مصطلح يحتاج مراجعة", explanation: `لم يعثر محرك أثَر على تعريف واضح للمصطلح: ${termsNeedingReview.slice(0, 2).join("، ")}. قد يحتاج إلى تعريف أو إحالة تشريعية.`, confidence: 78, sourceArticleIds: [target.id, "dp-01"], evidenceIds: [targetEvidence.id, definitionEvidence.id] }));
    }

    const referencePattern = /(?:المادة|مادة)\s*(\d+)/g;
    const referencedNumbers = [...validated.proposedText.matchAll(referencePattern)].map((match) => match[1]);
    const knownNumbers = new Set(demoArticles.map((article) => article.articleNumber));
    referencedNumbers.filter((number) => !knownNumbers.has(number)).forEach((number) => {
      const rule = ruleEvidence(`rule-reference-${number}`, "قاعدة التحقق من الإحالات: لا توجد المادة المشار إليها ضمن بيانات النموذج.");
      addEvidence(rule);
      alerts.push(alert(`broken-reference-${number}`, { type: "broken_reference", severity: "critical", title: "إحالة تشريعية غير صالحة", explanation: `تشير المسودة إلى المادة ${number}، ولم يُعثر عليها ضمن مجموعة البيانات المختارة.`, confidence: 98, sourceArticleIds: [target.id], evidenceIds: [targetEvidence.id, rule.id] }));
    });

    const relations = target.relatedArticles;
    relations.filter((relation) => relation.relation === "possible_conflict").forEach((relation) => {
      const article = getArticle(relation.articleId);
      if (!article) return;
      const relatedEvidence = articleEvidence(article.id);
      addEvidence(relatedEvidence);
      alerts.push(alert(`conflict-${article.id}`, { type: "potential_conflict", severity: "critical", title: "تعارض محتمل", explanation: `${relation.reason} ترتبط ${article.title} بمنطق الحذف أو المراجعة، بينما تقترح المسودة مدة ثابتة. هذا تنبيه للمراجعة وليس حكمًا قانونيًا نهائيًا.`, confidence: 89, sourceArticleIds: [target.id, article.id], evidenceIds: [targetEvidence.id, relatedEvidence.id] }));
    });

    relations.filter((relation) => relation.relation === "dependency" || relation.relation === "direct_reference").forEach((relation, index) => {
      const article = getArticle(relation.articleId);
      if (!article) return;
      const relatedEvidence = articleEvidence(article.id);
      addEvidence(relatedEvidence);
      alerts.push(alert(`dependency-${index}-${article.id}`, { type: "dependency", severity: "info", title: "مادة تستحق المراجعة", explanation: `${article.title}: ${relation.reason}`, confidence: 92, sourceArticleIds: [target.id, article.id], evidenceIds: [targetEvidence.id, relatedEvidence.id] }));
    });

    const proposalSet = new Set(proposalTokens);
    demoArticles.filter((article) => article.id !== target.id).forEach((article) => {
      const articleTokens = tokens(article.text);
      const overlap = articleTokens.filter((term) => proposalSet.has(term)).length / Math.max(articleTokens.length, 1);
      if (overlap > 0.46 && article.legislationId !== target.legislationId) {
        const relatedEvidence = articleEvidence(article.id);
        addEvidence(relatedEvidence);
        alerts.push(alert(`duplicate-${article.id}`, { type: "duplicate_provision", severity: "warning", title: "تكرار أو تقارب محتمل", explanation: `توجد صياغة قريبة في ${article.title} ضمن بيانات النموذج؛ راجع الاتساق بدل إنشاء حكم مكرر.`, confidence: Math.round(overlap * 100), sourceArticleIds: [target.id, article.id], evidenceIds: [targetEvidence.id, relatedEvidence.id] }));
      }
    });

    const durationChanged = /(خمس|سنوات|سنة|أشهر|يوم)/.test(validated.proposedText) && !/(خمس|سنوات|سنة|أشهر|يوم)/.test(validated.currentText);
    const complianceImpacts: ComplianceImpact[] = [];
    if (durationChanged) {
      const recordEvidence = articleEvidence("mg-03"); const noticeEvidence = articleEvidence("priv-04"); const procedureEvidence = articleEvidence("proc-05"); const reviewEvidence = articleEvidence("mg-04"); const purposeEvidence = articleEvidence("dp-02");
      addEvidence(recordEvidence, noticeEvidence, procedureEvidence, reviewEvidence, purposeEvidence);
      complianceImpacts.push(
        { id: "compliance-retention", type: "obligation_change", title: "مراجعة التزام الاحتفاظ", explanation: "تحولت صياغة الاحتفاظ من معيار مرتبط بالغرض إلى مدة زمنية ثابتة؛ قد يحتاج سجل المعالجة إلى المراجعة.", affectedEntity: "الجهة المتحكمة", affectedProcedure: "تحديث سجل المعالجة", affectedDeadline: "خمس سنوات", priority: "high", sourceArticleIds: [target.id, "mg-03"], evidenceIds: [targetEvidence.id, recordEvidence.id], reviewStatus: "needs_review" },
        { id: "compliance-notice", type: "policy_update_required", title: "تحديث محتوى الإشعار", explanation: "قد يحتاج إشعار الخصوصية إلى تحديث عندما تتغير المدة أو المعيار المستخدم لتحديدها.", affectedEntity: "الجهة المتحكمة", affectedProcedure: "مراجعة إشعار الخصوصية", affectedDeadline: "عند اعتماد التعديل", priority: "medium", sourceArticleIds: [target.id, "priv-04"], evidenceIds: [targetEvidence.id, noticeEvidence.id], reviewStatus: "needs_review" },
        { id: "compliance-destruction", type: "procedure_change", title: "مراجعة إجراء الإتلاف", explanation: "قد يحتاج إجراء الإتلاف الآمن إلى المراجعة للتأكد من اتساقه مع المدة الجديدة ومع زوال الغرض.", affectedEntity: "الفريق التشغيلي", affectedProcedure: "الإتلاف الآمن", priority: "high", sourceArticleIds: [target.id, "proc-05", "mg-04"], evidenceIds: [targetEvidence.id, procedureEvidence.id, reviewEvidence.id], reviewStatus: "needs_review" },
      );
      alerts.push(alert("compliance-retention", { type: "compliance_impact", severity: "warning", title: "أثر امتثال محتمل", explanation: "تغيير مدة الاحتفاظ قد يستدعي مراجعة السجل والإشعار وإجراء الإتلاف. تظهر هذه النتيجة كمجال مراجعة، لا كالتزام قانوني مؤكد.", confidence: 91, sourceArticleIds: [target.id, "mg-03", "priv-04", "proc-05"], evidenceIds: [targetEvidence.id, recordEvidence.id, noticeEvidence.id, procedureEvidence.id] }));
      if (currentTokens.has("الغرض")) alerts.push(alert("definition-mismatch-purpose", { type: "definition_mismatch", severity: "warning", title: "تغير في معيار التحديد", explanation: "استبدلت المسودة معيار «الغرض» بمدة رقمية؛ قد تحتاج العلاقة بين المدة والغرض إلى مراجعة تعريفية وسياساتية.", confidence: 86, sourceArticleIds: [target.id, "dp-02"], evidenceIds: [targetEvidence.id, purposeEvidence.id] }));
    }

    const impactedArticleIds = unique([target.id, ...relations.map((relation) => relation.articleId), ...alerts.flatMap((item) => item.sourceArticleIds), ...complianceImpacts.flatMap((item) => item.sourceArticleIds)]);
    const impactedLegislationIds = unique(impactedArticleIds.map((id) => getArticle(id)?.legislationId).filter((id): id is string => Boolean(id)));
    const criticals = alerts.filter((item) => item.severity === "critical").length;
    const impactScore = criticals > 0 || impactedLegislationIds.length >= 3 ? "مرتفع" : alerts.length >= 2 ? "متوسط" : "منخفض";
    return { id: "demo-retention-2026", legislationId: target.legislationId, targetArticleId: target.id, currentText: validated.currentText, proposedText: validated.proposedText, impactScore, impactedArticleIds, impactedLegislationIds, alerts, complianceImpacts, evidence: [...evidence.values()], summary: `رصد أثَر ${alerts.length} تنبيهًا قابلًا للتفسير و${complianceImpacts.length} آثار امتثال تحتاج مراجعة عبر ${impactedArticleIds.length} مادة ضمن بيانات محلية.`, createdAt: new Date().toISOString() };
  }
}

export const atharEngine = new AtharEngine();
