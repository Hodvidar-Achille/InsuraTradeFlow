import {useState} from 'react';
import PolicyRow from './PolicyRow';
import {formatDate, formatDateTime} from '../../utils/dateUtils';
import './PolicyTable.css';
import {deletePolicy} from '../../services/api';

const PolicyTable = ({
                         policies,
                         loading,
                         currentPage,
                         totalPages,
                         totalElements,
                         pageSize,
                         onPageChange,
                         onSortChange,
                         onRefresh,
                         onUpdatePolicies,
                         apiUrl
                     }) => {
    const [editablePolicies, setEditablePolicies] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');

    const handleSort = (field) => {
        const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(newDirection);
        onSortChange(`${field},${newDirection}`);
    };

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
        onUpdatePolicies(editablePolicies);
        setEditablePolicies({});
        setIsEditMode(false);
    };

    const cancelChanges = () => {
        setEditablePolicies({});
        setIsEditMode(false);
    };

    const handleDelete = async (policyId) => {
        try {
            await deletePolicy(apiUrl, policyId);
            onRefresh();
        } catch (error) {
            console.error('Error deleting policy:', error);
        }
    };

    return (
        <div className="policy-list">
            <h2>Existing Policies</h2>
            {loading ? (
                <p>Loading policies...</p>
            ) : policies.length === 0 ? (
                <p>No policies found</p>
            ) : (
                <>
                    <table className="policies-table">
                        <thead>
                        <tr>
                            <th onClick={() => handleSort('id')}>
                                ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('name')}>
                                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('status')}>
                                Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('startDate')}>
                                Start Date {sortField === 'startDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('endDate')}>
                                End Date {sortField === 'endDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th>Created</th>
                            <th>Updated</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {policies.map(policy => (
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
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                        >
                            Previous
                        </button>

                        {Array.from({length: totalPages}).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => onPageChange(index)}
                                className={currentPage === index ? 'active' : ''}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                        >
                            Next
                        </button>
                    </div>

                    <div className="pagination-info">
                        Showing {policies.length} of {totalElements} policies (Page {currentPage + 1} of {totalPages})
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