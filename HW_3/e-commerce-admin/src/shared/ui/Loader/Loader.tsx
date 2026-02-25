import { useTranslation } from 'react-i18next';

import styles from './Loader.module.css';

const Loader = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} />
      <span>{t('common.loading')}</span>
    </div>
  );
};

export default Loader;
