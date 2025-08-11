// src/components/DeletedPolicies/DeletedPolicies.js
import { useState, useEffect } from 'react';
import { fetchDeletedPolicies } from '../../services/api';
import './DeletedPolicies.css';

const DeletedPolicies = ({ apiUrl }) => {
    const [deletedPolicies, setDeletedPolicies] = useState([]);
    const [showDeleted, setShowDeleted] = useState(false);
    const [loading, setLoading] = useState(false);

    const loadDeletedPolicies = async () => {
        setLoading(true);
        try {
            const policies = await fetchDeletedPolicies(apiUrl);
            setDeletedPolicies(policies);
        } catch (error) {
            console.error('Error loading deleted policies:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    useEffect(() => {
        if (showDeleted) {
            loadDeletedPolicies();
        }
    }, [showDeleted]);

    return (
        <div className="deleted-policies-container">
            <button
                className="toggle-deleted-btn"
                onClick={() => setShowDeleted(!showDeleted)}
            >
                {showDeleted ? 'Hide Deleted Policies' : 'Show Deleted Policies'}
            </button>

            {showDeleted && (
                <div className="deleted-policies-table">
                    <button
                        className="refresh-btn"
                        onClick={loadDeletedPolicies}
                        disabled={loading}
                    >
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </button>

                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Creation time</th>
                            <th>Last update time</th>
                            <th>Deletion time</th>
                        </tr>
                        </thead>
                        <tbody>
                        {deletedPolicies.map(policy => (
                            <tr key={policy.id}>
                                <td>{policy.id}</td>
                                <td>{policy.name}</td>
                                <td>{policy.status}</td>
                                <td>{policy.startDate}</td>
                                <td>{policy.endDate}</td>
                                <td>{formatDateTime(policy.creationDateTime)}</td>
                                <td>{formatDateTime(policy.updateDateTime)}</td>
                                <td>{formatDateTime(policy.deletionDateTime)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DeletedPolicies;