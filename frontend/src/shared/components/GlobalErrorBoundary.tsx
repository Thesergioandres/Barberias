import { Component, type ErrorInfo, type ReactNode } from 'react';

type GlobalErrorBoundaryProps = {
  children: ReactNode;
};

type GlobalErrorBoundaryState = {
  hasError: boolean;
};

export class GlobalErrorBoundary extends Component<GlobalErrorBoundaryProps, GlobalErrorBoundaryState> {
  state: GlobalErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('GlobalErrorBoundary', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <section className="app-card mx-auto mt-16 max-w-xl text-center">
          <h2 className="text-2xl font-semibold">Estamos optimizando tu experiencia, vuelve en un momento</h2>
          <p className="mt-3 text-sm text-muted">Si el problema persiste, intenta recargar la pagina.</p>
          <button className="btn-primary mt-6" type="button" onClick={this.handleReload}>
            Recargar
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}
