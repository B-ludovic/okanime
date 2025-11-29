import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoginForm from '@/components/forms/LoginForm';

export default function LoginPage() {
  return (
    <div className="page">
      <Header />
      
      <main className="main">
        <div className="container">
          <div className="card max-w-md mx-auto">
            <div className="card-body">
              <h2 className="card-title text-center" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
                Connexion
              </h2>
              <LoginForm />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}