import type { IpmaFireForecast } from "../types/ipmaFire";
const KEY = "farpha.ipma-fire.cache.v1"; const MAX_AGE = 6 * 60 * 60 * 1000;
export function readIpmaFireCache(now = Date.now()) { try { const value = JSON.parse(localStorage.getItem(KEY) ?? "null") as IpmaFireForecast | null; return value && now - new Date(value.fetchedAt).getTime() <= MAX_AGE ? value : null; } catch { return null; } }
export function saveIpmaFireCache(value: IpmaFireForecast) { localStorage.setItem(KEY, JSON.stringify(value)); }
