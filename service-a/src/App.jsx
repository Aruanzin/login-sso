import { useEffect, useState, useRef } from 'react';
import keycloak from './keycloak';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const isRun = useRef(false);

  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    keycloak
      .init({
        onLoad: 'check-sso', // não força login
        pkceMethod: 'S256',
        checkLoginIframe: false,
      })
      .then((auth) => {
        setAuthenticated(auth);

        if (auth) {
          setUserInfo(keycloak.tokenParsed);
        }
      });
  }, []);

  if (!authenticated) {
    return (
      <div>
        <h1>Service A</h1>
        <button onClick={() => keycloak.login()}>
          Login com Keycloak
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Service A</h1>
      <p>Usuário: {userInfo?.preferred_username}</p>
      <p>
        Roles:{' '}
        {userInfo?.realm_access?.roles.join(', ')}
      </p>

      <a href="http://localhost:5174">Ir para Service B</a><br />
      <a href="http://localhost:5175">Ir para Service C</a><br />

      <button onClick={() => keycloak.logout()}>
        Logout
      </button>
    </div>
  );
}

export default App;
