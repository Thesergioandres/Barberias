export type HostContext = {
  mode: 'app' | 'tenant' | 'landing';
  slug: string | null;
};

export function resolveHostContext(hostname: string, pathname = '/'): HostContext {
  const segments = hostname.split('.');
  const isLocal = hostname.endsWith('localhost');
  const hasSubdomain = (segments.length > 2 && !isLocal) || (isLocal && segments.length > 1);
  const slug = hasSubdomain ? segments[0] : null;

  const normalizedPath = pathname.toLowerCase();
  const appPaths = ['/admin', '/staff', '/god', '/login', '/admin-login'];
  if (isLocal && !hasSubdomain && appPaths.some((path) => normalizedPath.startsWith(path))) {
    return { mode: 'app', slug: null };
  }

  if (slug === 'app') {
    return { mode: 'app', slug: null };
  }

  if (slug) {
    return { mode: 'tenant', slug };
  }

  return { mode: 'landing', slug: null };
}
