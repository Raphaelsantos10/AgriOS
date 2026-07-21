export function greetingForHour(hour: number) {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) throw new Error("Hora inválida");
  if (hour >= 5 && hour < 12) return "Bom dia";
  if (hour >= 12 && hour < 20) return "Boa tarde";
  return "Boa noite";
}

export function weatherCodeLabel(code: number) {
  if (code === 0) return "Céu limpo";
  if ([1, 2].includes(code)) return "Pouco nublado";
  if (code === 3) return "Nublado";
  if ([45, 48].includes(code)) return "Nevoeiro";
  if (code >= 51 && code <= 67) return "Chuva";
  if (code >= 71 && code <= 77) return "Neve";
  if (code >= 80 && code <= 82) return "Aguaceiros";
  if (code >= 85 && code <= 86) return "Aguaceiros de neve";
  if (code >= 95) return "Trovoada";
  return "Condições variáveis";
}

export function formatDashboardDate(date: Date) {
  return new Intl.DateTimeFormat("pt-PT", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(date);
}
