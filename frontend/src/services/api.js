// Auth headers
const getAuthHeaders = () => ({
    'Authorization': 'Basic ' + btoa('user:password'),
    'Content-Type': 'application/json'
});

// Base API configuration
const BASE_CONFIG = {
    headers: getAuthHeaders()
};

// Helper function to handle API responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

// Generic fetch wrapper
const apiFetch = async (url, method = 'GET', body = null) => {
    const config = {
        ...BASE_CONFIG,
        method,
        body: body ? JSON.stringify(body) : null
    };
    return fetch(url, config).then(handleResponse);
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

export const createPolicy = async (apiUrl, policyData) => {
    return apiFetch(`${apiUrl}/api/v1/insurance-policies`, 'POST', policyData);
};

export const fetchPolicies = async (apiUrl, page = 0, size = 10, sort = 'name,asc') => {
    const params = new URLSearchParams({page, size, sort});
    return apiFetch(`${apiUrl}/api/v1/insurance-policies?${params}`);
};

export const updatePolicy = async (apiUrl, updatedPolicies, allPolicies) => {
    const results = [];

    for (const [policyId, changes] of Object.entries(updatedPolicies)) {
        if (Object.keys(changes).length > 0) {
            const originalPolicy = allPolicies.find(p => p.id.toString() === policyId);
            if (!originalPolicy) throw new Error(`Policy ${policyId} not found`);

            const updatedPolicyDto = {
                id: originalPolicy.id,
                name: changes.name ?? originalPolicy.name,
                status: changes.status ?? originalPolicy.status,
                startDate: changes.startDate ?? originalPolicy.startDate,
                endDate: changes.endDate ?? originalPolicy.endDate,
            };

            const result = await apiFetch(
                `${apiUrl}/api/v1/insurance-policies/${policyId}`,
                'PUT',
                updatedPolicyDto
            );
            results.push(result);
        }
    }

    return results;
};

export const deletePolicy = async (apiUrl, policyId) => {
    return apiFetch(
        `${apiUrl}/api/v1/insurance-policies/${policyId}`,
        'DELETE'
    );
};

export const fetchDeletedPolicies = async (apiUrl) => {
    return apiFetch(`${apiUrl}/api/v1/deleted-insurance-policies`);
};