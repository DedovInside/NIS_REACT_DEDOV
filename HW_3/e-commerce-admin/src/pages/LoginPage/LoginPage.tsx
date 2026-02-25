import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import styles from './LoginPage.module.css';

import { useLoginMutation } from '@/features/auth/api/authApi';
import { setCredentials } from '@/entities/user/model/authSlice';
import { useAppDispatch } from '@/app/store/hooks';

interface FormValues {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  general?: string;
}

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [values, setValues] = useState<FormValues>({ username: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = useCallback(
    (vals: FormValues): FormErrors => {
      const errs: FormErrors = {};
      if (!vals.username.trim()) errs.username = t('auth.required');
      if (!vals.password.trim()) errs.password = t('auth.required');
      else if (vals.password.length < 4) errs.password = t('auth.passwordMinLength');
      return errs;
    },
    [t],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      const result = await login({
        username: values.username,
        password: values.password,
        expiresInMins: 60,
      }).unwrap();
      dispatch(setCredentials(result));
      navigate('/');
    } catch {
      setErrors({ general: t('auth.loginError') });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t('auth.login')}</h1>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {errors.general && <div className={styles.generalError}>{errors.general}</div>}
          <div className={styles.field}>
            <label htmlFor="username">{t('auth.username')}</label>
            <input
              id="username"
              name="username"
              type="text"
              value={values.username}
              onChange={handleChange}
              placeholder={t('auth.usernamePlaceholder')}
              className={errors.username ? styles.inputError : ''}
              autoComplete="username"
            />
            {errors.username && <span className={styles.fieldError}>{errors.username}</span>}
          </div>
          <div className={styles.field}>
            <label htmlFor="password">{t('auth.password')}</label>
            <input
              id="password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              placeholder={t('auth.passwordPlaceholder')}
              className={errors.password ? styles.inputError : ''}
              autoComplete="current-password"
            />
            {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
          </div>
          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? t('common.loading') : t('auth.login')}
          </button>
        </form>
        <p className={styles.switchLink}>
          {t('auth.noAccount')} <Link to="/register">{t('auth.register')}</Link>
        </p>
        <p className={styles.hint}>{t('auth.registerStub')}</p>
      </div>
    </div>
  );
};

export default LoginPage;
