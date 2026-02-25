import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import styles from './ProfilePage.module.css';

import { useGetMeQuery } from '@/features/auth/api/authApi';
import { useAppDispatch } from '@/app/store/hooks';
import { logout } from '@/entities/user/model/authSlice';
import Loader from '@/shared/ui/Loader/Loader';
import ErrorMessage from '@/shared/ui/ErrorMessage/ErrorMessage';

const ProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: user, isLoading, isError } = useGetMeQuery();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (isLoading) return <Loader />;
  if (isError || !user) return <ErrorMessage message={t('profile.loadingError')} />;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('profile.title')}</h1>
      <section className={styles.card}>
        <div className={styles.avatarSection}>
          <img src={user.image} alt={user.username} className={styles.avatar} />
          <div className={styles.nameBlock}>
            <h2 className={styles.name}>
              {user.firstName} {user.lastName}
            </h2>
            <span className={styles.username}>@{user.username}</span>
          </div>
        </div>
        <dl className={styles.infoList}>
          <div className={styles.infoRow}>
            <dt className={styles.infoLabel}>{t('profile.email')}</dt>
            <dd className={styles.infoValue}>{user.email}</dd>
          </div>
          <div className={styles.infoRow}>
            <dt className={styles.infoLabel}>{t('profile.username')}</dt>
            <dd className={styles.infoValue}>{user.username}</dd>
          </div>
          <div className={styles.infoRow}>
            <dt className={styles.infoLabel}>{t('profile.gender')}</dt>
            <dd className={styles.infoValue}>
              {user.gender === 'male' ? t('profile.male') : t('profile.female')}
            </dd>
          </div>
        </dl>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          {t('common.logout')}
        </button>
      </section>
    </div>
  );
};

export default ProfilePage;
