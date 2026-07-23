export type SocialProvider = "google" | "azure";
export type SocialProviderState =
  | "disabled"
  | "checking"
  | "ready"
  | "not_enabled"
  | "unreachable";

export type SocialProviderStates = Record<SocialProvider, SocialProviderState>;

export type SocialProviderSettings = {
  external?: Record<string, boolean | undefined>;
};

export function requestedSocialProviders(google: boolean, microsoft: boolean): Record<SocialProvider, boolean> {
  return { google, azure: microsoft };
}

export function initialSocialProviderStates(requested: Record<SocialProvider, boolean>): SocialProviderStates {
  return {
    google: requested.google ? "checking" : "disabled",
    azure: requested.azure ? "checking" : "disabled",
  };
}

export function resolveSocialProviderStates(
  requested: Record<SocialProvider, boolean>,
  settings?: SocialProviderSettings,
): SocialProviderStates {
  if (!settings) {
    return {
      google: requested.google ? "unreachable" : "disabled",
      azure: requested.azure ? "unreachable" : "disabled",
    };
  }
  return {
    google: !requested.google ? "disabled" : settings.external?.google === true ? "ready" : "not_enabled",
    azure: !requested.azure ? "disabled" : settings.external?.azure === true ? "ready" : "not_enabled",
  };
}

export function buildOAuthReturnUrl(origin: string, baseUrl = "/") {
  return new URL(baseUrl, origin).toString();
}

export function readOAuthError(search: string, hash: string) {
  const query = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const fragment = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
  const source = query.has("error") || query.has("error_code") ? query : fragment;
  if (!source.has("error") && !source.has("error_code")) return null;
  return source.get("error_description") || source.get("error_code") || source.get("error");
}
