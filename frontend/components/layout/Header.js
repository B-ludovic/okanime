'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { User, LogOut, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCurrentUser, logout, isAuthenticated } from '@/lib/utils';
import styles from '../../styles/Header.module.css';

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setIsAuth(isAuthenticated());
        setUser(getCurrentUser());
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/recherche?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerContainer}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <Image 
                        src="/icons/japan-flag.png" 
                        alt="O'Kanime" 
                        width={28} 
                        height={28}
                        className="object-contain"
                    />
                    <span className="brand-name">O&apos;Kanime</span>
                </Link>

                {/* Navigation */}
                <nav>
                    <ul className={styles.nav}>
                        <li>
                            <Link
                                href="/"
                                className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}
                            >
                                <Image src="/icons/home.png" alt="Accueil" width={20} height={20} className="object-contain" />
                                Accueil
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/anime"
                                className={`${styles.navLink} ${pathname.startsWith('/anime') ? styles.active : ''}`}
                            >
                                <Image src="/icons/anime.png" alt="Animés" width={20} height={20} className="object-contain" />
                                Animés
                            </Link>
                        </li>
                        {isAuth && (
                            <li>
                                <Link
                                    href="/bibliotheque"
                                    className={`${styles.navLink} ${pathname === '/bibliotheque' ? styles.active : ''}`}
                                >
                                    <Image src="/icons/my-library.png" alt="Ma Bibliothèque" width={20} height={20} className="object-contain" />
                                    Ma Bibliothèque
                                </Link>
                            </li>
                        )}
                    </ul>
                </nav>

                {/* Barre de recherche */}
                <form className={styles.searchBox} onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Rechercher un animé..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                    <button type="submit" className={styles.searchButton} aria-label="Rechercher">
                        <Search size={18} />
                    </button>
                </form>

                {/* Actions */}
                <div className={styles.headerActions}>
                    {isAuth ? (
                        <>
                            <Link href="/profil" className="btn btn-ghost btn-circle">
                                <User size={20} />
                            </Link>
                            <button onClick={logout} className="btn btn-ghost">
                                <LogOut size={18} />
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="btn btn-ghost">
                                <Image src="/icons/login.png" alt="Connexion" width={20} height={20} className="object-contain" />
                                Connexion
                            </Link>
                            <Link href="/register" className="btn btn-primary">
                                Inscription
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}