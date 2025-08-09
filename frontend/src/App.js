import { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [message, setMessage] = useState('Loading...');
    const [allPolicies, setAllPolicies] = useState([]); // Store all policies
    const [displayedPolicies, setDisplayedPolicies] = useState([]); // Policies to display on current page
    const [loading, setLoading] = useState(false);
    const [newPolicy, setNewPolicy] = useState({
        name: '',
        status: 'ACTIVE',
        startDate: '',
        endDate: ''
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [policiesPerPage] = useState(5); // Items per page

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

        // Fetch policies
        fetchPolicies();
    }, [apiUrl]);

    // Update displayed policies when allPolicies or currentPage changes
    useEffect(() => {
        const indexOfLastPolicy = currentPage * policiesPerPage;
        const indexOfFirstPolicy = indexOfLastPolicy - policiesPerPage;
        setDisplayedPolicies(allPolicies.slice(indexOfFirstPolicy, indexOfLastPolicy));
    }, [allPolicies, currentPage, policiesPerPage]);

    const fetchPolicies = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/api/v1/insurance-policies`, {
                headers: {
                    'Authorization': 'Basic ' + btoa('user:password'),
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setAllPolicies(data);
            setLoading(false);
        } catch (error) {
            setMessage(`Error fetching policies: ${error.message}`);
            setLoading(false);
        }
    };

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
            setAllPolicies([createdPolicy, ...allPolicies]); // Add new policy at beginning
            setCurrentPage(1); // Reset to first page
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

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '-';
        const date = new Date(dateTimeString);
        return date.toLocaleString();
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

                {/* Policy List Table (todo: clean up code) */}
                <div className="policy-list">
                    <h2>Existing Policies</h2>
                    {loading ? (
                        <p>Loading policies...</p>
                    ) : allPolicies.length === 0 ? (
                        <p>No policies found</p>
                    ) : (
                        <>
                            <table className="policies-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Created</th>
                                    <th>Updated</th>
                                </tr>
                                </thead>
                                <tbody>
                                {displayedPolicies.map(policy => (
                                    <tr key={policy.id}>
                                        <td>{policy.id}</td>
                                        <td>{policy.name}</td>
                                        <td>{policy.status}</td>
                                        <td>{formatDate(policy.startDate)}</td>
                                        <td>{formatDate(policy.endDate)}</td>
                                        <td>{formatDateTime(policy.creationDateTime)}</td>
                                        <td>{formatDateTime(policy.updateDateTime)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            {/* Pagination Controls */}
                            <div className="pagination">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>

                                {Array.from({ length: Math.ceil(allPolicies.length / policiesPerPage) }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => paginate(index + 1)}
                                        className={currentPage === index + 1 ? 'active' : ''}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === Math.ceil(allPolicies.length / policiesPerPage)}
                                >
                                    Next
                                </button>
                            </div>

                            <div className="pagination-info">
                                Showing {displayedPolicies.length} of {allPolicies.length} policies
                            </div>
                        </>
                    )}
                </div>
            </header>
        </div>
    );
}

export default App;