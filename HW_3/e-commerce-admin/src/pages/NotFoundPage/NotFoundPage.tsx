import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <main className={styles.container} role="alert" aria-live="assertive">
      <div className={styles.code}>404</div>
      <h1 className={styles.title}>{t('errors.404')}</h1>
      <p className={styles.description}>{t('errors.404Description')}</p>
      <Link to="/" className={styles.homeLink}>
        {t('errors.goHome')}
      </Link>
    </main>
  );
};

export default NotFoundPage;
