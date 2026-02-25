import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import styles from './RegisterPage.module.css';

interface FormValues {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [values, setValues] = useState<FormValues>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);

  const validate = (vals: FormValues): FormErrors => {
    const errs: FormErrors = {};
    if (!vals.username.trim()) errs.username = t('auth.required');
    if (!vals.email.trim()) errs.email = t('auth.required');
    if (!vals.firstName.trim()) errs.firstName = t('auth.required');
    if (!vals.lastName.trim()) errs.lastName = t('auth.required');
    if (!vals.password.trim()) errs.password = t('auth.required');
    else if (vals.password.length < 4) errs.password = t('auth.passwordMinLength');
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSuccess(true);
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t('auth.register')}</h1>
        {success ? (
          <p className={styles.successMsg}>{t('auth.registerSuccess')}</p>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <p className={styles.stubNote}>{t('auth.registerStub')}</p>
            {(['firstName', 'lastName', 'username', 'email', 'password'] as const).map(field => (
              <div className={styles.field} key={field}>
                <label htmlFor={field}>{t(`auth.${field}`)}</label>
                <input
                  id={field}
                  name={field}
                  type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                  value={values[field]}
                  onChange={handleChange}
                  placeholder={t(`auth.${field}Placeholder`, { defaultValue: '' })}
                  className={errors[field] ? styles.inputError : ''}
                  autoComplete={field}
                />
                {errors[field] && <span className={styles.fieldError}>{errors[field]}</span>}
              </div>
            ))}
            <button type="submit" className={styles.submitBtn}>
              {t('auth.register')}
            </button>
          </form>
        )}
        <p className={styles.switchLink}>
          {t('auth.hasAccount')} <Link to="/login">{t('auth.login')}</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
