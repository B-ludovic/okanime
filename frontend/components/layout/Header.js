'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { User, LogOut, Search, Menu, X, ArrowLeft, LayoutDashboard, Film, Users as UsersIcon, Tag, Calendar, Star, MessageSquare } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { getCurrentUser, logout, isAuthenticated } from '../../app/lib/utils';
import styles from '../../styles/modules/Header.module.css';

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const mobileSearchInputRef = useRef(null);

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

    const handleMobileSearchClick = (e) => {
        e.preventDefault();
        if (!isSearchExpanded) {
            setIsSearchExpanded(true);
            // Focus l'input après l'expansion pour ouvrir le clavier mobile
            setTimeout(() => {
                mobileSearchInputRef.current?.focus();
            }, 100);
        } else if (searchQuery.trim()) {
            // Si déjà ouvert et qu'il y a du texte, soumettre
            handleSearch(e);
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
                    >
                        <input 
                            ref={mobileSearchInputRef}
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchExpanded(true)}
                            className={styles.mobileSearchInput}
                        />
                        <button 
                            type="button"
                            onClick={handleMobileSearchClick}
                            className={styles.mobileSearchBtn} 
                            aria-label="Rechercher"
                        >
                            <Search size={20} />
                        </button>
                        {isSearchExpanded && searchQuery && (
                            <button 
                                type="button"
                                className={styles.mobileClearBtn}
                                onClick={() => {
                                    setSearchQuery('');
                                    setIsSearchExpanded(false);
                                }}
                                aria-label="Effacer"
                            >
                                <X size={16} />
                            </button>
                        )}
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
                                <Image src="/icons/house.png" alt="Accueil" width={20} height={20} className="object-contain" />
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
                        <li>
                            <Link
                                href="/contact"
                                className={`${styles.navLink} ${pathname === '/contact' ? styles.active : ''}`}
                            >
                                <Image src="/icons/contact.png" alt="Contact" width={20} height={20} className="object-contain" />
                                Contact
                            </Link>
                        </li>
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
                                <Link href="/profil" className="btn btn-ghost btn-circle" title="Mon profil">
                                    {user?.avatar ? (
                                        <Image 
                                            src={user.avatar} 
                                            alt={user.username} 
                                            width={32} 
                                            height={32}
                                            className="rounded-full object-cover"
                                        />
                                    ) : (
                                        <User size={20} />
                                    )}
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
                    
                    <Link 
                        href="/contact" 
                        className={`${styles.drawerLink} ${isAuth ? styles.stagger4 : styles.stagger3}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <Image src="/icons/contact.png" alt="" width={22} height={22} />
                        <span>Contact</span>
                    </Link>

                    {/* Section Administration avec tous les liens */}
                    {isAuth && user?.role === 'ADMIN' && (
                        <>
                            <div className={styles.navDivider}></div>
                            <div className={styles.adminSection}>
                                <div className={styles.adminSectionTitle}>
                                    <Image src="/icons/admin.png" alt="" width={18} height={18} />
                                    <span>Administration</span>
                                </div>
                                
                                <Link 
                                    href="/admin" 
                                    className={`${styles.drawerLink} ${styles.stagger5}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <LayoutDashboard size={20} />
                                    <span>Tableau de bord</span>
                                </Link>
                                
                                <Link 
                                    href="/admin/animes" 
                                    className={`${styles.drawerLink} ${styles.stagger6}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Film size={20} />
                                    <span>Modération animés</span>
                                </Link>
                                
                                <Link 
                                    href="/admin/tous-les-animes" 
                                    className={`${styles.drawerLink} ${styles.stagger7}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Film size={20} />
                                    <span>Tous les animés</span>
                                </Link>
                                
                                <Link 
                                    href="/admin/users" 
                                    className={`${styles.drawerLink} ${styles.stagger8}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <UsersIcon size={20} />
                                    <span>Utilisateurs</span>
                                </Link>
                                
                                <Link 
                                    href="/admin/genres" 
                                    className={`${styles.drawerLink} ${styles.stagger9}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Tag size={20} />
                                    <span>Genres</span>
                                </Link>
                                
                                <Link 
                                    href="/admin/saisons" 
                                    className={`${styles.drawerLink} ${styles.wipLink} ${styles.stagger10}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Calendar size={20} />
                                    <span>Saisons</span>
                                    <Image src="/icons/work-in-progress.png" alt="WIP" width={16} height={16} />
                                </Link>
                                
                                <Link 
                                    href="/admin/avis" 
                                    className={`${styles.drawerLink} ${styles.wipLink} ${styles.stagger11}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Star size={20} />
                                    <span>Avis</span>
                                    <Image src="/icons/work-in-progress.png" alt="WIP" width={16} height={16} />
                                </Link>
                                
                                <Link 
                                    href="/admin/logs" 
                                    className={`${styles.drawerLink} ${styles.wipLink} ${styles.stagger12}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Image src="/icons/log.png" alt="" width={20} height={20} />
                                    <span>Logs d&apos;activité</span>
                                    <Image src="/icons/work-in-progress.png" alt="WIP" width={16} height={16} />
                                </Link>
                                
                                <Link 
                                    href="/admin/messages" 
                                    className={`${styles.drawerLink} ${styles.stagger13}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <MessageSquare size={20} />
                                    <span>Messages</span>
                                </Link>
                            </div>
                        </>
                    )}
                </nav>

                <div className={`${styles.drawerFooter} ${styles.stagger14}`}>
                    {isAuth ? (
                        <div className={styles.drawerUserSection}>
                            {/* Carte Profil améliorée */}
                            <div className={styles.userInfo}>
                                {/* Avatar */}
                                <div className={styles.userAvatar}>
                                    {user?.avatar ? (
                                        <Image 
                                            src={user.avatar} 
                                            alt={user.username} 
                                            width={48} 
                                            height={48}
                                            className="rounded-full object-cover"
                                            style={{ width: '100%', height: '100%' }}
                                        />
                                    ) : (
                                        user?.username?.charAt(0).toUpperCase() || 'U'
                                    )}
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
