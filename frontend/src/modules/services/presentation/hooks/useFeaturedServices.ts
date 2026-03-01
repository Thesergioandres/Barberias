import { useEffect, useMemo, useState } from 'react';
import type { Service } from '../../domain/entities/Service';
import { getFeaturedServices } from '../../application/use-cases/getFeaturedServices';
import { MockServiceRepository } from '../../infrastructure/repositories/MockServiceRepository';

export function useFeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const serviceRepository = useMemo(() => new MockServiceRepository(), []);

  useEffect(() => {
    async function load() {
      try {
        const data = await getFeaturedServices(serviceRepository);
        setServices(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [serviceRepository]);

  return { services, loading };
}
