// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import keycloak from './keycloak';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const isRun = useRef(false); // Para evitar dupla execução em React.StrictMode

  useEffect(() => {
    // Evita inicializar duas vezes em ambiente de desenvolvimento
    if (isRun.current) return;
    isRun.current = true;

    keycloak
      .init({
        onLoad: 'check-sso', // Verifica se já existe sessão sem forçar login imediato
        pkceMethod: 'S256',  // Recomendado para segurança moderna
        checkLoginIframe: false // Evita problemas com cookies de terceiros em dev
      })
      .then((auth) => {
        setAuthenticated(auth);
        if (auth) {
          // Se autenticado, carrega o perfil do utilizador
          keycloak.loadUserProfile().then((profile) => {
            setUserInfo(profile);
          });
        }
      })
      .catch((err) => {
        console.error("Falha na autenticação", err);
      });
  }, []);

  const login = () => {
    keycloak.login();
  };

  const logout = () => {
    keycloak.logout();
  };

  // Identifica qual o serviço baseado no clientId configurado
  const serviceName = keycloak.clientId ? keycloak.clientId.toUpperCase() : "SERVIÇO";

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <header style={{ borderBottom: "1px solid #ccc", marginBottom: "20px" }}>
        <h1>Aplicação: {serviceName}</h1>
      </header>

      <main>
        {authenticated ? (
          <div style={{ backgroundColor: "#e6fffa", padding: "20px", borderRadius: "8px" }}>
            <h2>Bem-vindo, {userInfo?.firstName || "Utilizador"}!</h2>
            <p>Você está autenticado no <strong>{serviceName}</strong>.</p>
            
            <div style={{ marginTop: "20px" }}>
              <strong>Os seus dados (do Token):</strong>
              <ul>
                <li><strong>Username:</strong> {userInfo?.username}</li>
                <li><strong>Email:</strong> {userInfo?.email}</li>
                <li><strong>Realm Roles:</strong> {keycloak.realmAccess?.roles.join(", ")}</li>
              </ul>
            </div>

            <button 
              onClick={logout}
              style={{ padding: "10px 20px", background: "#e53e3e", color: "white", border: "none", cursor: "pointer" }}
            >
              Terminar Sessão (Logout)
            </button>
          </div>
        ) : (
          <div style={{ backgroundColor: "#fff5f5", padding: "20px", borderRadius: "8px" }}>
            <h2>Acesso Restrito</h2>
            <p>Você não está autenticado no <strong>{serviceName}</strong>.</p>
            <p>Por favor, faça login para aceder aos recursos.</p>
            
            <button 
              onClick={login}
              style={{ padding: "10px 20px", background: "#3182ce", color: "white", border: "none", cursor: "pointer" }}
            >
              Iniciar Sessão (Login)
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;