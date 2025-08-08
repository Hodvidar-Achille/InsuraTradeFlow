import { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [message, setMessage] = useState('Loading...');
    const [policies, setPolicies] = useState([]);
    const [newPolicy, setNewPolicy] = useState({
        name: '',
        status: 'ACTIVE',
        startDate: '',
        endDate: ''
    });
    const apiUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:8080'
        : 'http://app:8080';

    useEffect(() => {
        // Initial greeting fetch
        fetch(`${apiUrl}/api/greeting`, {
            headers: {
                'Authorization': 'Basic ' + btoa('user:password'),
                'Content-Type': 'application/json'
            }
        })
            .then(async (response) => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return await response.json();
            })
            .then(data => setMessage(data.message))
            .catch(error => setMessage(`Error: ${error.message}`));
    }, [apiUrl]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPolicy({
            ...newPolicy,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/api/v1/insurance-policies`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + btoa('user:password'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPolicy)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const createdPolicy = await response.json();
            setPolicies([...policies, createdPolicy]);
            setMessage('Policy created successfully!');

            // Reset form
            setNewPolicy({
                name: '',
                status: 'ACTIVE',
                startDate: '',
                endDate: ''
            });
        } catch (error) {
            setMessage(`Error creating policy: ${error.message}`);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>{message}</h1>
                <p>Connected to: {apiUrl}</p>

                {/* Policy Creation Form */}
                <div className="policy-form">
                    <h2>Create New Insurance Policy</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>
                                Policy Name:
                                <input
                                    type="text"
                                    name="name"
                                    value={newPolicy.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label>
                                Status:
                                <select
                                    name="status"
                                    value={newPolicy.status}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </label>
                        </div>

                        <div className="form-group">
                            <label>
                                Start Date:
                                <input
                                    type="date"
                                    name="startDate"
                                    value={newPolicy.startDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label>
                                End Date:
                                <input
                                    type="date"
                                    name="endDate"
                                    value={newPolicy.endDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                        </div>

                        <button type="submit">Create Policy</button>
                    </form>
                </div>
            </header>
        </div>
    );
}

export default App;