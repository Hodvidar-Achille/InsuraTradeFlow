import { useState } from 'react';
import './DeleteModal.css';

const DeleteModal = ({ policy, onClose, onConfirm }) => {
    const [confirmationText, setConfirmationText] = useState('');

    const handleDelete = () => {
        if (confirmationText === 'DELETE') {
            onConfirm();
            onClose();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Confirm Deletion</h3>
                <p>
                    Are you sure you want to delete policy <strong>#{policy.id}</strong> -{' '}
                    <strong>{policy.name}</strong>?
                </p>
                <p>
                    Type <strong>DELETE</strong> in uppercase to confirm:
                </p>
                <input
                    type="text"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder="Type DELETE here"
                />
                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="confirm-btn"
                        onClick={handleDelete}
                        disabled={confirmationText !== 'DELETE'}
                    >
                        Delete Policy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;