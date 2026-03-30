import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import styles from '../../styles/modules/Legal.module.css';

const metadata = {
  title: 'Mentions Légales - O\'Kanime',
  description: 'Mentions légales du site O\'Kanime',
};

function MentionsLegalesPage() {
  return (
    <div className={styles.legalPage}>
      <Header />

      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Mentions Légales</h1>
        <p className={styles.heroSubtitle}>Informations légales concernant le site O&apos;Kanime</p>
      </div>

      <main className={styles.legalMain}>
        <div className={styles.legalContainer}>

          <section className={styles.legalSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>1</span>
              <h2 className={styles.sectionTitle}>Éditeur du site</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Le site <strong>O&apos;Kanime</strong> est un projet personnel réalisé dans un cadre pédagogique, édité par :
              </p>
              <div className={styles.infoBox}>
                <p><strong>Ludovic BATAILLE</strong></p>
                <p>Statut : Particulier / Étudiant</p>
                <p>Directeur de la publication : Ludovic BATAILLE</p>
                <p>Contact : <a href="mailto:contact@okanime.fr">contact@okanime.fr</a></p>
              </div>
            </div>
          </section>

          <section className={styles.legalSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>2</span>
              <h2 className={styles.sectionTitle}>Hébergement</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>Le site est hébergé par la société <strong>Render Services, Inc.</strong></p>
              <div className={styles.infoBox}>
                <p>525 Brannan Street, Suite 300, San Francisco, CA 94107, USA</p>
                <p>Contact : <a href="https://render.com/contact" target="_blank" rel="noopener noreferrer">https://render.com/contact</a></p>
              </div>
            </div>
          </section>

          <section className={styles.legalSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>3</span>
              <h2 className={styles.sectionTitle}>Propriété intellectuelle</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                <strong>Structure du site :</strong> Le code source, le design et l&apos;interface sont la propriété exclusive de Ludovic BATAILLE.
              </p>
              <p>
                <strong>Conception et développement :</strong>{' '}
                <a href="https://www.lechoppeducode.com" target="_blank" rel="noopener noreferrer">L&apos;Echoppe du Code</a>{' '}
              </p>
              <p>
                <strong>Contenus tiers :</strong> Les métadonnées (titres, synopsis, notes) et visuels des œuvres proviennent de l&apos;API{' '}
                <strong>Jikan</strong> (basée sur MyAnimeList). Ces contenus restent la propriété de leurs auteurs, studios et ayants-droit respectifs.
                O&apos;Kanime les diffuse à but purement informatif et non commercial.
              </p>
              <p>
                <strong>Droit de retrait :</strong> Tout ayant-droit souhaitant le retrait d&apos;un contenu spécifique peut en faire la demande à :{' '}
                <a href="mailto:contact@okanime.fr">contact@okanime.fr</a>.
              </p>
            </div>
          </section>

          <section className={styles.legalSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>4</span>
              <h2 className={styles.sectionTitle}>Protection des données personnelles</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Conformément au RGPD, l&apos;utilisateur dispose d&apos;un droit d&apos;accès, de rectification et de suppression des données le concernant.
                Pour toute demande, ou pour consulter notre gestion des données, référez-vous à notre{' '}
                <a href="/politique-confidentialite">Politique de Confidentialité</a>.
              </p>
            </div>
          </section>

          <section className={styles.legalSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>5</span>
              <h2 className={styles.sectionTitle}>Cookies et traceurs</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Le site utilise exclusivement des traceurs strictement nécessaires à la fourniture du service (gestion de la session utilisateur via token).
                Conformément aux recommandations de la CNIL, ces outils sont dispensés de consentement préalable car ils ne servent à aucune fin publicitaire ou de profilage.
              </p>
            </div>
          </section>

          <section className={styles.legalSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>6</span>
              <h2 className={styles.sectionTitle}>Responsabilité</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                L&apos;éditeur ne saurait être tenu responsable des erreurs de données transmises par les API tierces, ni d&apos;une interruption temporaire du service.
                L&apos;utilisation des informations présentes sur le site se fait sous l&apos;entière responsabilité de l&apos;utilisateur.
              </p>
            </div>
          </section>

          <p className={styles.updateDate}>Dernière mise à jour : 28 mars 2026</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default MentionsLegalesPage;
export { metadata };
