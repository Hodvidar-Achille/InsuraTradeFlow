import keycloak from "../auth/keycloak";

// Helper function to ensure we have a valid token
const ensureToken = async () => {
    try {
        // Refresh token if it's expired or about to expire (within 30 seconds)
        const refreshed = await keycloak.updateToken(30);
        if (refreshed) {
            console.log('Token was refreshed');
        }
        return keycloak.token;
    } catch (error) {
        console.error('Failed to refresh token:', error);
        keycloak.login(); // Redirect to login if token refresh fails
        throw new Error('Authentication required');
    }
};

// Get auth headers with fresh token
const getAuthHeaders = async () => {
    const token = await ensureToken();
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

// Enhanced response handler
const handleResponse = async (response) => {
    if (!response.ok) {
        // Handle 401 Unauthorized specifically
        if (response.status === 401) {
            keycloak.login(); // Redirect to login
            throw new Error('Session expired. Please login again.');
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

// Generic fetch wrapper with token refresh
const apiFetch = async (url, method = 'GET', body = null) => {
    const headers = await getAuthHeaders();
    const config = {
        headers,
        method,
        body: body ? JSON.stringify(body) : null
    };

    try {
        return await fetch(url, config).then(handleResponse);
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};

// API methods
export const fetchGreeting = async (apiUrl, setMessage) => {
    try {
        const data = await apiFetch(`${apiUrl}/api/greeting`);
        setMessage(data.message);
    } catch (error) {
        setMessage(`Error: ${error.message}`);
    }
};

export const fetchPolicies = async (apiUrl, page = 0, size = 10, sort = 'name,asc') => {
    const params = new URLSearchParams({page, size, sort});
    return apiFetch(`${apiUrl}/api/v1/insurance-policies?${params}`);
};

export const createPolicy = async (apiUrl, policyData) => {
    return apiFetch(`${apiUrl}/api/v1/insurance-policies`, 'POST', policyData);
};

export const updatePolicy = async (apiUrl, policyId, policyData) => {
    return apiFetch(`${apiUrl}/api/v1/insurance-policies/${policyId}`, 'PUT', policyData);
};

export const deletePolicy = async (apiUrl, policyId) => {
    return apiFetch(`${apiUrl}/api/v1/insurance-policies/${policyId}`, 'DELETE');
};