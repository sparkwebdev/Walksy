import React, { useContext, useEffect, useState } from 'react';
import { auth as firebaseAuth } from './firebase';

interface Auth {
  loggedIn: boolean;
  userId?: string;
  userEmail?: string;
  userCreatedAt?: string;
}
interface AuthInit {
  loading: boolean;
  auth?: Auth;
}

export const AuthContext = React.createContext<Auth>({ loggedIn: false });

export function useAuth(): Auth {
  return useContext(AuthContext);
}

export function useAuthInit(): AuthInit {
  const [authInit, setAuthInit] = useState<AuthInit>({ loading: true } );
  useEffect(() => {
    const auth = { loggedIn: false }
    setAuthInit({ loading: true, auth });
    firebaseAuth
      .signInAnonymously()
      .then(() => {
        const auth = { loggedIn: true }
        setAuthInit({ loading: false, auth });
      })
      .catch((error) => {
        const auth = { loggedIn: false }
        setAuthInit({ loading: true, auth });
        console.log(error.code, error.message);
      });
  }, []);
  return authInit;
}