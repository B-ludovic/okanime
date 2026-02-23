'use client';

import Header from '../layout/Header';
import Footer from '../layout/Footer';
import AdminSidebar from './AdminSidebar';
import '../../styles/Admin.css';

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Header />

      <div className="admin-container">
        {/* Sidebar */}
        <AdminSidebar />

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