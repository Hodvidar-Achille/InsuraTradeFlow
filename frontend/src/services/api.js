export const fetchGreeting = async (apiUrl, setMessage) => {
    try {
        const response = await fetch(`${apiUrl}/api/greeting`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setMessage(data.message);
    } catch (error) {
        setMessage(`Error: ${error.message}`);
    }
};

export const fetchPolicies = async (apiUrl) => {
    const response = await fetch(`${apiUrl}/api/v1/insurance-policies`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
};

export const createPolicy = async (apiUrl, policyData) => {
    const response = await fetch(`${apiUrl}/api/v1/insurance-policies`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(policyData)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
};

export const updatePolicy = async (apiUrl, updatedPolicies, allPolicies) => {
    const results = [];
    // Prepare and send complete DTO for each modified policy
    for (const [policyId, changes] of Object.entries(updatedPolicies)) {
        if (Object.keys(changes).length > 0) {
            // Find the original policy
            const originalPolicy = allPolicies.find(p => p.id.toString() === policyId);

            if (!originalPolicy) {
                throw new Error(`Policy ${policyId} not found`);
            }

            // Create complete DTO with merged changes
            const updatedPolicyDto = {
                id: originalPolicy.id,
                name: changes.name !== undefined ? changes.name : originalPolicy.name,
                status: changes.status !== undefined ? changes.status : originalPolicy.status,
                startDate: changes.startDate !== undefined ? changes.startDate : originalPolicy.startDate,
                endDate: changes.endDate !== undefined ? changes.endDate : originalPolicy.endDate,
            };

            // Send complete DTO
            const response = await fetch(`${apiUrl}/api/v1/insurance-policies/${policyId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Basic ' + btoa('user:password'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedPolicyDto)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to update policy ${policyId}`);
            }

            results.push(await response.json());
        }
    }
    return results;
};

const getAuthHeaders = () => ({
    'Authorization': 'Basic ' + btoa('user:password'),
    'Content-Type': 'application/json'
});