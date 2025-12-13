import { useEffect, useState, useRef } from 'react';
import keycloak from './keycloak';

export default function App() {
  const [user, setUser] = useState(null);
  const isRun = useRef(false);

  useEffect(() => {
    // Evita rodar duas vezes no React StrictMode
    if (isRun.current) return;
    isRun.current = true;

    keycloak
      .init({
        onLoad: 'login-required',
        pkceMethod: 'S256',
        checkLoginIframe: false
      })
      .then((authenticated) => {
        if (authenticated) {
          setUser(keycloak.tokenParsed);
        }
      })
      .catch(console.error);
  }, []);

  if (!user) return <p>Carregando...</p>;

  return (
    <div>
      <h1>👤 Minha Conta</h1>

      <p><strong>Usuário:</strong> {user.preferred_username}</p>
      <p><strong>Email:</strong> {user.email || 'não informado'}</p>
      <p><strong>Roles:</strong> {user.realm_access.roles.join(', ')}</p>

      <button onClick={() => keycloak.logout()}>
        Logout
      </button>
    </div>
  );
}
