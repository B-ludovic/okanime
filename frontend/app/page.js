import Link from 'next/link';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroBanner from '../components/home/HeroBanner';
import FeaturedAnimes from '../components/home/FeaturedAnimes';
import TopRatedAnimes from '../components/home/TopRatedAnimes';
import styles from '../styles/modules/Home.module.css';

// Metadata SEO pour la page d'accueil
// Ces infos apparaissent dans Google et sur les réseaux sociaux
export const metadata = {
  title: 'Accueil', // Sera affiché comme "Accueil | O'Kanime" grâce au template
  description: 'Découvrez votre bibliothèque d\'animés personnelle. Suivez vos séries préférées, du Shōnen au Slice of Life, notez vos animes et partagez vos découvertes avec la communauté.',
  keywords: ['anime streaming', 'catalogue anime', 'suivi anime', 'bibliothèque manga', 'shonen', 'seinen', 'slice of life'],
  
  // Open Graph spécifique à la page d'accueil
  openGraph: {
    title: 'O\'Kanime - Découvrez et organisez vos animés préférés',
    description: 'Votre sanctuaire personnel pour gérer, noter et suivre toutes vos séries d\'animation japonaise préférées.',
    url: 'https://okanime.live',
  },
  
  // Twitter Card spécifique
  twitter: {
    title: 'O\'Kanime - Découvrez et organisez vos animés préférés',
    description: 'Votre sanctuaire personnel pour gérer, noter et suivre toutes vos séries d\'animation japonaise préférées.',
  },
}

function Home() {
  return (
    <div className={styles.page}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.hero}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Plongez au cœur de vos animes préférés avec <span className={`${styles.textPrimary} brand-name`}>O&apos;Kanime</span>.
              </h1>
              <p className={styles.heroDescription}>
                Du Shōnen épique au Slice of Life apaisant, chaque série mérite sa place dans votre sanctuaire. 
                <span className="brand-name">O&apos;Kanime</span> vous offre l&apos;espace parfait pour organiser vos saisons, découvrir des pépites méconnues 
                et garder une trace de chaque moment marquant.
              </p>
              <p className={styles.heroCtaText}>
                Prêt à binge-watcher ? Organisez votre prochaine session ici.
              </p>
              <Link href="/anime" className="btn btn-secondary btn-large">
                Découvrir les animés
              </Link>
            </div>
          </div>

          {/* Hero Banner rotatif */}
          <HeroBanner />

          {/* Section derniers ajouts */}
          <FeaturedAnimes />

          {/* Section les mieux notés */}
          <TopRatedAnimes />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;