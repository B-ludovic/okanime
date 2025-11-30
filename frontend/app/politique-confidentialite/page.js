import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Image from 'next/image';
import styles from '../../styles/Legal.module.css';

export const metadata = {
  title: 'Politique de Confidentialité - O\'Kanime',
  description: 'Politique de confidentialité et protection des données personnelles sur O\'Kanime',
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className={styles.legalPage}>
      <Header />

      <main className={styles.legalMain}>
        <div className={styles.legalContainer}>
          <div className={styles.legalHeader}>
            <h1 className={styles.legalTitle}>Politique de Confidentialité</h1>
            <p className={styles.legalSubtitle}>
              Protection de vos données personnelles conformément au RGPD
            </p>
          </div>

          <div className={styles.legalContent}>
            {/* Introduction */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>1. Introduction</h2>
              <div className={styles.sectionContent}>
                <p>
                  O&apos;Kanime respecte votre vie privée et s&apos;engage à protéger vos données personnelles.
                  Cette politique vous explique comment nous collectons, utilisons et protégeons vos informations.
                </p>
                <div className={styles.highlight}>
                  <p>
                    <strong>Responsable du traitement des données :</strong><br />
                    Ludovic BATAILLE<br />
                    Email : <a href="mailto:contact@okanime.fr">contact@okanime.fr</a>
                  </p>
                </div>
              </div>
            </section>

            {/* Données collectées */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>2. Données collectées</h2>
              <div className={styles.sectionContent}>
                <p>Nous collectons uniquement les données nécessaires au fonctionnement du site :</p>
                
                <h3 className={styles.subsectionTitle}>
                  Lors de l&apos;inscription :
                </h3>
                <ul>
                  <li><strong>Nom d&apos;utilisateur</strong> : pour vous identifier sur le site</li>
                  <li><strong>Adresse email</strong> : pour la connexion et les communications importantes</li>
                  <li><strong>Mot de passe</strong> : stocké de manière sécurisée (hashé avec bcrypt)</li>
                </ul>

                <h3 className={styles.subsectionTitle}>
                  Lors de l&apos;utilisation :
                </h3>
                <ul>
                  <li><strong>Photo de profil</strong> (optionnelle) : stockée sur Cloudinary</li>
                  <li><strong>Bibliothèque d&apos;animés</strong> : animes ajoutés, statuts de visionnage, progression</li>
                  <li><strong>Avis et notes</strong> : commentaires et notes laissés sur les animés</li>
                  <li><strong>Données de connexion</strong> : date d&apos;inscription, dernière connexion</li>
                </ul>

                <div className={styles.highlight}>
                  <p>
                    <Image src="/icons/danger.png" alt="Attention" width={20} height={20} className={styles.dangerIcon} /> <strong>Nous ne collectons jamais :</strong><br />
                    • Données de paiement<br />
                    • Données de géolocalisation précise<br />
                    • Données sensibles (origine, santé, etc.)
                  </p>
                </div>
              </div>
            </section>

            {/* Finalité */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>3. Finalité du traitement</h2>
              <div className={styles.sectionContent}>
                <p>Vos données sont utilisées pour :</p>
                <ul>
                  <li>Créer et gérer votre compte utilisateur</li>
                  <li>Personnaliser votre expérience (bibliothèque, avis)</li>
                  <li>Assurer la sécurité et l&apos;intégrité du site</li>
                  <li>Améliorer nos services</li>
                  <li>Respecter nos obligations légales</li>
                </ul>
                <p>
                  <strong>Nous ne vendons jamais vos données à des tiers.</strong>
                </p>
              </div>
            </section>

            {/* Partage des données */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>4. Partage des données</h2>
              <div className={styles.sectionContent}>
                <p>Vos données peuvent être partagées avec :</p>
                <ul>
                  <li>
                    <strong>Render</strong> (hébergement) : stockage sécurisé de la base de données
                  </li>
                  <li>
                    <strong>Cloudinary</strong> (optionnel) : stockage des photos de profil si vous en uploadez une
                  </li>
                </ul>
                <p>
                  Ces services sont conformes au RGPD et utilisent vos données uniquement pour les finalités prévues.
                </p>
              </div>
            </section>

            {/* Durée de conservation */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>5. Durée de conservation</h2>
              <div className={styles.sectionContent}>
                <ul>
                  <li><strong>Compte actif :</strong> vos données sont conservées tant que votre compte existe</li>
                  <li><strong>Suppression de compte :</strong> toutes vos données sont supprimées définitivement</li>
                  <li><strong>Compte inactif :</strong> les comptes non utilisés depuis plus de 3 ans peuvent être supprimés</li>
                </ul>
              </div>
            </section>

            {/* Vos droits RGPD */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>6. Vos droits (RGPD)</h2>
              <div className={styles.sectionContent}>
                <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul>
                  <li><strong>Droit d&apos;accès :</strong> consulter vos données personnelles</li>
                  <li><strong>Droit de rectification :</strong> corriger vos données via votre profil</li>
                  <li><strong>Droit à l&apos;effacement :</strong> supprimer votre compte et toutes vos données</li>
                  <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format lisible</li>
                  <li><strong>Droit d&apos;opposition :</strong> vous opposer au traitement de vos données</li>
                  <li><strong>Droit de limitation :</strong> limiter le traitement de vos données</li>
                </ul>

                <div className={styles.highlight}>
                  <p>
                    <strong>Pour exercer vos droits :</strong><br />
                    Envoyez un email à <a href="mailto:contact@okanime.fr">contact@okanime.fr</a><br />
                    Réponse sous 30 jours maximum
                  </p>
                </div>
              </div>
            </section>

            {/* Sécurité */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>7. Sécurité des données</h2>
              <div className={styles.sectionContent}>
                <p>Nous mettons en œuvre des mesures de sécurité pour protéger vos données :</p>
                <ul>
                  <li><strong>Mots de passe :</strong> hashés avec bcrypt (algorithme sécurisé)</li>
                  <li><strong>Connexion HTTPS :</strong> chiffrement des communications</li>
                  <li><strong>Protection anti-XSS :</strong> filtrage des entrées utilisateur</li>
                  <li><strong>Rate limiting :</strong> protection contre les attaques par force brute</li>
                  <li><strong>Headers de sécurité :</strong> Helmet.js activé</li>
                </ul>
              </div>
            </section>

            {/* Cookies */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>8. Cookies et stockage local</h2>
              <div className={styles.sectionContent}>
                <p>
                  O&apos;Kanime utilise le <strong>localStorage</strong> de votre navigateur pour :
                </p>
                <ul>
                  <li>Stocker votre token d&apos;authentification (JWT)</li>
                  <li>Maintenir votre session connectée</li>
                </ul>
                <p>
                  Aucun cookie publicitaire ou de tracking tiers n&apos;est utilisé.
                </p>
              </div>
            </section>

            {/* Modifications */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>9. Modifications de la politique</h2>
              <div className={styles.sectionContent}>
                <p>
                  Cette politique peut être mise à jour. Les modifications importantes vous seront notifiées 
                  par email ou via une bannière sur le site.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className={styles.legalSection}>
              <h2 className={styles.sectionTitle}>10. Contact</h2>
              <div className={styles.sectionContent}>
                <p>
                  Pour toute question concernant cette politique ou vos données personnelles :
                </p>
                <div className={styles.contactInfo}>
                  <p>Email : <a href="mailto:contact@okanime.fr">contact@okanime.fr</a></p>
                  <p>Réponse sous 30 jours</p>
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
