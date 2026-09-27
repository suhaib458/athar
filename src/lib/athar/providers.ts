import type { AnalysisInput, AnalysisProvider, AtharAnalysis } from "@/types/legislative";
import { atharEngine } from "./engine";

/** The offline provider is the source of truth for the demo. */
export class RuleBasedProvider implements AnalysisProvider {
  async analyze(input: AnalysisInput): Promise<AtharAnalysis> {
    return atharEngine.analyze(input);
  }
}

/**
 * A safe seam for future Gemini/OpenAI adapters. It intentionally falls back to
 * deterministic results until an application-owned, evidence-aware API adapter exists.
 */
export class AIEnhancedProvider implements AnalysisProvider {
  constructor(private readonly fallback: AnalysisProvider = new RuleBasedProvider()) {}

  async analyze(input: AnalysisInput): Promise<AtharAnalysis> {
    return this.fallback.analyze(input);
  }
}

export const analysisProvider: AnalysisProvider = new RuleBasedProvider();
