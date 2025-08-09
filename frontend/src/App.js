import {useState, useEffect} from 'react';
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

    const [editablePolicies, setEditablePolicies] = useState({}); // { policyId: {field: value} }
    const [isEditMode, setIsEditMode] = useState(false);

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
        const {name, value} = e.target;
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

    /* For making the table editable */
    const toggleEditMode = () => {
        if (isEditMode) {
            // Cancel all changes when exiting edit mode
            setEditablePolicies({});
        }
        setIsEditMode(!isEditMode);
    };

    const handleFieldChange = (policyId, field, value) => {
        setEditablePolicies(prev => ({
            ...prev,
            [policyId]: {
                ...prev[policyId],
                [field]: value
            }
        }));
    };

    const saveChanges = async () => {
        try {
            // First validate all changes
            for (const [policyId, changes] of Object.entries(editablePolicies)) {
                if (changes.startDate && !validateDate(changes.startDate)) {
                    throw new Error(`Invalid start date for policy ${policyId}`);
                }
                if (changes.endDate && !validateDate(changes.endDate)) {
                    throw new Error(`Invalid end date for policy ${policyId}`);
                }
                if (changes.startDate && changes.endDate &&
                    new Date(changes.startDate) > new Date(changes.endDate)) {
                    throw new Error(`End date must be after start date for policy ${policyId}`);
                }
            }

            // Prepare and send complete DTO for each modified policy
            for (const [policyId, changes] of Object.entries(editablePolicies)) {
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
                }
            }

            // Reset and refresh on success
            setEditablePolicies({});
            setIsEditMode(false);
            fetchPolicies();
            setMessage('All changes saved successfully!');
        } catch (error) {
            setMessage(`Error saving changes: ${error.message}`);
        }
    };

    const cancelChanges = () => {
        setEditablePolicies({});
        setIsEditMode(false);
    };

    const validateDate = (dateString) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
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
                                        <td>
                                            {isEditMode ? (
                                                <input
                                                    type="text"
                                                    value={editablePolicies[policy.id]?.name || policy.name}
                                                    onChange={(e) => handleFieldChange(policy.id, 'name', e.target.value)}
                                                />
                                            ) : (
                                                policy.name
                                            )}
                                        </td>
                                        <td>
                                            {isEditMode ? (
                                                <select
                                                    value={editablePolicies[policy.id]?.status || policy.status}
                                                    onChange={(e) => handleFieldChange(policy.id, 'status', e.target.value)}
                                                >
                                                    <option value="ACTIVE">ACTIVE</option>
                                                    <option value="INACTIVE">INACTIVE</option>
                                                </select>
                                            ) : (
                                                policy.status
                                            )}
                                        </td>
                                        <td>
                                            {isEditMode ? (
                                                <div className="date-input-container">
                                                    <input
                                                        type="date"
                                                        value={formatDateForInput(editablePolicies[policy.id]?.startDate || policy.startDate)}
                                                        onChange={(e) => handleFieldChange(policy.id, 'startDate', e.target.value)}
                                                        className={!validateDate(editablePolicies[policy.id]?.startDate) && editablePolicies[policy.id]?.startDate ? 'invalid-date' : ''}
                                                    />
                                                    {!validateDate(editablePolicies[policy.id]?.startDate) && editablePolicies[policy.id]?.startDate && (
                                                        <span className="date-error">Invalid date</span>
                                                    )}
                                                </div>
                                            ) : (
                                                formatDate(policy.startDate)
                                            )}
                                        </td>
                                        <td>
                                            {isEditMode ? (
                                                <div className="date-input-container">
                                                    <input
                                                        type="date"
                                                        value={formatDateForInput(editablePolicies[policy.id]?.endDate || policy.endDate)}
                                                        onChange={(e) => handleFieldChange(policy.id, 'endDate', e.target.value)}
                                                        className={!validateDate(editablePolicies[policy.id]?.endDate) && editablePolicies[policy.id]?.endDate ? 'invalid-date' : ''}
                                                        min={formatDateForInput(editablePolicies[policy.id]?.startDate || policy.startDate)}
                                                    />
                                                    {!validateDate(editablePolicies[policy.id]?.endDate) && editablePolicies[policy.id]?.endDate && (
                                                        <span className="date-error">Invalid date</span>
                                                    )}
                                                </div>
                                            ) : (
                                                formatDate(policy.endDate)
                                            )}
                                        </td>
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

                                {Array.from({length: Math.ceil(allPolicies.length / policiesPerPage)}).map((_, index) => (
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

                            <div className="table-actions">
                                <button onClick={toggleEditMode}>
                                    {isEditMode ? (
                                        <i className="lock-icon">🔒</i> // Lock icon
                                    ) : (
                                        <i className="unlock-icon">🔓</i> // Unlock icon
                                    )}
                                    {isEditMode ? 'Lock Editing' : 'Enable Editing'}
                                </button>

                                {isEditMode && (
                                    <>
                                        <button onClick={saveChanges}>
                                            <i className="save-icon">💾</i> Save All
                                        </button>
                                        <button onClick={cancelChanges}>
                                            <i className="cancel-icon">❌</i> Cancel
                                        </button>
                                    </>
                                )}

                                <button onClick={fetchPolicies}>
                                    <i className="refresh-icon">🔄</i> Refresh
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </header>
        </div>
    );
}

export default App;