import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content mt-auto">
      <aside>
        <div className="flex items-center gap-2 justify-center">
          <Image 
            src="/icons/japan-flag.png" 
            alt="O'Kanime" 
            width={24} 
            height={24}
            className="object-contain"
          />
          <p className="font-bold text-lg">
            O&apos;Kanime
          </p>
        </div>
        <p>Votre bibliothèque d&apos;animés personnelle</p>
        <p className="text-sm text-base-content/60">
          © {new Date().getFullYear()} - Tous droits réservés
        </p>
      </aside>
    </footer>
  );
}