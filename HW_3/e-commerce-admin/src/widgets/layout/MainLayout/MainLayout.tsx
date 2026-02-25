import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';

import styles from './MainLayout.module.css';

import PageTransition from '@/shared/ui/PageTransition/PageTransition';

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <main className={styles.content}>
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
