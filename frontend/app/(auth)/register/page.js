import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RegisterForm from '@/components/forms/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="page">
      <Header />
      
      <main className="main">
        <div className="container">
          <div className="card max-w-md mx-auto">
            <div className="card-body">
              <h2 className="card-title text-center" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
                Inscription
              </h2>
              <RegisterForm />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}