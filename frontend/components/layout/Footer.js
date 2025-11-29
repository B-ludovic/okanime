import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <Image 
            src="/icons/japan-flag.png" 
            alt="O'Kanime" 
            width={24} 
            height={24}
            className="object-contain"
          />
          <p className="footer-title"><span className="brand-name">O&apos;Kanime</span></p>
        </div>
        <p className="footer-text">Votre bibliothèque d&apos;animés personnelle</p>
        <p className="footer-text">
          © {new Date().getFullYear()} - Tous droits réservés
        </p>
      </div>
    </footer>
  );
}
