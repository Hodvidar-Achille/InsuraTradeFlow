import { useState } from 'react';
import './PolicyForm.css';

const PolicyForm = ({ onCreatePolicy }) => {
    const [newPolicy, setNewPolicy] = useState({
        name: '',
        status: 'ACTIVE',
        startDate: '',
        endDate: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPolicy(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreatePolicy(newPolicy);
        setNewPolicy({
            name: '',
            status: 'ACTIVE',
            startDate: '',
            endDate: ''
        });
    };

    return (
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
    );
};

export default PolicyForm;