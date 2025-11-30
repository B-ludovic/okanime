'use client';

import Link from 'next/link';
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
  Shield 
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/admin/animes', label: 'Modération animés', icon: Film },
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
                  className={`admin-nav-link ${pathname === link.href ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  {link.label}
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