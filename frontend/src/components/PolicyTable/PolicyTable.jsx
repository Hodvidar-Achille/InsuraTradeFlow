import { useState } from 'react';
import PolicyRow from './PolicyRow';
import { formatDate, formatDateTime } from '../../utils/dateUtils';
import './PolicyTable.css';

const PolicyTable = ({
                         allPolicies,
                         loading,
                         currentPage,
                         policiesPerPage,
                         onPageChange,
                         onRefresh,
                         onUpdatePolicies
                     }) => {
    const [editablePolicies, setEditablePolicies] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);

    const indexOfLastPolicy = currentPage * policiesPerPage;
    const indexOfFirstPolicy = indexOfLastPolicy - policiesPerPage;
    const displayedPolicies = allPolicies.slice(indexOfFirstPolicy, indexOfLastPolicy);

    const toggleEditMode = () => {
        if (isEditMode) {
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

    const saveChanges = () => {
        onUpdatePolicies(editablePolicies, allPolicies);
        setEditablePolicies({});
        setIsEditMode(false);
    };

    const cancelChanges = () => {
        setEditablePolicies({});
        setIsEditMode(false);
    };

    const paginate = (pageNumber) => onPageChange(pageNumber);

    return (
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
                            <PolicyRow
                                key={policy.id}
                                policy={policy}
                                isEditMode={isEditMode}
                                editableValues={editablePolicies[policy.id]}
                                onFieldChange={handleFieldChange}
                                formatDate={formatDate}
                                formatDateTime={formatDateTime}
                            />
                        ))}
                        </tbody>
                    </table>

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

                    <div className="table-actions">
                        <button onClick={toggleEditMode}>
                            {isEditMode ? '🔒 Lock Editing' : '🔓 Enable Editing'}
                        </button>

                        {isEditMode && (
                            <>
                                <button onClick={saveChanges}>💾 Save All</button>
                                <button onClick={cancelChanges}>❌ Cancel</button>
                            </>
                        )}

                        <button onClick={onRefresh}>🔄 Refresh</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default PolicyTable;