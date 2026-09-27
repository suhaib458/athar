import { demoArticles, getArticle } from "../../data/demo-legislation";
import type { AtharAlert, AtharAnalysis } from "../../types/legislative";
import { z } from "zod";

export const analysisInputSchema = z.object({ targetArticleId: z.string().min(1), currentText: z.string().min(1), proposedText: z.string().min(1) });
export type AnalysisInput = z.infer<typeof analysisInputSchema>;

const stopWords = new Set(["تحتفظ", "الجهة", "بالبيانات", "البيانات", "الشخصية", "للمدة", "لمدة", "من", "في", "على", "عن", "الى", "إلى", "أو", "مع", "كل", "عند", "أن", "لا", "ما", "التي", "هذا", "هذه"]);
const normalize = (value: string) => value.replace(/[،.؛:()«»]/g, " ").replace(/\s+/g, " ").trim();
const tokens = (value: string) => normalize(value).split(" ").filter((word) => word.length > 2 && !stopWords.has(word));
const unique = <T,>(values: T[]) => [...new Set(values)];

function alert(id: string, data: Omit<AtharAlert, "id">): AtharAlert { return { id, ...data }; }

export class AtharEngine {
  analyze(input: AnalysisInput): AtharAnalysis {
    const validated = analysisInputSchema.parse(input);
    const target = getArticle(validated.targetArticleId) ?? demoArticles[0];
    const alerts: AtharAlert[] = [];
    const proposalTokens = tokens(validated.proposedText);
    const knownDefinitions = new Set(demoArticles.flatMap((article) => article.definitions.flatMap(tokens)));
    const termsNeedingReview = unique(proposalTokens.filter((term) => term.length > 4 && !knownDefinitions.has(term) && !tokens(target.text).includes(term) && !/^خمس|سنوات$/.test(term)));

    if (termsNeedingReview.length > 0) {
      alerts.push(alert("undefined-term", { type: "undefined_term", severity: "warning", title: "مصطلح يحتاج مراجعة", explanation: `لم يعثر محرك أثَر على تعريف تجريبي واضح للمصطلح: ${termsNeedingReview.slice(0, 2).join("، ")}. قد يحتاج إلى تعريف أو إحالة تشريعية.`, confidence: 78, sourceArticleIds: [target.id, "dp-01"] }));
    }

    const referencePattern = /(?:المادة|مادة)\s*(\d+)/g;
    const referencedNumbers = [...validated.proposedText.matchAll(referencePattern)].map((match) => match[1]);
    const knownNumbers = new Set(demoArticles.map((article) => article.articleNumber));
    referencedNumbers.filter((number) => !knownNumbers.has(number)).forEach((number) => alerts.push(alert(`broken-reference-${number}`, { type: "broken_reference", severity: "critical", title: "إحالة تشريعية غير صالحة", explanation: `تشير المسودة إلى المادة ${number}، ولم يُعثر عليها ضمن مجموعة البيانات التجريبية المختارة.`, confidence: 98, sourceArticleIds: [target.id] })));

    const relations = target.relatedArticles;
    relations.filter((relation) => relation.relation === "possible_conflict").forEach((relation) => {
      const article = getArticle(relation.articleId);
      if (article) alerts.push(alert(`conflict-${article.id}`, { type: "potential_conflict", severity: "critical", title: "تعارض محتمل", explanation: `${relation.reason} ترتبط ${article.title} بمنطق الحذف أو المراجعة، بينما تقترح المسودة مدة ثابتة. هذا تنبيه للمراجعة وليس حكمًا قانونيًا نهائيًا.`, confidence: 89, sourceArticleIds: [target.id, article.id] }));
    });

    relations.filter((relation) => relation.relation === "dependency" || relation.relation === "direct_reference").forEach((relation, index) => {
      const article = getArticle(relation.articleId);
      if (article) alerts.push(alert(`dependency-${index}-${article.id}`, { type: "dependency", severity: "info", title: "مادة تستحق المراجعة", explanation: `${article.title}: ${relation.reason}`, confidence: 92, sourceArticleIds: [target.id, article.id] }));
    });

    const proposalSet = new Set(proposalTokens);
    demoArticles.filter((article) => article.id !== target.id).forEach((article) => {
      const articleTokens = tokens(article.text);
      const overlap = articleTokens.filter((term) => proposalSet.has(term)).length / Math.max(articleTokens.length, 1);
      if (overlap > 0.46 && article.legislationId !== target.legislationId) {
        alerts.push(alert(`duplicate-${article.id}`, { type: "duplicate", severity: "warning", title: "تكرار أو تقارب محتمل", explanation: `توجد صياغة قريبة في ${article.title} ضمن بيانات النموذج؛ راجع الاتساق بدل إنشاء حكم مكرر.`, confidence: Math.round(overlap * 100), sourceArticleIds: [target.id, article.id] }));
      }
    });

    const impactedArticleIds = unique([target.id, ...relations.map((relation) => relation.articleId), ...alerts.flatMap((item) => item.sourceArticleIds)]);
    const impactedLegislationIds = unique(impactedArticleIds.map((id) => getArticle(id)?.legislationId).filter((id): id is string => Boolean(id)));
    const criticals = alerts.filter((item) => item.severity === "critical").length;
    const impactScore = criticals > 0 || impactedLegislationIds.length >= 3 ? "مرتفع" : alerts.length >= 2 ? "متوسط" : "منخفض";

    return { id: "demo-retention-2026", legislationId: target.legislationId, targetArticleId: target.id, currentText: validated.currentText, proposedText: validated.proposedText, impactScore, impactedArticleIds, impactedLegislationIds, alerts, summary: `رصد أثَر ${alerts.length} تنبيهًا قابلًا للتفسير عبر ${impactedArticleIds.length} مادة ضمن بيانات تجريبية محلية.`, createdAt: new Date().toISOString() };
  }
}

export const atharEngine = new AtharEngine();
