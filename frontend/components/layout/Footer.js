import Image from 'next/image';
import Link from 'next/link';
import styles from '../../styles/modules/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLogo}>
          <Image 
            src="/icons/japan-flag.png" 
            alt="O'Kanime" 
            width={24} 
            height={24}
            className="object-contain"
          />
          <p className={styles.footerTitle}><span className="brand-name">O&apos;Kanime</span></p>
        </div>
        <p className={styles.footerText}>Votre bibliothèque d&apos;animés personnelle</p>
        
        <div className={styles.footerLinks}>
          <Link href="/mentions-legales" className={styles.footerLink}>
            Mentions Légales
          </Link>
          <span className={styles.footerSeparator}>•</span>
          <Link href="/politique-confidentialite" className={styles.footerLink}>
            Politique de Confidentialité
          </Link>
          <span className={styles.footerSeparator}>•</span>
          <Link href="/cgu" className={styles.footerLink}>
            CGU
          </Link>
        </div>
        
        <p className={styles.footerText}>
          © {new Date().getFullYear()} - Tous droits réservés
        </p>
      </div>
    </footer>
  );
}
