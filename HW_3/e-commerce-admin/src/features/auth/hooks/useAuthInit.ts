import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { selectToken, selectCurrentUser } from '@/entities/user/model/userSelectors';
import { useGetMeQuery } from '@/features/auth/api/authApi';
import { setUser, logout } from '@/entities/user/model/authSlice';

const useAuthInit = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectCurrentUser);

  const { data, isError } = useGetMeQuery(undefined, {
    skip: !token || !!user,
  });

  useEffect(() => {
    if (data) {
      dispatch(setUser(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (isError && token) {
      dispatch(logout());
    }
  }, [isError, token, dispatch]);
};

export default useAuthInit;
