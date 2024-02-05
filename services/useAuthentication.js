import React, { useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

const auth = getAuth();

export function useAuthentication() 
{
  const [user, setUser] = useState('');

  React.useEffect(() => 
  {
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(auth, (user) => 
    {
      if (user) 
      {
        setUser(user);
      } else 
      {
        setUser(undefined);
      }
    });

    return unsubscribeFromAuthStatuChanged;
  }, []);

  return {
    user
  };
}