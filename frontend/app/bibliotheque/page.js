'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BiblioCard from '@/components/bibliotheque/BiblioCard';
import BiblioModal from '@/components/bibliotheque/BiblioModal';
import api from '@/lib/api';
import { isAuthenticated } from '@/lib/utils';
import { STATUTS_BIBLIOTHEQUE } from '@/lib/constants';
import styles from '../../styles/Bibliotheque.module.css';
import { BookOpen, Filter } from 'lucide-react';

export default function BibliothequePage() {
  const router = useRouter();
  const [bibliotheque, setBibliotheque] = useState([]);
  const [filteredBibliotheque, setFilteredBibliotheque] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('TOUS');
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Vérifie l'authentification
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  // Récupère la bibliothèque
  const fetchBibliotheque = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/bibliotheque');
      setBibliotheque(response.data.bibliotheque);
      setFilteredBibliotheque(response.data.bibliotheque);
    } catch (err) {
      setError('Erreur lors du chargement de votre bibliothèque');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      fetchBibliotheque();
    }
  }, []);

  // Filtre par statut
  const handleFilter = (statut) => {
    setActiveFilter(statut);
    if (statut === 'TOUS') {
      setFilteredBibliotheque(bibliotheque);
    } else {
      setFilteredBibliotheque(bibliotheque.filter((entry) => entry.statut === statut));
    }
  };

  // Ouvre le modal de modification
  const handleUpdate = (entry) => {
    setSelectedEntry(entry);
  };

  // Sauvegarde les modifications
  const handleSave = async (formData) => {
    try {
      await api.put(`/bibliotheque/${selectedEntry.id}`, formData);
      setSelectedEntry(null);
      fetchBibliotheque(); // Recharge la bibliothèque
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      alert('Erreur lors de la mise à jour');
    }
  };

  // Supprime une entrée
  const handleDelete = async (entry) => {
    if (!confirm(`Voulez-vous vraiment retirer "${entry.saison.anime.titreVf}" de votre bibliothèque ?`)) {
      return;
    }

    try {
      await api.delete(`/bibliotheque/${entry.id}`);
      fetchBibliotheque();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      alert('Erreur lors de la suppression');
    }
  };

  // Compte par statut
  const getCountByStatus = (statut) => {
    if (statut === 'TOUS') return bibliotheque.length;
    return bibliotheque.filter((entry) => entry.statut === statut).length;
  };

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>Ma Bibliothèque</h1>
            <p className={styles.subtitle}>
              {bibliotheque.length} anime{bibliotheque.length > 1 ? 's' : ''} dans votre collection
            </p>
          </div>

          {/* Filtres */}
          <div className={styles.filters}>
            <button
              className={`${styles.filterButton} ${activeFilter === 'TOUS' ? styles.active : ''}`}
              onClick={() => handleFilter('TOUS')}
            >
              <Filter size={16} />
              Tous ({getCountByStatus('TOUS')})
            </button>
            <button
              className={`${styles.filterButton} ${styles.aVoir} ${activeFilter === 'A_VOIR' ? styles.active : ''}`}
              onClick={() => handleFilter('A_VOIR')}
            >
              À voir ({getCountByStatus('A_VOIR')})
            </button>
            <button
              className={`${styles.filterButton} ${styles.enCours} ${activeFilter === 'EN_COURS' ? styles.active : ''}`}
              onClick={() => handleFilter('EN_COURS')}
            >
              En cours ({getCountByStatus('EN_COURS')})
            </button>
            <button
              className={`${styles.filterButton} ${styles.vu} ${activeFilter === 'VU' ? styles.active : ''}`}
              onClick={() => handleFilter('VU')}
            >
              Vu ({getCountByStatus('VU')})
            </button>
            <button
              className={`${styles.filterButton} ${styles.favori} ${activeFilter === 'FAVORI' ? styles.active : ''}`}
              onClick={() => handleFilter('FAVORI')}
            >
              Favoris ({getCountByStatus('FAVORI')})
            </button>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          {/* Chargement */}
          {loading ? (
            <div className={styles.loadingContainer}>
              <span className="loading"></span>
            </div>
          ) : (
            <>
              {/* Grille */}
              {filteredBibliotheque.length > 0 ? (
                <div className={styles.grid}>
                  {filteredBibliotheque.map((entry) => (
                    <BiblioCard
                      key={entry.id}
                      entry={entry}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.empty}>
                  <div className={styles.emptyIcon}>
                    <Image src="/icons/empty.png" alt="Vide" width={64} height={64} />
                  </div>
                  <h2 className={styles.emptyTitle}>
                    {activeFilter === 'TOUS'
                      ? 'Votre bibliothèque est vide'
                      : `Aucun anime en "${STATUTS_BIBLIOTHEQUE[activeFilter]}"`}
                  </h2>
                  <p className={styles.emptyText}>
                    {activeFilter === 'TOUS'
                      ? 'Commencez à ajouter des animés à votre collection !'
                      : 'Ajoutez des animés dans cette catégorie pour les voir ici.'}
                  </p>
                  {activeFilter === 'TOUS' && (
                    <button
                      className="btn btn-primary"
                      onClick={() => router.push('/anime')}
                    >
                      <BookOpen size={18} />
                      Découvrir des animés
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />

      {/* Modal de modification */}
      {selectedEntry && (
        <BiblioModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}