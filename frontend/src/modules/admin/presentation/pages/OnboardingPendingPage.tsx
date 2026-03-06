import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTenant } from '../../../../shared/context/TenantContext';
import { apiRequest } from '../../../../shared/infrastructure/http/apiClient';

const ADMIN_WHATSAPP = '+573000000000';

export function OnboardingPendingPage() {
  const { tenant } = useTenant();
  const queryClient = useQueryClient();
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const companyName = tenant?.name || 'tu empresa';
  const vertical = tenant?.verticalSlug || 'servicio';
  const planId = tenant?.planId || 'plan_pro';

  const message = useMemo(() => {
    return `Hola, queremos conocer el estado de activacion de ${companyName} para ${vertical}`;
  }, [companyName, vertical]);

  const whatsappLink = `https://wa.me/${ADMIN_WHATSAPP.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
  const handleVerify = () => queryClient.invalidateQueries({ queryKey: ['tenant'] });
  const handlePayment = async () => {
    setPaymentError(null);
    setPaying(true);
    try {
      const response = await apiRequest<{ initPoint?: string }>('/payments/create-preference', {
        method: 'POST',
        body: JSON.stringify({ planId })
      });
      if (!response.initPoint) {
        throw new Error('No se pudo crear el enlace de pago.');
      }
      window.location.href = response.initPoint;
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : 'No se pudo iniciar el pago.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <section
      className="space-y-6 rounded-2xl p-6"
      style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-app)' }}
    >
      <header className="app-card">
        <h2 className="section-title">Estamos configurando tu entorno</h2>
        <p className="section-subtitle">Te avisaremos por WhatsApp cuando todo este listo.</p>
      </header>

      <div className="app-card space-y-4">
        <p className="text-sm text-muted">
          Tu cuenta esta en revision y configuracion. Si necesitas una activacion mas rapida, contactanos directamente.
        </p>
        {paymentError ? <p className="text-sm text-secondary">{paymentError}</p> : null}
        <a className="btn-secondary w-fit" href={whatsappLink} target="_blank" rel="noreferrer">
          Consultar estado por WhatsApp
        </a>
        <button
          className="btn-primary w-fit"
          type="button"
          onClick={handlePayment}
          disabled={paying}
        >
          {paying ? 'Redirigiendo a Mercado Pago...' : 'Pagar con Mercado Pago'}
        </button>
        <button className="btn-secondary w-fit" type="button" onClick={handleVerify}>
          Ya realice mi pago / Verificar ahora
        </button>
      </div>
    </section>
  );
}
