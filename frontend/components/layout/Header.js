'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, User, LogIn, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCurrentUser, logout, isAuthenticated } from '@/lib/utils';

export default function Header() {
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        setIsAuth(isAuthenticated());
        setUser(getCurrentUser());
    }, []);

    return (
        <header className="header">
            <div className="header-container">
                {/* Logo */}
                <Link href="/" className="logo">
                    <Image 
                        src="/icons/japan-flag.png" 
                        alt="O'Kanime" 
                        width={24} 
                        height={24}
                        className="object-contain"
                    />
                    O&apos;Kanime
                </Link>

                {/* Navigation */}
                <nav>
                    <ul className="nav">
                        <li>
                            <Link
                                href="/"
                                className={`nav-link ${pathname === '/' ? 'active' : ''}`}
                            >
                                <Home size={18} />
                                Accueil
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/anime"
                                className={`nav-link ${pathname.startsWith('/anime') ? 'active' : ''}`}
                            >
                                <BookOpen size={18} />
                                Animés
                            </Link>
                        </li>
                        {isAuth && (
                            <li>
                                <Link
                                    href="/bibliotheque"
                                    className={`nav-link ${pathname === '/bibliotheque' ? 'active' : ''}`}
                                >
                                    <BookOpen size={18} />
                                    Ma Bibliothèque
                                </Link>
                            </li>
                        )}
                    </ul>
                </nav>

                {/* Actions */}
                <div className="header-actions">
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
                                <LogIn size={18} />
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