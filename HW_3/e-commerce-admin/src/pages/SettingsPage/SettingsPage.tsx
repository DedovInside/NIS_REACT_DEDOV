import { useTranslation } from 'react-i18next';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import styles from './SettingsPage.module.css';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { setTheme, setLanguage, setPageSize } from '@/features/settings/model/settingsSlice';
import { selectAllSettings } from '@/features/settings/model/settingsSelectors';
import type { Theme, Language } from '@/features/settings/model/settingsSlice';

const PAGE_SIZES = [5, 10, 20, 30];

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { theme, language, pageSize } = useAppSelector(selectAllSettings);

  const handleThemeChange = (value: Theme) => {
    dispatch(setTheme(value));
  };

  const handleLanguageChange = (value: Language) => {
    dispatch(setLanguage(value));
    void i18n.changeLanguage(value);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setPageSize(Number(e.target.value)));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('settings.title')}</h1>
      <div className={styles.card}>
        <section className={styles.section}>
          <fieldset className={styles.fieldset}>
            <legend className={styles.sectionTitle}>{t('settings.theme')}</legend>
            <div className={styles.btnGroup}>
              <button
                className={`${styles.themeBtn} ${theme === 'light' ? styles.active : ''}`}
                onClick={() => handleThemeChange('light')}
                aria-pressed={theme === 'light'}
              >
                <LightModeIcon fontSize="small" /> {t('settings.themeLight')}
              </button>
              <button
                className={`${styles.themeBtn} ${theme === 'dark' ? styles.active : ''}`}
                onClick={() => handleThemeChange('dark')}
                aria-pressed={theme === 'dark'}
              >
                <DarkModeIcon fontSize="small" /> {t('settings.themeDark')}
              </button>
            </div>
          </fieldset>
        </section>

        <section className={styles.section}>
          <fieldset className={styles.fieldset}>
            <legend className={styles.sectionTitle}>{t('settings.language')}</legend>
            <div className={styles.btnGroup}>
              <button
                className={`${styles.themeBtn} ${language === 'ru' ? styles.active : ''}`}
                onClick={() => handleLanguageChange('ru')}
                aria-pressed={language === 'ru'}
              >
                RU Русский
              </button>
              <button
                className={`${styles.themeBtn} ${language === 'en' ? styles.active : ''}`}
                onClick={() => handleLanguageChange('en')}
                aria-pressed={language === 'en'}
              >
                EN English
              </button>
            </div>
          </fieldset>
        </section>

        <section className={styles.section}>
          <label htmlFor="page-size" className={styles.sectionTitle}>
            {t('settings.pageSize')}
          </label>
          <select
            id="page-size"
            value={pageSize}
            onChange={handlePageSizeChange}
            className={styles.select}
          >
            {PAGE_SIZES.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
