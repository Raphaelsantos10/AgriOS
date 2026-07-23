import { useEffect, useState } from "react";
import AuthExperience, { type AuthView } from "./AuthExperience";
import MarketingSiteV4 from "./MarketingSiteV4";
import { saveSelectedPlan, type FarphaPlan } from "./utils/marketingExperience";
import { readOAuthError } from "./utils/socialAuth";

function viewFromHash(): AuthView {
  return window.location.hash === "#criar-conta" ? "signup" : "login";
}

export default function PublicEntry() {
  const [authView, setAuthView] = useState<AuthView | null>(() => {
    if (readOAuthError(window.location.search, window.location.hash)) return "login";
    if (
      window.location.hash === "#entrar" ||
      window.location.hash === "#criar-conta"
    ) {
      return viewFromHash();
    }
    return null;
  });

  useEffect(() => {
    const syncView = () => {
      if (window.location.hash === "#entrar" || window.location.hash === "#criar-conta") setAuthView(viewFromHash());
      else setAuthView(null);
    };
    window.addEventListener("hashchange", syncView);
    return () => window.removeEventListener("hashchange", syncView);
  }, []);

  function openAuth(view: AuthView) {
    setAuthView(view);
    window.history.replaceState(
      null,
      "",
      view === "signup" ? "#criar-conta" : "#entrar"
    );
  }

  function startRegistration(plan?: FarphaPlan) {
    saveSelectedPlan(localStorage, plan);
    openAuth("signup");
  }

  function closeAuth() {
    setAuthView(null);
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search
    );
  }

  if (authView) {
    return <AuthExperience key={authView} initialView={authView} onBack={closeAuth} />;
  }

  return (
    <MarketingSiteV4
      onEnter={() => openAuth("login")}
      onStart={startRegistration}
    />
  );
}
