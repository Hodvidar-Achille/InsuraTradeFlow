import {formatDateForInput, validateDate} from '../../utils/dateUtils';
import DeleteModal from '../DeleteModal/DeleteModal';
import {useState} from 'react';

const PolicyRow = ({
                       policy,
                       isEditMode,
                       editableValues,
                       onFieldChange,
                       formatDate,
                       formatDateTime,
                       onDelete
                   }) => {

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    return (
        <>
            <tr>
                <td>{policy.id}</td>
                <td>
                    {isEditMode ? (
                        <input
                            type="text"
                            value={editableValues?.name || policy.name}
                            onChange={(e) => onFieldChange(policy.id, 'name', e.target.value)}
                        />
                    ) : (
                        policy.name
                    )}
                </td>
                <td>
                    {isEditMode ? (
                        <select
                            value={editableValues?.status || policy.status}
                            onChange={(e) => onFieldChange(policy.id, 'status', e.target.value)}
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
                                value={formatDateForInput(editableValues?.startDate || policy.startDate)}
                                onChange={(e) => onFieldChange(policy.id, 'startDate', e.target.value)}
                                className={!validateDate(editableValues?.startDate) && editableValues?.startDate ? 'invalid-date' : ''}
                            />
                            {!validateDate(editableValues?.startDate) && editableValues?.startDate && (
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
                                value={formatDateForInput(editableValues?.endDate || policy.endDate)}
                                onChange={(e) => onFieldChange(policy.id, 'endDate', e.target.value)}
                                className={!validateDate(editableValues?.endDate) && editableValues?.endDate ? 'invalid-date' : ''}
                                min={formatDateForInput(editableValues?.startDate || policy.startDate)}
                            />
                            {!validateDate(editableValues?.endDate) && editableValues?.endDate && (
                                <span className="date-error">Invalid date</span>
                            )}
                        </div>
                    ) : (
                        formatDate(policy.endDate)
                    )}
                </td>
                <td>{formatDateTime(policy.creationDateTime)}</td>
                <td>{formatDateTime(policy.updateDateTime)}</td>
                <td>
                    <button
                        className="delete-btn"
                        onClick={() => setShowDeleteModal(true)}
                    >
                        🗑️ Delete
                    </button>
                </td>
            </tr>
            {showDeleteModal && (
                <DeleteModal
                    policy={policy}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={() => onDelete(policy.id)}
                />
            )}
        </>
    );
};

export default PolicyRow;