export const LOCAL_ACCESS_KEY = "farpha-local-access";
export const LOCAL_ACCESS_VERSION = "active-107.2";

export function hasCurrentLocalAccess(value: string | null) {
  return value === LOCAL_ACCESS_VERSION;
}
