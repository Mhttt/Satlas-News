import { CircularProgress } from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuth0 } from '../components/Authentication/AzureAuth0Provider';

const Login: NextPage = () => {
  const router = useRouter();

  const { user, isLoading } = useAuth0();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(`/.auth/login/auth0`);
      } else {
        router.push(`/`);
      }
    }
  }, [isLoading]);

  return (
    // Page redirects to aut0 login
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <CircularProgress />
    </div>
  );
};
export default Login;
