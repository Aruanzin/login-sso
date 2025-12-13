const { Issuer } = require('openid-client');

const KEYCLOAK_URL = 'http://localhost:8080';
const REALM = 'sso-demo';

async function getClient(clientId, clientSecret, redirectUri) {
  const issuer = await Issuer.discover(
    `${KEYCLOAK_URL}/realms/${REALM}`
  );

  return new issuer.Client({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uris: [redirectUri],
    response_types: ['code'],
  });
}

module.exports = { getClient };
