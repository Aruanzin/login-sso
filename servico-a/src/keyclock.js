// src/keycloak.js
import Keycloak from "keycloak-js";

// Configuração para ligar ao Keycloak a correr no Docker
const keycloakConfig = {
  url: "http://localhost:8080", // O URL onde o Keycloak está a correr
  realm: "sso-demo",            // O nome do realm que criou
  clientId: "service-a",        // ALTERAR AQUI: 'service-a', 'service-b' ou 'service-c'
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;