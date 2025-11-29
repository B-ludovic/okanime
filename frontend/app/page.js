import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="page">
      <Header />
      
      <main className="main">
        <div className="container">
          <div className="hero">
            <div>
              <h1 className="hero-title">
                Bienvenue sur <span className="text-primary">O&apos;Kanime</span>
              </h1>
              <p className="hero-subtitle">
                Gérez votre collection d&apos;animés, suivez votre progression 
                et partagez vos avis avec la communauté.
              </p>
              <Link href="/anime" className="btn btn-primary btn-large">
                Découvrir les animés
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}