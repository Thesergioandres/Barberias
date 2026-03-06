import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import type { PlansRepository } from '../../plans/application/ports/PlansRepository';
import type { TenantsRepository } from '../../tenants/application/ports/TenantsRepository';

export class PaymentsService {
  private preferenceClient?: Preference;
  private paymentClient?: Payment;

  constructor(
    private readonly deps: {
      accessToken?: string;
      notificationUrl?: string;
      successUrl?: string;
      failureUrl?: string;
      pendingUrl?: string;
      currencyId?: string;
      plansRepository: PlansRepository;
      tenantsRepository: TenantsRepository;
    }
  ) {
    if (deps.accessToken) {
      const client = new MercadoPagoConfig({ accessToken: deps.accessToken });
      this.preferenceClient = new Preference(client);
      this.paymentClient = new Payment(client);
    }
  }

  async createPreference(input: { tenantId: string; planId: string }) {
    if (!this.preferenceClient) {
      return { error: 'Mercado Pago no configurado', statusCode: 501 } as const;
    }

    const plan = await this.deps.plansRepository.findById(input.planId);
    if (!plan) {
      return { error: 'Plan no encontrado', statusCode: 404 } as const;
    }

    const tenant = await this.deps.tenantsRepository.findById(input.tenantId);
    if (!tenant) {
      return { error: 'Tenant no encontrado', statusCode: 404 } as const;
    }

    const body = {
      items: [
        {
          title: `Plan ${plan.name} - ESSENCE FACTORY SAAS`,
          quantity: 1,
          currency_id: this.deps.currencyId || 'COP',
          unit_price: plan.price
        }
      ],
      external_reference: `${tenant.id}:${plan.id}`,
      notification_url: this.deps.notificationUrl,
      back_urls: {
        success: this.deps.successUrl,
        failure: this.deps.failureUrl,
        pending: this.deps.pendingUrl
      },
      auto_return: 'approved',
      metadata: {
        tenantId: tenant.id,
        planId: plan.id
      }
    };

    const response = await this.preferenceClient.create({ body });
    const initPoint = response.init_point || response.sandbox_init_point;
    return {
      preferenceId: response.id,
      initPoint
    } as const;
  }

  async handleWebhook(payload: { type?: string; topic?: string; data?: { id?: string } }) {
    if (!this.paymentClient) {
      return { status: 'skipped', reason: 'Mercado Pago no configurado' } as const;
    }

    const isPaymentEvent = payload.type === 'payment' || payload.topic === 'payment';
    const paymentId = payload.data?.id;
    if (!isPaymentEvent || !paymentId) {
      return { status: 'ignored' } as const;
    }

    const paymentInfo = await this.paymentClient.get({ id: paymentId });
    const metadata = (paymentInfo.metadata || {}) as { tenantId?: string; planId?: string };
    const externalRef = paymentInfo.external_reference || '';
    const [tenantIdFromRef, planIdFromRef] = externalRef.split(':');
    const tenantId = metadata.tenantId || tenantIdFromRef;
    const planId = metadata.planId || planIdFromRef;

    if (!tenantId || !planId) {
      return { status: 'error', reason: 'Referencia incompleta' } as const;
    }

    if (paymentInfo.status !== 'approved') {
      return { status: 'ignored', reason: `Estado ${paymentInfo.status}` } as const;
    }

    const plan = await this.deps.plansRepository.findById(planId);
    if (!plan) {
      return { status: 'error', reason: 'Plan no encontrado' } as const;
    }

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);

    await this.deps.tenantsRepository.update(tenantId, {
      planId: plan.id,
      planName: plan.name,
      status: 'active',
      validUntil: validUntil.toISOString()
    });

    return { status: 'updated' } as const;
  }
}
