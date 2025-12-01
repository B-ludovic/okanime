'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import '../../styles/Admin.css';
import { 
  LayoutDashboard, 
  Film, 
  Users, 
  Tag,
  MessageSquare,
  Shield,
  Calendar,
  Star
} from 'lucide-react';

function AdminLayout({ children }) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/admin/animes', label: 'Modération animés', icon: Film },
    { href: '/admin/tous-les-animes', label: 'Tous les animés', icon: Film },
    { href: '/admin/saisons', label: 'Saisons', icon: Calendar, wip: true },
    { href: '/admin/avis', label: 'Avis', icon: Star, wip: true },
    { href: '/admin/logs', label: "Logs d'activité", iconSrc: '/icons/log.png', wip: true },
    { href: '/admin/statistiques', label: 'Stats avancées', iconSrc: '/icons/advanced-statistics.png', wip: true },
    { href: '/admin/users', label: 'Utilisateurs', icon: Users },
    { href: '/admin/genres', label: 'Genres', icon: Tag },
  ];

  return (
    <div className="admin-layout">
      <Header />

      <div className="admin-container">
        {/* Sidebar */}
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

        {/* Contenu principal */}
        <main className="admin-main">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default AdminLayout;