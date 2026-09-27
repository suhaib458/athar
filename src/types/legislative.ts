export type LegislationType = "law" | "regulation" | "instruction" | "procedure";
export type RelationType =
  | "direct_reference"
  | "definition"
  | "dependency"
  | "possible_conflict"
  | "related";

export interface ArticleRelation {
  articleId: string;
  relation: RelationType;
  reason: string;
}

export type EvidenceSourceType = "article" | "definition" | "procedure" | "rule";

export interface Evidence {
  id: string;
  sourceId: string;
  sourceType: EvidenceSourceType;
  excerpt: string;
  sourceLabel: string;
  sourceUrl?: string;
  isOfficial: boolean;
}

export interface LegislativeArticle {
  id: string;
  legislationId: string;
  articleNumber: string;
  title: string;
  text: string;
  type: LegislationType;
  definitions: string[];
  references: string[];
  relatedArticles: ArticleRelation[];
  effectiveDate?: string;
  source: { type: "demo" | "official"; label: string; url?: string };
}

export interface Legislation {
  id: string;
  title: string;
  shortTitle: string;
  type: LegislationType;
  description: string;
}

export type AlertType =
  | "potential_conflict"
  | "undefined_term"
  | "definition_mismatch"
  | "broken_reference"
  | "duplicate_provision"
  | "dependency"
  | "obligation_change"
  | "authority_overlap"
  | "temporal_conflict"
  | "compliance_impact";
export type Severity = "info" | "warning" | "critical";

export interface AtharAlert {
  id: string;
  type: AlertType;
  severity: Severity;
  title: string;
  explanation: string;
  confidence: number;
  sourceArticleIds: string[];
  evidenceIds: string[];
}

export type ComplianceImpactType =
  | "obligation_change"
  | "authority_change"
  | "deadline_change"
  | "procedure_change"
  | "definition_change"
  | "policy_update_required";

export interface ComplianceImpact {
  id: string;
  type: ComplianceImpactType;
  title: string;
  explanation: string;
  affectedEntity?: string;
  affectedProcedure?: string;
  affectedDeadline?: string;
  priority: "low" | "medium" | "high";
  sourceArticleIds: string[];
  evidenceIds: string[];
  reviewStatus: "needs_review" | "reviewed";
}

export interface AnalysisInput {
  targetArticleId: string;
  currentText: string;
  proposedText: string;
}

export interface AnalysisProvider {
  analyze(input: AnalysisInput): Promise<AtharAnalysis>;
}

export interface AtharAnalysis {
  id: string;
  legislationId: string;
  targetArticleId: string;
  currentText: string;
  proposedText: string;
  impactScore: "منخفض" | "متوسط" | "مرتفع";
  impactedArticleIds: string[];
  impactedLegislationIds: string[];
  alerts: AtharAlert[];
  complianceImpacts: ComplianceImpact[];
  evidence: Evidence[];
  summary: string;
  createdAt: string;
}
