import { useEffect, useState, useRef } from 'react';
import keycloak from './keycloak';

// Função de autorização por role
const hasRole = (role) =>
  keycloak.tokenParsed?.realm_access?.roles.includes(role);

export default function App() {
  const [user, setUser] = useState(null);
  const isRun = useRef(false);

  useEffect(() => {
    // Evita execução dupla no React 18 (StrictMode)
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

  // Autorização baseada em role
  if (!hasRole('admin')) {
    return <h2>🚫 Acesso negado (somente administradores)</h2>;
  }

  return (
    <div>
      <h1>🛠 Painel Administrativo</h1>

      <p>Administrador: {user.preferred_username}</p>

      <ul>
        <li>Usuários ativos: 128</li>
        <li>Serviços conectados: 3</li>
        <li>Status do sistema: OK</li>
      </ul>

      <button onClick={() => keycloak.logout()}>
        Logout
      </button>
    </div>
  );
}
