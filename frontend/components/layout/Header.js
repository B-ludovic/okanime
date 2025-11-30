'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { User, LogOut, Search, Menu, X, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCurrentUser, logout, isAuthenticated } from '../../app/lib/utils';
import styles from '../../styles/Header.module.css';

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            setIsAuth(isAuthenticated());
            setUser(getCurrentUser());
        };
        checkAuth();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/recherche?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchExpanded(false);
            setIsMobileMenuOpen(false);
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

                {/* Contrôles mobile : Recherche extensible + Burger */}
                <div className={styles.mobileControls}>
                    {/* Formulaire de recherche extensible */}
                    <form 
                        onSubmit={handleSearch} 
                        className={`${styles.mobileSearchForm} ${isSearchExpanded ? styles.expanded : ''}`}
                        onFocus={() => setIsSearchExpanded(true)}
                        onBlur={() => {
                            if (!searchQuery) setIsSearchExpanded(false);
                        }}
                    >
                        <input 
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.mobileSearchInput}
                        />
                        <button type="submit" className={styles.mobileSearchBtn} aria-label="Rechercher">
                            <Search size={20} />
                        </button>
                    </form>
                    
                    {/* Bouton Burger */}
                    <button 
                        className={styles.mobileIconBtn}
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Menu"
                    >
                        <Menu size={28} />
                    </button>
                </div>

                {/* Navigation desktop */}
                <nav className={styles.navWrapper}>
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

                {/* Header Right (Desktop) */}
                <div className={styles.headerRight}>
                    {isAuth && user?.role === 'ADMIN' && (
                        <Link
                            href="/admin"
                            className={`${styles.adminLink} ${pathname.startsWith('/admin') ? styles.active : ''}`}
                        >
                            <Image src="/icons/admin.png" alt="Admin" width={20} height={20} className="object-contain" />
                            Admin
                        </Link>
                    )}

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
            </div>

            {/* Backdrop */}
            <div 
                className={`${styles.mobileBackdrop} ${isMobileMenuOpen ? styles.backdropVisible : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Drawer */}
            <div className={`${styles.mobileDrawer} ${isMobileMenuOpen ? styles.drawerOpen : ''}`}>
                <div className={styles.drawerHeader}>
                    <span className={styles.drawerTitle}>Menu</span>
                    <button onClick={() => setIsMobileMenuOpen(false)} className={styles.drawerClose}>
                        <X size={24} />
                    </button>
                </div>

                <nav className={styles.drawerNav}>
                    <Link 
                        href="/" 
                        className={`${styles.drawerLink} ${styles.stagger1}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <Image src="/icons/home.png" alt="" width={22} height={22} />
                        <span>Accueil</span>
                    </Link>
                    <Link 
                        href="/anime" 
                        className={`${styles.drawerLink} ${styles.stagger2}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <Image src="/icons/anime.png" alt="" width={22} height={22} />
                        <span>Animés</span>
                    </Link>
                    
                    {isAuth && (
                        <Link 
                            href="/bibliotheque" 
                            className={`${styles.drawerLink} ${styles.stagger3}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <Image src="/icons/my-library.png" alt="" width={22} height={22} />
                            <span>Ma Bibliothèque</span>
                        </Link>
                    )}

                    {/* Séparateur pour l'Admin */}
                    {isAuth && user?.role === 'ADMIN' && (
                        <>
                            <div className={styles.navDivider}></div>
                            <Link 
                                href="/admin" 
                                className={`${styles.drawerLink} ${styles.adminDrawerLink} ${styles.stagger4}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Image src="/icons/admin.png" alt="" width={22} height={22} />
                                <span>Administration</span>
                            </Link>
                        </>
                    )}
                </nav>

                <div className={`${styles.drawerFooter} ${styles.stagger5}`}>
                    {isAuth ? (
                        <div className={styles.drawerUserSection}>
                            {/* Carte Profil améliorée */}
                            <div className={styles.userInfo}>
                                {/* Avatar avec l'initiale */}
                                <div className={styles.userAvatar}>
                                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className={styles.userDetails}>
                                    <strong>{user?.username}</strong>
                                    <small>{user?.role}</small>
                                </div>
                            </div>

                            {/* Boutons en grille */}
                            <div className={styles.userActionsGrid}>
                                <Link 
                                    href="/profil" 
                                    className="btn btn-ghost btn-sm w-full" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Profil
                                </Link>
                                <button 
                                    onClick={() => { logout(); setIsMobileMenuOpen(false); }} 
                                    className="btn btn-danger btn-sm w-full"
                                >
                                    Déconnexion
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.drawerAuthSection}>
                            <Link href="/login" className="btn btn-ghost w-full" onClick={() => setIsMobileMenuOpen(false)}>
                                Connexion
                            </Link>
                            <Link href="/register" className="btn btn-primary w-full" onClick={() => setIsMobileMenuOpen(false)}>
                                Inscription
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
