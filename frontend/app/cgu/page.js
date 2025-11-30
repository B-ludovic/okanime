import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Image from 'next/image';
import styles from '../../styles/Legal.module.css';

export const metadata = {
  title: 'Conditions Générales d\'Utilisation - O\'Kanime',
  description: 'Conditions générales d\'utilisation du site O\'Kanime',
};

export default function CGUPage() {
  return (
    <div className={styles.legalPage}>
      <Header />

      <main className={styles.legalMain}>
        <div className={styles.legalContainer}>
          <div className={styles.legalHeader}>
            <h1 className={styles.legalTitle}>Conditions Générales d&apos;Utilisation</h1>
            <p className={styles.legalSubtitle}>
              Règles d&apos;utilisation du site O&apos;Kanime
            </p>
          </div>

          <div className={styles.legalContent}>
            {/* Acceptation */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>1. Acceptation des CGU</h2>
              <div className={styles.sectionContent}>
                <p>
                  En accédant et en utilisant le site O&apos;Kanime, vous acceptez d&apos;être lié par ces 
                  Conditions Générales d&apos;Utilisation (CGU). Si vous n&apos;acceptez pas ces conditions, 
                  veuillez ne pas utiliser le site.
                </p>
              </div>
            </section>

            {/* Nature du service */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>2. Nature du service</h2>
              <div className={styles.sectionContent}>
                <p>
                  O&apos;Kanime est une plateforme web gratuite permettant de :
                </p>
                <ul>
                  <li>Découvrir et rechercher des animés</li>
                  <li>Créer une bibliothèque personnelle d&apos;animés</li>
                  <li>Suivre sa progression de visionnage</li>
                  <li>Laisser des avis et notes sur les animés</li>
                  <li>Participer à une communauté d&apos;amateurs d&apos;animés</li>
                </ul>
                <div className={styles.highlight}>
                  <p>
                    <strong>Important :</strong> O&apos;Kanime est un projet étudiant et personnel. 
                    Le service est fourni &quot;tel quel&quot; sans garantie de disponibilité permanente.
                  </p>
                </div>
              </div>
            </section>

            {/* Inscription */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>3. Inscription et compte utilisateur</h2>
              <div className={styles.sectionContent}>
                <h3 className={styles.subsectionTitle}>
                  Conditions d&apos;inscription :
                </h3>
                <ul>
                  <li><strong>Âge minimum :</strong> 13 ans</li>
                  <li>Vous devez fournir des informations exactes et à jour</li>
                  <li>Un seul compte par personne</li>
                  <li>Vous êtes responsable de la confidentialité de votre mot de passe</li>
                </ul>

                <h3 className={styles.subsectionTitle}>
                  Suppression de compte :
                </h3>
                <p>
                  Vous pouvez supprimer votre compte à tout moment depuis votre profil. 
                  Toutes vos données seront définitivement effacées.
                </p>
              </div>
            </section>

            {/* Utilisation acceptable */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>4. Utilisation acceptable</h2>
              <div className={styles.sectionContent}>
                <p>En utilisant O&apos;Kanime, vous vous engagez à :</p>
                <ul>
                  <li>Respecter les autres utilisateurs</li>
                  <li>Ne pas publier de contenu offensant, haineux ou illégal</li>
                  <li>Ne pas usurper l&apos;identité d&apos;une autre personne</li>
                  <li>Ne pas spammer ou abuser des fonctionnalités du site</li>
                  <li>Ne pas tenter de pirater ou compromettre la sécurité du site</li>
                  <li>Ne pas utiliser de bots ou scripts automatisés sans autorisation</li>
                </ul>

                <div className={styles.highlight}>
                  <p>
                    <Image src="/icons/danger.png" alt="Attention" width={20} height={20} className={styles.dangerIcon} /> <strong>Sanctions :</strong> En cas de non-respect de ces règles, 
                    votre compte pourra être suspendu ou supprimé sans préavis.
                  </p>
                </div>
              </div>
            </section>

            {/* Contenu utilisateur */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>5. Contenu utilisateur</h2>
              <div className={styles.sectionContent}>
                <h3 className={styles.subsectionTitle}>
                  Vos contributions :
                </h3>
                <p>
                  En ajoutant des animés, avis ou commentaires sur O&apos;Kanime, vous :
                </p>
                <ul>
                  <li>Garantissez que vous avez le droit de publier ce contenu</li>
                  <li>Accordez à O&apos;Kanime une licence non-exclusive pour afficher ce contenu</li>
                  <li>Restez responsable du contenu que vous publiez</li>
                </ul>

                <h3 className={styles.subsectionTitle}>
                  Modération :
                </h3>
                <p>
                  O&apos;Kanime se réserve le droit de modérer, modifier ou supprimer tout contenu 
                  jugé inapproprié, sans notification préalable.
                </p>
              </div>
            </section>

            {/* Propriété intellectuelle */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>6. Propriété intellectuelle</h2>
              <div className={styles.sectionContent}>
                <h3 className={styles.subsectionTitle}>
                  Code et design :
                </h3>
                <p>
                  Le code source, le design et la structure d&apos;O&apos;Kanime sont la propriété 
                  de Ludovic BATAILLE. Toute reproduction non autorisée est interdite.
                </p>

                <h3 className={styles.subsectionTitle}>
                  Contenus d&apos;animés :
                </h3>
                <ul>
                  <li>
                    Les informations sur les animés proviennent de <strong>MyAnimeList</strong> via l&apos;API Jikan
                  </li>
                  <li>
                    Les images, titres et descriptions appartiennent à leurs créateurs et studios respectifs
                  </li>
                  <li>
                    O&apos;Kanime ne revendique aucun droit sur ces contenus et les utilise uniquement 
                    dans un cadre informatif
                  </li>
                  <li>
                    En cas de demande de retrait d&apos;un ayant droit, contactez-nous à 
                    <a href="mailto:contact@okanime.fr"> contact@okanime.fr</a>
                  </li>
                </ul>
              </div>
            </section>

            {/* Limitation de responsabilité */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>7. Limitation de responsabilité</h2>
              <div className={styles.sectionContent}>
                <p>
                  O&apos;Kanime est fourni &quot;en l&apos;état&quot;. Nous ne garantissons pas :
                </p>
                <ul>
                  <li>La disponibilité permanente du service (maintenance, pannes)</li>
                  <li>L&apos;exactitude des informations sur les animés</li>
                  <li>L&apos;absence de bugs ou d&apos;erreurs</li>
                </ul>
                <p>
                  <strong>Exclusion de garanties :</strong> Dans la limite autorisée par la loi, 
                  O&apos;Kanime décline toute responsabilité en cas de :
                </p>
                <ul>
                  <li>Perte de données</li>
                  <li>Interruption de service</li>
                  <li>Dommages directs ou indirects liés à l&apos;utilisation du site</li>
                </ul>
              </div>
            </section>

            {/* Modifications du service */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>8. Modifications du service</h2>
              <div className={styles.sectionContent}>
                <p>
                  O&apos;Kanime se réserve le droit de :
                </p>
                <ul>
                  <li>Modifier ou interrompre le service à tout moment</li>
                  <li>Ajouter ou supprimer des fonctionnalités</li>
                  <li>Mettre à jour ces CGU (vous serez informé des changements importants)</li>
                </ul>
              </div>
            </section>

            {/* Données personnelles */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>9. Données personnelles</h2>
              <div className={styles.sectionContent}>
                <p>
                  Pour plus d&apos;informations sur la collecte et le traitement de vos données, 
                  consultez notre <a href="/politique-confidentialite">Politique de Confidentialité</a>.
                </p>
              </div>
            </section>

            {/* Loi applicable */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>10. Loi applicable et litiges</h2>
              <div className={styles.sectionContent}>
                <p>
                  Ces CGU sont régies par le droit français. En cas de litige, 
                  nous vous encourageons à nous contacter d&apos;abord pour trouver une solution amiable.
                </p>
                <div className={styles.contactInfo}>
                  <p>Contact : <a href="mailto:contact@okanime.fr">contact@okanime.fr</a></p>
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
