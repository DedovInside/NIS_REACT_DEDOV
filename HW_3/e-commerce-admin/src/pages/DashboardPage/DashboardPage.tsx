import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import styles from './DashboardPage.module.css';

import { useAppSelector } from '@/app/store/hooks';
import { selectUserDisplayName } from '@/entities/user/model/userSelectors';

const DashboardPage = () => {
  const { t } = useTranslation();
  const displayName = useAppSelector(selectUserDisplayName);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('dashboard.title')}</h1>
      {displayName && (
        <p className={styles.welcome}>
          {t('dashboard.welcome')}, <strong>{displayName}</strong>!
        </p>
      )}
      <div className={styles.cards}>
        <section className={styles.card}>
          <h2>{t('dashboard.quickAccess')}</h2>
          <nav className={styles.links} aria-label={t('dashboard.quickAccess')}>
            <Link to="/products" className={styles.link}>
              <span className={styles.icon}>
                <StorefrontIcon fontSize="small" />
              </span>
              {t('dashboard.goToProducts')}
            </Link>
            <Link to="/profile" className={styles.link}>
              <span className={styles.icon}>
                <AccountBoxIcon fontSize="small" />
              </span>
              {t('dashboard.goToProfile')}
            </Link>
          </nav>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
