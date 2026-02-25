import type { ReactNode } from 'react';

import useAuthInit from '@/features/auth/hooks/useAuthInit';

interface AuthInitProps {
  children: ReactNode;
}

const AuthInit = ({ children }: AuthInitProps) => {
  useAuthInit();
  return <>{children}</>;
};

export default AuthInit;
