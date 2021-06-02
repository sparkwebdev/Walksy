import React, { useContext, useEffect, useState } from 'react';
import { auth as firebaseAuth, getRemoteUserData } from './firebase';

interface Auth {
  loggedIn: boolean;
  userId?: string;
  userEmail?: string;
  userCreatedAt?: string;
  isAdmin?: boolean | undefined;
}
interface AuthInit {
  loading: boolean;
  auth?: Auth;
}

export const AuthContext = React.createContext<Auth>({ loggedIn: false, isAdmin: undefined });

export function useAuth(): Auth {
  return useContext(AuthContext);
}

async function checkUserIsAdmin(userId: string) {
  const isAdmin = await getRemoteUserData(userId).then((data) => {
    return data && data.isAdmin;
  });
  return isAdmin;
}

export function useAuthInit(): AuthInit {
  const [authInit, setAuthInit] = useState<AuthInit>({ loading: true } );
  useEffect(() => {
    return firebaseAuth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        checkUserIsAdmin(firebaseUser.uid).then((isAdmin) => {
          const auth = firebaseUser && isAdmin ? { loggedIn: true, userId: firebaseUser.uid, userEmail: firebaseUser.email!, userCreatedAt: firebaseUser.metadata.creationTime!, isAdmin: true } : { loggedIn: false, isAdmin: false }
          setAuthInit({ loading: false, auth });
        })
      } else {
        const auth = { loggedIn: false }
        setAuthInit({ loading: false, auth });
      }
    });
  }, []);
  return authInit;
}