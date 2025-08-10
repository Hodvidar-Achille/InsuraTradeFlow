import { useState } from 'react';
import './SearchFilter.css';

const SearchFilter = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        containsText: '',
        notContainsText: '',
        startDateAfter: '',
        startDateBefore: '',
        endDateAfter: '',
        endDateBefore: '',
        createdAfter: '',
        createdBefore: '',
        updatedAfter: '',
        updatedBefore: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const applyFilters = () => {
        onFilterChange(filters);
    };

    const resetFilters = () => {
        const resetFilters = {
            containsText: '',
            notContainsText: '',
            startDateAfter: '',
            startDateBefore: '',
            endDateAfter: '',
            endDateBefore: '',
            createdAfter: '',
            createdBefore: '',
            updatedAfter: '',
            updatedBefore: ''
        };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    return (
        <div className="search-filter">
            <div className="filter-row">
                <div className="text-filter">
                    <label>Should contain:</label>
                    <input
                        type="text"
                        name="containsText"
                        value={filters.containsText}
                        onChange={handleInputChange}
                        placeholder="Text to include"
                    />
                </div>

                <div className="date-filter-group">
                    <div className="date-filter">
                        <label>Start Date Before:</label>
                        <input
                            type="date"
                            name="startDateBefore"
                            value={filters.startDateBefore}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="date-filter">
                        <label>End Date Before:</label>
                        <input
                            type="date"
                            name="endDateBefore"
                            value={filters.endDateBefore}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="date-filter">
                        <label>Created Before:</label>
                        <input
                            type="date"
                            name="createdBefore"
                            value={filters.createdBefore}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="date-filter">
                        <label>Updated Before:</label>
                        <input
                            type="date"
                            name="updatedBefore"
                            value={filters.updatedBefore}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>

            <div className="filter-row">
                <div className="text-filter">
                    <label>Should NOT contain:</label>
                    <input
                        type="text"
                        name="notContainsText"
                        value={filters.notContainsText}
                        onChange={handleInputChange}
                        placeholder="Text to exclude"
                    />
                </div>

                <div className="date-filter-group">
                    <div className="date-filter">
                        <label>Start Date After:</label>
                        <input
                            type="date"
                            name="startDateAfter"
                            value={filters.startDateAfter}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="date-filter">
                        <label>End Date After:</label>
                        <input
                            type="date"
                            name="endDateAfter"
                            value={filters.endDateAfter}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="date-filter">
                        <label>Created After:</label>
                        <input
                            type="date"
                            name="createdAfter"
                            value={filters.createdAfter}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="date-filter">
                        <label>Updated After:</label>
                        <input
                            type="date"
                            name="updatedAfter"
                            value={filters.updatedAfter}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>

            <div className="filter-actions">
                <button onClick={applyFilters}>Apply Filters</button>
                <button onClick={resetFilters}>Reset Filters</button>
            </div>
        </div>
    );
};

export default SearchFilter;