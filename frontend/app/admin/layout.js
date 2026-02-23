import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function AdminRootLayout({ children }) {
  return (
    <div className="admin-layout">
      <Header />
      <div className="admin-container">
        <AdminSidebar />
        <main className="admin-main">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
