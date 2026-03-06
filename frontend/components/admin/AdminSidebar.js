'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import '../../styles/Admin.css';
import {
  LayoutDashboard,
  Film,
  Users,
  Tag,
  MessageSquare,
  Shield,
  Calendar,
  Star,
  ScrollText
} from 'lucide-react';

const navLinks = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/admin/animes', label: 'Modération animés', icon: Film },
  { href: '/admin/tous-les-animes', label: 'Tous les animés', icon: Film },
  { href: '/admin/saisons', label: 'Saisons', icon: Calendar, wip: true },
  { href: '/admin/avis', label: 'Avis', icon: Star },
  { href: '/admin/logs', label: "Logs d'activité", icon: ScrollText },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/users', label: 'Utilisateurs', icon: Users },
  { href: '/admin/genres', label: 'Genres', icon: Tag },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <h2 className="admin-sidebar-title">
        <Shield size={20} className="admin-sidebar-icon" />
        Administration
      </h2>
      <nav className="admin-nav">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`admin-nav-link ${pathname === link.href ? 'active' : ''} ${link.wip ? 'wip' : ''}`}
            >
              {link.iconSrc ? (
                <Image
                  src={link.iconSrc}
                  alt={link.label}
                  width={20}
                  height={20}
                  className="admin-nav-icon-img"
                />
              ) : (
                <Icon size={20} strokeWidth={2} />
              )}
              {link.label}
              {link.wip && (
                <Image
                  src="/icons/work-in-progress.png"
                  alt="En développement"
                  width={20}
                  height={20}
                  className="wip-badge"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
