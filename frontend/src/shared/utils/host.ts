export type HostContext = {
  mode: 'app' | 'tenant' | 'landing';
  slug: string | null;
};

export function resolveHostContext(hostname: string): HostContext {
  const segments = hostname.split('.');
  const isLocal = hostname.endsWith('localhost');
  const hasSubdomain = (segments.length > 2 && !isLocal) || (isLocal && segments.length > 1);
  const slug = hasSubdomain ? segments[0] : null;

  if (slug === 'app') {
    return { mode: 'app', slug: null };
  }

  if (slug) {
    return { mode: 'tenant', slug };
  }

  return { mode: 'landing', slug: null };
}
