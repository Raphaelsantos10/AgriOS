export type IpmaFireLevel = 1 | 2 | 3 | 4 | 5;
export type IpmaMunicipalRisk = { municipalityCode: string; latitude: number; longitude: number; level: IpmaFireLevel };
export type IpmaFireDay = { date: string; modelRunDate: string; fileDate: string; municipalities: IpmaMunicipalRisk[] };
export type IpmaFireForecast = { fetchedAt: string; source: "IPMA"; days: IpmaFireDay[] };
export type MatchedFireRisk = { date: string; municipalityCode: string; level: IpmaFireLevel; distanceKm: number; modelRunDate: string; fileDate: string };
