import { AppRouter } from './app/AppRouter';
import { AuthProvider } from './shared/context/AuthContext';
import { TenantProvider } from './shared/context/TenantContext';
import { GlobalErrorBoundary } from './shared/components/GlobalErrorBoundary';

export default function App() {
  return (
    <GlobalErrorBoundary>
      <AuthProvider>
        <TenantProvider>
          <AppRouter />
        </TenantProvider>
      </AuthProvider>
    </GlobalErrorBoundary>
  );
}
