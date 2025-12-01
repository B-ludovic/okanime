import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const metadata = {
  title: 'O\'Kanime - Votre bibliothèque d\'animés',
  description: 'Gérez votre collection d\'animés en ligne',
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
export { metadata };