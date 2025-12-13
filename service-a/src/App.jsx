import { useEffect, useState, useRef } from 'react';
import keycloak from './keycloak';

// Componente único App
export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const isRun = useRef(false);

  useEffect(() => {
    // Impede que o React rode o init duas vezes no StrictMode (desenvolvimento)
    if (isRun.current) return;
    isRun.current = true;

    keycloak
      .init({
        onLoad: 'check-sso', // Verifica se já está logado sem forçar redirecionamento
        pkceMethod: 'S256',
        checkLoginIframe: false,
      })
      .then((auth) => {
        setAuthenticated(auth);
        if (auth) {
          setUserInfo(keycloak.tokenParsed);
        }
      })
      .catch((err) => {
        console.error("Erro ao inicializar Keycloak:", err);
      });
  }, []);

  // 1. Tela de carregamento enquanto o Keycloak inicializa
  if (isRun.current && !userInfo && authenticated) {
    return <p>Carregando dados do usuário...</p>;
  }

  // 2. Tela para usuário NÃO autenticado
  if (!authenticated) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>🚀 Service A</h1>
        <p>Acesso restrito. Por favor, faça login para continuar.</p>
        <button 
          onClick={() => keycloak.login()}
          style={{ padding: '10px 20px', cursor: 'pointer', background: '#3182ce', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Login com Keycloak
        </button>
      </div>
    );
  }

  // 3. Tela para usuário AUTENTICADO (Dashboard)
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ borderBottom: '1px solid #eee', marginBottom: '20px' }}>
        <h1>📊 Dashboard Financeiro - Service A</h1>
        <p>Bem-vindo, <strong>{userInfo?.preferred_username}</strong>!</p>
      </header>

      <main>
        <div style={{ background: '#f0fff4', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>Seus Dados de Acesso:</h3>
          <p><strong>Email:</strong> {userInfo?.email}</p>
          <p><strong>Roles:</strong> {userInfo?.realm_access?.roles.join(', ')}</p>
        </div>

        <div style={{ background: '#ebf8ff', padding: '15px', borderRadius: '8px' }}>
          <h3>Resumo da Conta:</h3>
          <ul>
            <li>Saldo atual: R$ 12.450,00</li>
            <li>Entradas do mês: R$ 5.200,00</li>
            <li>Saídas do mês: R$ 3.100,00</li>
          </ul>
        </div>

        <nav style={{ marginTop: '30px' }}>
          <h4>Navegar para outros serviços:</h4>
          <a href="http://localhost:5174" style={{ marginRight: '15px' }}>🔗 Ir para Service B</a>
          <a href="http://localhost:5175">🔗 Ir para Service C</a>
        </nav>
      </main>

      <footer style={{ marginTop: '40px' }}>
        <button 
          onClick={() => keycloak.logout()}
          style={{ padding: '8px 16px', cursor: 'pointer', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Sair (Logout)
        </button>
      </footer>
    </div>
  );
}
