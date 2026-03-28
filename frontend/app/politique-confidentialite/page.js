import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import styles from '../../styles/modules/Legal.module.css';

const metadata = {
  title: 'Politique de Confidentialité - O\'Kanime',
  description: 'Politique de confidentialité et protection des données personnelles sur O\'Kanime',
};

function PolitiqueConfidentialitePage() {
  return (
    <div className={styles.legalPage}>
      <Header />

      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Politique de Confidentialité</h1>
        <p className={styles.heroSubtitle}>Protection de vos données personnelles conformément au RGPD</p>
      </div>

      <main className={styles.legalMain}>
        <div className={styles.legalContainer}>

          <section className={styles.legalSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>1</span>
              <h2 className={styles.sectionTitle}>Introduction</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Le site <strong>O&apos;Kanime</strong> respecte votre vie privée et s&apos;engage à protéger vos données personnelles.
                Cette politique détaille la manière dont nous collectons, utilisons et protégeons vos informations dans le cadre de ce projet étudiant.
              </p>
              <div className={styles.infoBox}>
                <p><strong>Responsable du traitement :</strong> Ludovic BATAILLE</p>
                <p>Contact : <a href="mailto:contact@okanime.fr">contact@okanime.fr</a></p>
              </div>
            </div>
          </section>

          <section className={styles.legalSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>2</span>
              <h2 className={styles.sectionTitle}>Données collectées</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>Nous collectons uniquement les données strictement nécessaires au fonctionnement du service :</p>
              <p><strong>Lors de l&apos;inscription :</strong></p>
              <ul>
                <li><strong>Nom d&apos;utilisateur</strong> : Pour votre identification publique sur le site.</li>
                <li><strong>Adresse email</strong> : Pour la gestion du compte, la récupération de mot de passe et les communications essentielles.</li>
                <li><strong>Mot de passe</strong> : Stocké de manière sécurisée (hashé avec l&apos;algorithme bcrypt).</li>
              </ul>
              <p><strong>Lors de l&apos;utilisation :</strong></p>
              <ul>
                <li><strong>Photo de profil</strong> (optionnelle) : Stockée via le service tiers Cloudinary.</li>
                <li><strong>Bibliothèque d&apos;animés</strong> : Liste des animés ajoutés, statuts de visionnage et progression.</li>
                <li><strong>Avis et notes</strong> : Commentaires et évaluations laissés sur les fiches animés.</li>
                <li><strong>Données de connexion</strong> : Date d&apos;inscription et date de dernière connexion.</li>
              </ul>
              <div className={styles.infoBox}>
                <p>Nous ne collectons aucune donnée bancaire, de géolocalisation précise ou de données sensibles.</p>
              </div>
            </div>
          </section>

          <section className={styles.legalSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>3</span>
              <h2 className={styles.sectionTitle}>Finalité et base légale</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>Le traitement de vos données repose sur les bases légales suivantes :</p>
              <ul>
                <li><strong>Exécution du contrat :</strong> Fournir les services de gestion de bibliothèque et de profil utilisateur.</li>
                <li><strong>Intérêt légitime :</strong> Assurer la sécurité du site (prévention du spam, protection contre les attaques).</li>
              </ul>
              <p>Vos données sont utilisées pour personnaliser votre expérience et ne sont jamais vendues à des tiers.</p>
            </div>
          </section>

          <section className={styles.legalSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>4</span>
              <h2 className={styles.sectionTitle}>Partage et transfert des données</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>Pour le fonctionnement technique d&apos;O&apos;Kanime, vos données sont partagées avec les prestataires suivants :</p>
              <div className={styles.infoBox}>
                <p><strong>Render (USA)</strong> : Hébergement de l&apos;application et de la base de données.</p>
                <p><strong>Cloudinary (USA)</strong> : Stockage des images de profil (si utilisées).</p>
              </div>
              <p>
                Étant donné que ces prestataires sont situés aux États-Unis, les transferts de données sont encadrés
                par des clauses contractuelles types afin de garantir un niveau de protection conforme au RGPD.
              </p>
            </div>
          </section>

          <section className={styles.legalSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>5</span>
              <h2 className={styles.sectionTitle}>Durée de conservation</h2>
            </div>
            <div className={styles.sectionBody}>
              <ul>
                <li><strong>Compte actif :</strong> Vos données sont conservées tant que votre compte est ouvert.</li>
                <li><strong>Inactivité :</strong> Les comptes inactifs depuis plus de 3 ans sont automatiquement supprimés.</li>
                <li><strong>Suppression :</strong> En cas de suppression de compte à votre initiative, toutes vos données (profil, bibliothèque, avis, images Cloudinary) sont effacées définitivement.</li>
              </ul>
            </div>
          </section>

          <section className={styles.legalSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>6</span>
              <h2 className={styles.sectionTitle}>Vos droits (RGPD)</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>Conformément à la réglementation européenne, vous disposez des droits suivants :</p>
              <ul>
                <li><strong>Accès et Rectification :</strong> Consulter et modifier vos informations via votre profil.</li>
                <li><strong>Effacement :</strong> Demander la suppression totale de votre compte.</li>
                <li><strong>Portabilité :</strong> Demander une copie de vos données dans un format structuré.</li>
                <li><strong>Opposition et Limitation :</strong> Vous opposer au traitement de certaines données.</li>
              </ul>
              <div className={styles.infoBox}>
                <p>Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@okanime.fr">contact@okanime.fr</a></p>
                <p>Une réponse vous sera apportée sous 30 jours maximum.</p>
                <p>Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>.</p>
              </div>
            </div>
          </section>

          <section className={styles.legalSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>7</span>
              <h2 className={styles.sectionTitle}>Sécurité</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>Nous appliquons des mesures de sécurité rigoureuses :</p>
              <ul>
                <li>Chiffrement des mots de passe via bcrypt.</li>
                <li>Communications sécurisées via protocole HTTPS.</li>
                <li>Utilisation de Helmet.js pour sécuriser les headers HTTP.</li>
                <li>Protections contre les failles XSS et les attaques par force brute (Rate limiting).</li>
              </ul>
            </div>
          </section>

          <section className={styles.legalSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>8</span>
              <h2 className={styles.sectionTitle}>Cookies et stockage local</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                O&apos;Kanime n&apos;utilise aucun cookie publicitaire ou de tracking tiers.
                Nous utilisons uniquement le <strong>localStorage</strong> de votre navigateur pour stocker votre JSON Web Token (JWT),
                ce qui permet de maintenir votre session active. Ce traceur est strictement nécessaire à la fourniture du service.
              </p>
            </div>
          </section>

          <section className={styles.legalSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>9</span>
              <h2 className={styles.sectionTitle}>Modifications</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Cette politique peut évoluer. En cas de modification majeure, vous serez informé par email ou via une notification sur le site.
              </p>
            </div>
          </section>

          <section className={styles.legalSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>10</span>
              <h2 className={styles.sectionTitle}>Contact</h2>
            </div>
            <div className={styles.sectionBody}>
              <div className={styles.infoBox}>
                <p>Pour toute question : <a href="mailto:contact@okanime.fr">contact@okanime.fr</a></p>
              </div>
            </div>
          </section>

          <p className={styles.updateDate}>Dernière mise à jour : 28 mars 2026</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default PolitiqueConfidentialitePage;
export { metadata };
