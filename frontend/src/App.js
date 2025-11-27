import React from 'react';
import './styles/App.css';

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1>🎌 O'Kanime</h1>
        <p>Votre bibliothèque personnelle d'animes</p>
      </header>

      <main>
        <div className="anime-grid">
          {/* Les composants animes s'afficheront ici */}
          <div className="anime-card">
            <h3>Exemple d'anime</h3>
            <p>Ceci est un exemple de card</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
