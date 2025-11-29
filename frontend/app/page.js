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
            <div className="hero-content">
              <h1 className="hero-title-main">
                Plongez au cœur de vos animes préférés avec <span className="text-primary brand-name">O&apos;Kanime</span>.
              </h1>
              <p className="hero-description">
                Du Shōnen épique au Slice of Life apaisant, chaque série mérite sa place dans votre sanctuaire. 
                <span className="brand-name">O&apos;Kanime</span> vous offre l&apos;espace parfait pour organiser vos saisons, découvrir des pépites méconnues 
                et garder une trace de chaque moment marquant.
              </p>
              <p className="hero-cta-text">
                Prêt à binge-watcher ? Organisez votre prochaine session ici.
              </p>
              <Link href="/anime" className="btn btn-secondary btn-large">
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