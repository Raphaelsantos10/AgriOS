import { useCallback, useEffect, useMemo, useState } from "react";
import { calculateOpportunityScore, rankRecommendations } from "../../../engines/ai";
import { dismissRecommendation, loadIntelligenceSnapshot } from "../services/intelligenceService";
import type { IntelligenceSnapshot } from "../types/intelligence";

export function useIntelligence() {
  const [snapshot, setSnapshot] = useState<IntelligenceSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSnapshot(await loadIntelligenceSnapshot());
    } catch {
      setError("Não foi possível atualizar a análise da FARPHA Intelligence.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const recommendations = useMemo(
    () => rankRecommendations(snapshot?.recommendations ?? []),
    [snapshot],
  );

  const opportunityScore = useMemo(
    () => calculateOpportunityScore(recommendations),
    [recommendations],
  );

  const dismiss = useCallback((id: string) => {
    dismissRecommendation(id);
    setSnapshot((current) => current ? ({ ...current, recommendations: current.recommendations.filter((item) => item.id !== id) }) : current);
  }, []);

  return { snapshot, recommendations, opportunityScore, loading, error, refresh, dismiss };
}
