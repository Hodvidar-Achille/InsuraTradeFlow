import {useEffect, useState} from 'react';
import PolicyRow from './PolicyRow';
import {formatDate, formatDateTime} from '../../utils/dateUtils';
import './PolicyTable.css';
import {deletePolicy} from '../../services/api';
import SearchFilter from '../SearchFilter/SearchFilter';

const PolicyTable = ({
                         allPolicies,
                         loading,
                         currentPage,
                         policiesPerPage,
                         onPageChange,
                         onRefresh,
                         onUpdatePolicies,
                         apiUrl
                     }) => {
    const [editablePolicies, setEditablePolicies] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [filteredPolicies, setFilteredPolicies] = useState(allPolicies);

    const indexOfLastPolicy = currentPage * policiesPerPage;
    const indexOfFirstPolicy = indexOfLastPolicy - policiesPerPage;
    const displayedPolicies = filteredPolicies.slice(indexOfFirstPolicy, indexOfLastPolicy);

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

    const handleDelete = async (policyId) => {
        try {
            await deletePolicy(apiUrl, policyId);
            onRefresh(); // Refresh the table after deletion
        } catch (error) {
            console.error('Error deleting policy:', error);
        }
    };

    useEffect(() => {
        setFilteredPolicies(allPolicies);
    }, [allPolicies]);

    const applyFilters = (filters) => {
        const filtered = allPolicies.filter(policy => {
            // Text filtering
            const name = policy.name.toLowerCase();
            const containsText = filters.containsText.toLowerCase();
            const notContainsText = filters.notContainsText.toLowerCase();

            // Date filtering helpers
            const isAfter = (date, filterDate) =>
                !filterDate || new Date(date) >= new Date(filterDate);
            const isBefore = (date, filterDate) =>
                !filterDate || new Date(date) <= new Date(filterDate);

            // Apply all filters
            return (
                (containsText === '' || name.includes(containsText)) &&
                (notContainsText === '' || !name.includes(notContainsText)) &&
                isAfter(policy.startDate, filters.startDateAfter) &&
                isBefore(policy.startDate, filters.startDateBefore) &&
                isAfter(policy.endDate, filters.endDateAfter) &&
                isBefore(policy.endDate, filters.endDateBefore) &&
                isAfter(policy.creationDateTime, filters.createdAfter) &&
                isBefore(policy.creationDateTime, filters.createdBefore) &&
                isAfter(policy.updateDateTime, filters.updatedAfter) &&
                isBefore(policy.updateDateTime, filters.updatedBefore)
            );
        });

        setFilteredPolicies(filtered);
        paginate(1); // Reset to first page when filters change
    };

    return (
        <div className="policy-list">
            <SearchFilter onFilterChange={applyFilters}/>

            <h2>Existing Policies</h2>
            {loading ? (
                <p>Loading policies...</p>
            ) : filteredPolicies.length === 0 ? (
                <p>No policies match your filters</p>
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
                                onDelete={handleDelete}
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
                        Showing {displayedPolicies.length} of {filteredPolicies.length} policies
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