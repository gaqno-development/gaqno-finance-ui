import { AuthProvider, TenantProvider } from "@gaqno-development/frontcore/contexts";
import { initI18n, I18nProvider } from "@gaqno-development/frontcore/i18n";
import { FinancePage } from "./pages/FinancePage";

initI18n();

export default function App() {
  return (
    <AuthProvider>
      <TenantProvider>
        <I18nProvider>
          <FinancePage />
        </I18nProvider>
      </TenantProvider>
    </AuthProvider>
  );
}
