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
  | "broken_reference"
  | "duplicate"
  | "dependency";
export type Severity = "info" | "warning" | "critical";

export interface AtharAlert {
  id: string;
  type: AlertType;
  severity: Severity;
  title: string;
  explanation: string;
  confidence: number;
  sourceArticleIds: string[];
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
  summary: string;
  createdAt: string;
}
