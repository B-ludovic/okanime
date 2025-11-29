import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="hero min-h-[60vh] bg-base-200 rounded-lg">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold mb-4">
                Bienvenue sur <span className="text-primary">O&apos;Kanime</span>
              </h1>
              <p className="py-6 text-lg">
                Gérez votre collection d&apos;animés, suivez votre progression 
                et partagez vos avis avec la communauté.
              </p>
              <button className="btn btn-primary btn-lg">
                Découvrir les animés
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}