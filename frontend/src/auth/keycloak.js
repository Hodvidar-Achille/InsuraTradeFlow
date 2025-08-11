import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: process.env.REACT_APP_KEYCLOAK_URL,
    realm: process.env.REACT_APP_KEYCLOAK_REALM,
    clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID
};

// Initialize Keycloak
const keycloak = new Keycloak(keycloakConfig);

// Export as default
export default keycloak;