import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: 'http://localhost:8181',
    realm: 'InsuraTradeFlow',
    clientId: 'insuratrade-frontend'
};

// Initialize Keycloak
const keycloak = new Keycloak(keycloakConfig);

// Export as default
export default keycloak;