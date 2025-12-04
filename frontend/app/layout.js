import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

// Metadata SEO optimisées pour le site
export const metadata = {
  // URL de base du site (obligatoire pour Open Graph et Twitter Cards)
  metadataBase: new URL('https://okanime.live'),
  
  title: {
    default: 'O\'Kanime - Votre bibliothèque d\'animés personnelle',
    template: '%s | O\'Kanime' // Template pour les pages enfants
  },
  description: 'Découvrez, gérez et partagez votre collection d\'animés préférés. Suivez vos séries, notez vos animes et rejoignez une communauté passionnée.',
  keywords: ['anime', 'manga', 'bibliothèque anime', 'suivi anime', 'catalogue anime', 'collection anime', 'okanime'],
  authors: [{ name: 'O\'Kanime' }],
  creator: 'O\'Kanime',
  publisher: 'O\'Kanime',
  
  // Open Graph (partage réseaux sociaux)
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://okanime.live',
    siteName: 'O\'Kanime',
    title: 'O\'Kanime - Votre bibliothèque d\'animés personnelle',
    description: 'Découvrez, gérez et partagez votre collection d\'animés préférés.',
    images: [
      {
        url: '/og-image.png', // À créer plus tard
        width: 1200,
        height: 630,
        alt: 'O\'Kanime - Bibliothèque d\'animés',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'O\'Kanime - Votre bibliothèque d\'animés personnelle',
    description: 'Découvrez, gérez et partagez votre collection d\'animés préférés.',
    images: ['/og-image.png'],
  },
  
  // Métadonnées techniques
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Vérification propriétaire (à remplir si besoin)
  verification: {
    google: 'C8DSaVD375jMGKw_NRydSyuH6DqoV8DEa61aTq12BiQ',
  },
}

function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}

export default RootLayout;