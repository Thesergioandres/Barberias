import { AppRouter } from './app/AppRouter';
import { AuthProvider } from './shared/context/AuthContext';
import { TenantProvider } from './shared/context/TenantContext';
import { GlobalErrorBoundary } from './shared/components/GlobalErrorBoundary';
import { CookieConsentBanner } from './shared/components/CookieConsentBanner';

export default function App() {
  return (
    <GlobalErrorBoundary>
      <AuthProvider>
        <TenantProvider>
          <AppRouter />
          <CookieConsentBanner />
        </TenantProvider>
      </AuthProvider>
    </GlobalErrorBoundary>
  );
}
