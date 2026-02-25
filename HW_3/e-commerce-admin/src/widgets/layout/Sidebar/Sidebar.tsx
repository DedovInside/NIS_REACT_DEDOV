import { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import HomeIcon from '@mui/icons-material/Home';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import type { SvgIconComponent } from '@mui/icons-material';

import styles from './Sidebar.module.css';

interface NavItem {
  to: string;
  label: string;
  Icon: SvgIconComponent;
  end: boolean;
}

const navItems: NavItem[] = [
  { to: '/', label: 'nav.dashboard', Icon: HomeIcon, end: true },
  { to: '/products', label: 'nav.products', Icon: StorefrontIcon, end: false },
  { to: '/profile', label: 'nav.profile', Icon: AccountBoxIcon, end: false },
  { to: '/settings', label: 'nav.settings', Icon: SettingsIcon, end: false },
];

interface SidebarContentProps {
  onClose?: () => void;
  showClose?: boolean;
}

const SidebarContent = ({ onClose, showClose }: SidebarContentProps) => {
  const { t } = useTranslation();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>
          <ShoppingBagIcon fontSize="small" />
        </span>
        <span className={styles.logoText}>E-Commerce</span>
        {showClose && (
          <button className={styles.closeBtn} onClick={onClose} aria-label="Закрыть меню">
            <CloseIcon fontSize="small" />
          </button>
        )}
      </div>
      <nav className={styles.nav} aria-label={t('nav.main')}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            {({ isActive }) => (
              <>
                <span className={styles.navIcon}>
                  <item.Icon fontSize="small" />
                </span>
                <span>{t(item.label)}</span>
                {isActive && <span className={styles.srOnly} aria-current="page" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <div className={styles.desktopSidebar}>
        <SidebarContent />
      </div>

      <button
        className={`${styles.burgerBtn} ${isOpen ? styles.burgerHidden : ''}`}
        onClick={open}
        aria-label="Открыть меню"
        aria-expanded={isOpen}
      >
        <MenuIcon fontSize="small" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={styles.overlay}
              onClick={close}
            />
            <motion.div
              key="drawer"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className={styles.drawer}
            >
              <SidebarContent onClose={close} showClose />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
