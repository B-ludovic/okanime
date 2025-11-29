import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RegisterForm from '@/components/forms/RegisterForm';
import styles from '../../../styles/Register.module.css';

export default function RegisterPage() {
  return (
    <div className={styles.registerPage}>
      <Header />
      
      <main className={styles.registerMain}>
        <div className={styles.registerContainer}>
          <div className={styles.registerCard}>
            <div className={styles.registerCardBody}>
              <h2 className={styles.registerTitle}>
                Inscription
              </h2>
              <RegisterForm />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}