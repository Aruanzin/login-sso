# 🔐 Projeto SSO com Identidade Federada (OIDC + Keycloak)

Este projeto demonstra a implementação de **Identidade Federada e Autenticação** em um ambiente de **Sistemas Distribuídos**, utilizando o protocolo **OpenID Connect (OIDC)** e o servidor de identidade **Keycloak**.

O objetivo é ilustrar **Single Sign-On (SSO)**, **confiança distribuída entre serviços** e **autorização baseada em papéis (RBAC)** em múltiplas aplicações independentes.

---

## 🎯 Objetivos do Projeto

- Demonstrar **login único (SSO)** entre múltiplos serviços
- Centralizar autenticação via **provedor de identidade (IdP)**
- Delegar autorização aos serviços consumidores
- Utilizar **tokens JWT** para transporte de identidade e permissões
- Evidenciar o conceito de **coreografia de protocolos**, sem orquestrador central

---

## 🧩 Arquitetura Geral

A arquitetura é composta por um **provedor de identidade** e **três serviços independentes**, que confiam no mesmo IdP.

![Arquitetura Geral](./public/architecture.png)

- **Keycloak** atua como Identity Provider (IdP)
- Cada serviço é um cliente OIDC independente
- O usuário autentica apenas uma vez
- Os serviços validam o token recebido

---

## 🔄 Fluxo de Autenticação (SSO)

![Fluxo SSO](./public/oidc-auth.png)

1. Usuário acessa um serviço
2. Serviço redireciona para o Keycloak
3. Keycloak autentica o usuário
4. Um **JWT** é emitido
5. O token é reutilizado nos demais serviços
6. Não há novo login (SSO)

---

## 🏗️ Serviços Implementados

### 🅰️ Service A — Dashboard Financeiro
- Acesso: qualquer usuário autenticado
- Função: exibição de dados financeiros simulados
- Demonstra autenticação via OIDC

---

### 🅱️ Service B — Conta do Usuário
- Acesso: qualquer usuário autenticado
- Função: exibição de informações do usuário
- Demonstra leitura de **claims do JWT**

---

### 🅲 Service C — Painel Administrativo
- Acesso restrito a usuários com role `admin`
- Função: painel administrativo
- Demonstra **autorização baseada em papéis (RBAC)**

---

## 🔑 Autenticação e Autorização

### Autenticação
- Centralizada no **Keycloak**
- Implementada via **OpenID Connect**
- Uso de `login-required` e PKCE

### Autorização
- Descentralizada
- Cada serviço valida as **roles** contidas no token JWT
- Exemplo:
```js
keycloak.tokenParsed.realm_access.roles.includes('admin')
```

### Como executar o Projeto?

- Subir o keycloak
```bash
docker-compose up -d keycloak
```

- Acessar: http://localhost:8080

- Executar em terminais diferentes
```
cd service-a
npm install
npm run dev
```

```
cd service-b
npm install
npm run dev
```

```
cd service-c
npm install
npm run dev
```