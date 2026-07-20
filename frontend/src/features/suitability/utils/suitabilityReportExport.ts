import type { Field } from "../../fields/types/field";
import type { CropSuitabilityResult } from "../types/suitability";

export type SuitabilityReportExportInput = {
  field: Field;
  results: CropSuitabilityResult[];
  withIrrigation: boolean;
  generatedAt: string;
};

const escapeCsvValue = (value: string | number) =>
  `"${String(value).replaceAll('"', '""')}"`;

export function buildSuitabilityReportCsv({
  field,
  results,
  withIrrigation,
  generatedAt,
}: SuitabilityReportExportInput) {
  const headers = [
    "Posição",
    "Talhão",
    "Cultura",
    "Nome científico",
    "Cenário",
    "Pontuação usada (%)",
    "Pontuação sem rega (%)",
    "Pontuação com rega (%)",
    "Ganho com rega (pontos)",
    "Confiança (%)",
    "Pontos fortes",
    "Alertas",
    "Fatores conhecidos",
    "Gerado em",
  ];

  const rows = results.map((result, index) => [
    index + 1,
    field.name,
    result.crop.commonName,
    result.crop.scientificName ?? "Não informado",
    withIrrigation ? "Com rega simulada" : "Condições atuais",
    withIrrigation ? result.scoreWithIrrigation : result.score,
    result.score,
    result.scoreWithIrrigation,
    result.scoreWithIrrigation - result.score,
    result.confidence,
    result.strengths.join(" | ") || "Sem pontos fortes confirmados",
    result.warnings.join(" | ") || "Sem alertas",
    result.factors
      .filter((factor) => factor.known)
      .map((factor) => `${factor.label}: ${factor.score}%`)
      .join(" | ") || "Sem dados confirmados",
    generatedAt,
  ]);

  return [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(";"))
    .join("\r\n");
}

export function downloadSuitabilityReport(input: SuitabilityReportExportInput) {
  const csv = `\uFEFF${buildSuitabilityReportCsv(input)}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const safeFieldName = input.field.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() || "talhao";

  anchor.href = url;
  anchor.download = `farpha-aptidao-culturas-${safeFieldName}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}
