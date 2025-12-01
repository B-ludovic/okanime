import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import LoginForm from '../../../components/forms/LoginForm';
import styles from '../../../styles/modules/Login.module.css';

function LoginPage() {
  return (
    <div className={styles.loginPage}>
      <Header />
      
      <main className={styles.loginMain}>
        <div className={styles.loginContainer}>
          <div className={styles.loginCard}>
            <div className={styles.loginCardBody}>
              <h2 className={styles.loginTitle}>
                Connexion
              </h2>
              <LoginForm />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LoginPage;