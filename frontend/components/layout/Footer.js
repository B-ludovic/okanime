import Image from 'next/image';
import styles from '../../styles/Footer.module.css';

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
        <p className={styles.footerText}>
          © {new Date().getFullYear()} - Tous droits réservés
        </p>
      </div>
    </footer>
  );
}
