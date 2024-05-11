import React, { useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth();

export function useAuthentication() {
  const [user, setUser] = useState(null); // Use null for initial state

  React.useEffect(() => {
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) 
        { 
        setUser(user);
      } else 
      {
        setUser(null);
      }
    });
    return unsubscribeFromAuthStatuChanged;
  }, []);

  return { user }; 
}