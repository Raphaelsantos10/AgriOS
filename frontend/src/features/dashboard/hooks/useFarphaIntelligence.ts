import { useCallback, useEffect, useState } from "react";
import type { Farm } from "../../farms/types/farm";
import { getCrops } from "../../crops/services/cropService";
import { getEnvironmentProfile } from "../../environment/services/environmentService";
import { getFieldsByFarm } from "../../fields/services/fieldsService";
import { getIrrigationSystem } from "../../irrigation/services/irrigationService";
import {
  combineRecommendations,
  evaluateCrops,
  evaluateEnvironment,
  evaluateIrrigation,
  type EngineRecommendation,
} from "../../../engines";

export function useFarphaIntelligence(farms: Farm[]) {
  const [recommendations, setRecommendations] = useState<EngineRecommendation[]>([]);
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!farms.length) {
      setRecommendations([]);
      setConfidence(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fieldsByFarm = await Promise.all(farms.slice(0, 5).map((farm) => getFieldsByFarm(farm.id)));
      const fields = fieldsByFarm.flat().slice(0, 12);
      const crops = await getCrops();
      const results = [];

      for (const field of fields) {
        const [environment, irrigationSystem] = await Promise.all([
          getEnvironmentProfile(field.id),
          getIrrigationSystem(field.id),
        ]);

        results.push(evaluateEnvironment(environment, field.id, field.name));

        if (environment) {
          results.push(evaluateCrops(crops, environment, field.id, field.name));
          results.push(
            evaluateIrrigation({
              field,
              environment,
              system: irrigationSystem,
            }),
          );
        }
      }

      const combined = combineRecommendations(results, 6);
      setRecommendations(combined.data);
      setConfidence(combined.confidence);
    } catch (loadError) {
      console.error("FARPHA INTELLIGENCE LOAD ERROR:", loadError);
      setError("Não foi possível gerar as recomendações agora.");
    } finally {
      setLoading(false);
    }
  }, [farms]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void refresh();
    }, 0);

    return () => window.clearTimeout(id);
  }, [refresh]);

  return { recommendations, confidence, loading, error, refresh };
}
