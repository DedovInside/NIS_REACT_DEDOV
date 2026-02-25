import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import styles from './Header.module.css';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { logout } from '@/entities/user/model/authSlice';
import { selectCurrentUser } from '@/entities/user/model/userSelectors';
import { setTheme, setLanguage } from '@/features/settings/model/settingsSlice';
import { selectTheme, selectLanguage } from '@/features/settings/model/settingsSelectors';
import type { Theme, Language } from '@/features/settings/model/settingsSlice';

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const theme = useAppSelector(selectTheme);
  const language = useAppSelector(selectLanguage);

  const toggleTheme = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(next));
  };

  const toggleLanguage = () => {
    const next: Language = language === 'ru' ? 'en' : 'ru';
    dispatch(setLanguage(next));
    void i18n.changeLanguage(next);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.left} />
      <div className={styles.right}>
        <button
          className={styles.iconBtn}
          onClick={toggleTheme}
          aria-label={theme === 'light' ? t('settings.themeDark') : t('settings.themeLight')}
          title={t('settings.theme')}
        >
          {theme === 'light' ? (
            <DarkModeIcon fontSize="small" />
          ) : (
            <LightModeIcon fontSize="small" />
          )}
        </button>
        <button
          className={styles.iconBtn}
          onClick={toggleLanguage}
          aria-label={t('settings.language')}
          title={t('settings.language')}
        >
          {language === 'ru' ? 'EN' : 'RU'}
        </button>
        {user && (
          <div className={styles.userInfo}>
            <img
              src={user.image}
              alt={`${user.firstName} ${user.lastName}`}
              className={styles.avatar}
            />
            <span className={styles.userName}>{user.firstName}</span>
          </div>
        )}
        <button className={styles.logoutBtn} onClick={handleLogout} aria-label={t('common.logout')}>
          {t('common.logout')}
        </button>
      </div>
    </header>
  );
};

export default Header;
