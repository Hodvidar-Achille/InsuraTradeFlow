const API_BASE = process.env.REACT_APP_API_URL;

export const getGreeting = async () => {
    const response = await fetch(`${API_BASE}/api/greeting`);
    return await response.json();
};

// Add other API calls here as you need them