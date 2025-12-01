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

      <main className={styles.legalMain}>
        <div className={styles.legalContainer}>
          <div className={styles.legalHeader}>
            <h1 className={styles.legalTitle}>Mentions Légales</h1>
            <p className={styles.legalSubtitle}>
              Informations légales concernant le site O&apos;Kanime
            </p>
          </div>

          <div className={styles.legalContent}>
            {/* Éditeur du site */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>1. Éditeur du site</h2>
              <div className={styles.sectionContent}>
                <p>
                  Le site <strong>O&apos;Kanime</strong> est un projet étudiant et personnel développé par :
                </p>
                <div className={styles.contactInfo}>
                  <p><strong>Ludovic BATAILLE</strong></p>
                  <p>Directeur de publication : Ludovic BATAILLE</p>
                  <p>Email : <a href="mailto:contact@okanime.fr">contact@okanime.fr</a></p>
                </div>
                <p>
                  Ce site est développé dans un cadre éducatif et personnel, 
                  et est amené à évoluer au fil du temps.
                </p>
              </div>
            </section>

            {/* Hébergement */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>2. Hébergement</h2>
              <div className={styles.sectionContent}>
                <p>Le site O&apos;Kanime est hébergé par :</p>
                <div className={styles.contactInfo}>
                  <p><strong>Render</strong></p>
                  <p>525 Brannan Street, Suite 300</p>
                  <p>San Francisco, CA 94107, USA</p>
                  <p>Site web : <a href="https://render.com" target="_blank" rel="noopener noreferrer">https://render.com</a></p>
                </div>
              </div>
            </section>

            {/* Propriété intellectuelle */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>3. Propriété intellectuelle</h2>
              <div className={styles.sectionContent}>
                <p>
                  Le code source, le design et la structure du site O&apos;Kanime sont la propriété de Ludovic BATAILLE.
                </p>
                <p>
                  <strong>Contenus tiers :</strong>
                </p>
                <ul>
                  <li>
                    Les informations sur les animés (titres, synopsis, images) proviennent de l&apos;API 
                    <strong> Jikan</strong> (<a href="https://jikan.moe" target="_blank" rel="noopener noreferrer">https://jikan.moe</a>), 
                    qui récupère ses données depuis <strong>MyAnimeList</strong>.
                  </li>
                  <li>
                    Les droits d&apos;auteur des images et contenus d&apos;animés appartiennent à leurs créateurs et studios respectifs.
                  </li>
                  <li>
                    O&apos;Kanime ne revendique aucun droit sur ces contenus et les utilise uniquement dans un cadre informatif et éducatif.
                  </li>
                </ul>
              </div>
            </section>

            {/* Données personnelles */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>4. Données personnelles</h2>
              <div className={styles.sectionContent}>
                <p>
                  Pour en savoir plus sur la collecte et le traitement de vos données personnelles, 
                  consultez notre <a href="/politique-confidentialite">Politique de Confidentialité</a>.
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>5. Cookies</h2>
              <div className={styles.sectionContent}>
                <p>
                  Le site O&apos;Kanime utilise uniquement des cookies essentiels pour le fonctionnement du site :
                </p>
                <ul>
                  <li><strong>Token d&apos;authentification :</strong> Stocké localement pour maintenir votre session.</li>
                  <li>Aucun cookie publicitaire ou de tracking n&apos;est utilisé.</li>
                </ul>
              </div>
            </section>

            {/* Responsabilité */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>6. Limitation de responsabilité</h2>
              <div className={styles.sectionContent}>
                <p>
                  O&apos;Kanime est un projet étudiant et personnel fourni &quot;tel quel&quot;. 
                  L&apos;éditeur s&apos;efforce de maintenir le site accessible et fonctionnel, 
                  mais ne peut garantir :
                </p>
                <ul>
                  <li>La disponibilité permanente du site</li>
                  <li>L&apos;exactitude des informations fournies</li>
                  <li>L&apos;absence d&apos;erreurs ou de bugs</li>
                </ul>
                <p>
                  L&apos;éditeur décline toute responsabilité en cas de dommages directs ou indirects 
                  résultant de l&apos;utilisation du site.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>7. Contact</h2>
              <div className={styles.sectionContent}>
                <p>
                  Pour toute question concernant ces mentions légales, vous pouvez nous contacter :
                </p>
                <div className={styles.contactInfo}>
                  <p>Email : <a href="mailto:contact@okanime.fr">contact@okanime.fr</a></p>
                </div>
              </div>
            </section>

            <div className={styles.updateDate}>
              Dernière mise à jour : 30 novembre 2025
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default MentionsLegalesPage;
export { metadata };