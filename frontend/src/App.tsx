import { AppRouter } from './app/AppRouter';
import { AuthProvider } from './shared/context/AuthContext';
import { TenantProvider } from './shared/context/TenantContext';

export default function App() {
  return (
    <AuthProvider>
      <TenantProvider>
        <AppRouter />
      </TenantProvider>
    </AuthProvider>
  );
}
