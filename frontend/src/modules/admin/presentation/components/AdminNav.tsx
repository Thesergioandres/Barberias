import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../shared/context/AuthContext';

const baseLinks = [
  { to: '/admin', label: 'Resumen' },
  { to: '/admin/users', label: 'Usuarios' },
  { to: '/admin/services', label: 'Servicios' },
  { to: '/admin/appointments', label: 'Citas' },
  { to: '/admin/agenda', label: 'Agenda' },
  { to: '/admin/notifications', label: 'WhatsApp' },
  { to: '/admin/reports', label: 'Reportes' }
];

export function AdminNav() {
  const location = useLocation();
  const { user } = useAuth();
  const links = user?.role === 'GOD'
    ? [...baseLinks, { to: '/admin/tenants', label: 'Negocios' }, { to: '/admin/approvals', label: 'Aprobaciones' }]
    : baseLinks;

  return (
    <nav className="flex flex-wrap gap-2 text-xs">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={`app-navlink ${location.pathname === link.to ? 'border-amber-300/40 text-amber-100' : ''}`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
