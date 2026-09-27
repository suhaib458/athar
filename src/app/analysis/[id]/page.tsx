import { AnalysisDashboard } from "@/features/analysis/analysis-dashboard";

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) { await params; return <AnalysisDashboard />; }
