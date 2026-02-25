import { useTranslation } from 'react-i18next';
import WarningIcon from '@mui/icons-material/Warning';

import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  const { t } = useTranslation();
  return (
    <div className={styles.error} role="alert" aria-live="polite">
      <WarningIcon className={styles.icon} />
      <p>{message ?? t('common.error')}</p>
    </div>
  );
};

export default ErrorMessage;
