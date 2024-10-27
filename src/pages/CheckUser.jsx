import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';

function MyAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {  
      const data = await Auth.currentAuthenticatedUser();
      setUser(data);
    } catch (err) {
      setUser(null);
    }
  }

  function signOut() {
    Auth.signOut();
    setUser(null);
  }

  if (!user) {
    return (
      <button onClick={() => Auth.federatedSignIn()}>
        Sign in
      </button>
    );
  }

  return (
    <div>
      <div>Welcome, {user.username}!</div>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}

export default withAuthenticator(MyAuth);