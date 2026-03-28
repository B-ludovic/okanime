import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import styles from '../../styles/modules/Legal.module.css';

const metadata = {
  title: 'Conditions Générales d\'Utilisation - O\'Kanime',
  description: 'Conditions générales d\'utilisation du site O\'Kanime',
};

function CGUPage() {
  return (
    <div className={styles.legalPage}>
      <Header />

      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Conditions Générales d&apos;Utilisation</h1>
        <p className={styles.heroSubtitle}>Règles d&apos;utilisation du site O&apos;Kanime</p>
      </div>

      <main className={styles.legalMain}>
        <div className={styles.legalContainer}>

          <section className={styles.legalSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>1</span>
              <h2 className={styles.sectionTitle}>Acceptation des CGU</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                L&apos;accès et l&apos;utilisation du site O&apos;Kanime sont soumis à l&apos;acceptation pleine et entière
                des présentes Conditions Générales d&apos;Utilisation. En naviguant sur le site, vous reconnaissez
                avoir pris connaissance de ces conditions et les accepter sans réserve.
              </p>
            </div>
          </section>

          <section className={styles.legalSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>2</span>
              <h2 className={styles.sectionTitle}>Description du service</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                O&apos;Kanime est une plateforme web gratuite et personnelle développée dans un cadre pédagogique.
                Elle permet aux utilisateurs de :
              </p>
              <ul>
                <li>Rechercher et consulter des fiches d&apos;animés.</li>
                <li>Gérer une bibliothèque personnelle (listes d&apos;envies, favoris).</li>
                <li>Suivre leur progression de visionnage.</li>
                <li>Publier des avis et des notes.</li>
              </ul>
              <div className={styles.infoBox}>
                <p>
                  Le service est fourni &quot;en l&apos;état&quot;. En tant que projet étudiant, O&apos;Kanime ne garantit
                  pas la pérennité du service ni la sauvegarde permanente des données.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.legalSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>3</span>
              <h2 className={styles.sectionTitle}>Inscription et sécurité du compte</h2>
            </div>
            <div className={styles.sectionBody}>
              <ul>
                <li><strong>Éligibilité :</strong> L&apos;inscription est réservée aux personnes âgées de 13 ans ou plus.</li>
                <li><strong>Exactitude :</strong> Vous vous engagez à fournir une adresse email valide et des informations exactes.</li>
                <li><strong>Responsabilité :</strong> Vous êtes seul responsable de la confidentialité de vos identifiants. Toute activité effectuée depuis votre compte est réputée être de votre fait.</li>
                <li><strong>Résiliation :</strong> Vous pouvez supprimer votre compte à tout moment via les paramètres de votre profil. Cette action est irréversible et entraîne la suppression de toutes vos données associées.</li>
              </ul>
            </div>
          </section>

          <section className={styles.legalSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>4</span>
              <h2 className={styles.sectionTitle}>Règles de conduite et utilisation acceptable</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>En utilisant O&apos;Kanime, vous vous engagez à ne pas :</p>
              <ul>
                <li>Publier des contenus illicites, injurieux, diffamatoires ou haineux.</li>
                <li>Usurper l&apos;identité d&apos;un tiers ou d&apos;un autre utilisateur.</li>
                <li>Perturber le bon fonctionnement du site (attaques par déni de service, injection de scripts malveillants, etc.).</li>
                <li>Utiliser des outils automatisés (bots, scrapers) pour extraire des données sans autorisation préalable.</li>
                <li>Créer des comptes multiples de manière abusive.</li>
              </ul>
              <div className={styles.infoBox}>
                <p>
                  <strong>Sanctions :</strong> Tout manquement à ces règles pourra entraîner la suspension temporaire
                  ou la suppression définitive du compte, sans préavis ni indemnité.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.legalSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>5</span>
              <h2 className={styles.sectionTitle}>Propriété intellectuelle</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                <strong>5.1. Propriété de l&apos;éditeur —</strong> Le code source, l&apos;architecture, le design et le logo
                d&apos;O&apos;Kanime sont la propriété exclusive de Ludovic BATAILLE. Toute reproduction, représentation
                ou adaptation de ces éléments est interdite sans accord écrit.
              </p>
              <p>
                <strong>5.2. Contenus tiers (Animés) —</strong> Les données relatives aux animés (titres, synopsis, visuels)
                sont récupérées via l&apos;API Jikan et proviennent de MyAnimeList. Ces contenus appartiennent à leurs
                studios et ayants-droit respectifs. O&apos;Kanime les utilise uniquement à des fins d&apos;information et d&apos;illustration.
              </p>
              <p>
                <strong>5.3. Contenus utilisateur —</strong> En publiant un avis ou un commentaire, vous accordez à
                O&apos;Kanime une licence gratuite et non-exclusive d&apos;affichage de ce contenu sur la plateforme.
                Vous restez propriétaire de vos écrits et responsable de leur teneur.
              </p>
            </div>
          </section>

          <section className={styles.legalSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>6</span>
              <h2 className={styles.sectionTitle}>Limitation de responsabilité</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>L&apos;éditeur met tout en œuvre pour assurer l&apos;accès au site, mais sa responsabilité ne pourra être engagée dans les cas suivants :</p>
              <ul>
                <li><strong>Interruption de service :</strong> Maintenance, pannes techniques ou cas de force majeure.</li>
                <li><strong>Contenu des données :</strong> Erreurs ou imprécisions dans les informations fournies par les API tierces.</li>
                <li><strong>Perte de données :</strong> L&apos;utilisateur est invité à ne pas considérer O&apos;Kanime comme un outil d&apos;archivage critique.</li>
                <li><strong>Comportement des tiers :</strong> L&apos;éditeur ne peut être tenu responsable des agissements ou propos tenus par les autres utilisateurs.</li>
              </ul>
            </div>
          </section>

          <section className={styles.legalSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>7</span>
              <h2 className={styles.sectionTitle}>Modifications</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                L&apos;éditeur se réserve le droit de modifier, d&apos;ajouter ou de supprimer des fonctionnalités du site
                à tout moment. Les présentes CGU peuvent également être mises à jour. La poursuite de l&apos;utilisation
                du site après modification vaut acceptation des nouvelles conditions.
              </p>
            </div>
          </section>

          <section className={styles.legalSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>8</span>
              <h2 className={styles.sectionTitle}>Protection des données</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Le traitement des données personnelles lié à l&apos;utilisation du site est détaillé dans notre{' '}
                <a href="/politique-confidentialite">Politique de Confidentialité</a>.
              </p>
            </div>
          </section>

          <section className={styles.legalSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>9</span>
              <h2 className={styles.sectionTitle}>Droit applicable et litiges</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Les présentes CGU sont soumises au droit français. En cas de différend, et avant toute action judiciaire,
                les parties s&apos;engagent à rechercher une solution amiable. À défaut, le litige sera porté devant
                les tribunaux compétents.
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
                <p>Pour toute question ou signalement de contenu inapproprié : <a href="mailto:contact@okanime.fr">contact@okanime.fr</a></p>
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

export default CGUPage;
export { metadata };
