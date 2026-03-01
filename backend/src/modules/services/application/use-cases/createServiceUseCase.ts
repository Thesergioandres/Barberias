import type { ServicesRepository } from '../ports/ServicesRepository';

export class CreateServiceUseCase {
  constructor(private readonly deps: { servicesRepository: ServicesRepository }) {}

  private error(message: string, statusCode: number) {
    return { error: message, statusCode };
  }

  async execute({
    tenantId,
    name,
    description,
    durationMinutes,
    price,
    active
  }: {
    tenantId?: string;
    name?: string;
    description?: string;
    durationMinutes?: number;
    price?: number;
    active?: boolean;
  }): Promise<{ service: Awaited<ReturnType<ServicesRepository['create']>> } | { error: string; statusCode: number }> {
    if (!name || !durationMinutes || !price) {
      return this.error('name, durationMinutes y price son requeridos', 400);
    }
    if (!tenantId) {
      return this.error('tenantId es requerido', 400);
    }

    if (Number(durationMinutes) <= 0 || Number(price) <= 0) {
      return this.error('durationMinutes y price deben ser mayores a cero', 400);
    }

    const service = await this.deps.servicesRepository.create({
      tenantId,
      name,
      description,
      durationMinutes,
      price,
      active
    });

    return { service };
  }
}
