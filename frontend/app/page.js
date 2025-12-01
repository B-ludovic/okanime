import Link from 'next/link';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroBanner from '../components/home/HeroBanner';
import FeaturedAnimes from '../components/home/FeaturedAnimes';
import TopRatedAnimes from '../components/home/TopRatedAnimes';
import styles from '../styles/modules/Home.module.css';

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