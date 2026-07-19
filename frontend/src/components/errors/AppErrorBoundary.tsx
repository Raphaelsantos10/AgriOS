import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
  errorId?: string;
};

function createErrorId() {
  return `FARPHA-${Date.now().toString(36).toUpperCase()}`;
}

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: createErrorId(),
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Erro não tratado na aplicação", {
      error,
      componentStack: info.componentStack,
      errorId: this.state.errorId,
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorId: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleDashboard = () => {
    window.location.assign("/");
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
        <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <AlertTriangle size={34} aria-hidden="true" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Algo correu mal
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
            A plataforma encontrou um erro inesperado. Os teus dados não foram
            eliminados. Tenta novamente ou regressa ao Dashboard.
          </p>

          {this.state.errorId && (
            <p className="mt-4 font-mono text-xs text-slate-400">
              Referência: {this.state.errorId}
            </p>
          )}

          {import.meta.env.DEV && this.state.error?.message && (
            <pre className="mt-5 max-h-36 overflow-auto rounded-xl bg-slate-950 p-4 text-left text-xs text-slate-200">
              {this.state.error.message}
            </pre>
          )}

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={this.handleRetry}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              <RefreshCw size={17} />
              Tentar novamente
            </button>

            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCw size={17} />
              Atualizar página
            </button>

            <button
              type="button"
              onClick={this.handleDashboard}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Home size={17} />
              Dashboard
            </button>
          </div>
        </section>
      </main>
    );
  }
}
