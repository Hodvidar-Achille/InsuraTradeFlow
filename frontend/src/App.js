import {useState, useEffect} from 'react';
import './App.css';
import ConnectionStatus from './components/ConnectionStatus/ConnectionStatus';
import PolicyForm from './components/PolicyForm/PolicyForm';
import PolicyTable from './components/PolicyTable/PolicyTable';
import {fetchGreeting, fetchPolicies, createPolicy, updatePolicy} from './services/api';
import DeletedPolicies from './components/DeletedPolicies/DeletedPolicies';

function App() {
    const [message, setMessage] = useState('Loading...');
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0); // Changed to 0-based index
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(10); // Configurable page size
    const [sort, setSort] = useState('name,asc'); // Default sorting

    const apiUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:8080'
        : 'http://app:8080';

    useEffect(() => {
        fetchGreeting(apiUrl, setMessage);
        loadPolicies(currentPage, pageSize, sort);
    }, [apiUrl]);

    const loadPolicies = (page, size, sort) => {
        setLoading(true);
        fetchPolicies(apiUrl, page, size, sort)
            .then(data => {
                setPolicies(data.content);
                setTotalPages(data.totalPages);
                setTotalElements(data.totalElements);
                setLoading(false);
            })
            .catch(error => {
                setMessage(`Error fetching policies: ${error.message}`);
                setLoading(false);
            });
    };

    const handleCreatePolicy = (policyData) => {
        createPolicy(apiUrl, policyData)
            .then(createdPolicy => {
                // Refresh first page after creation
                loadPolicies(0, pageSize, sort);
                setMessage('Policy created successfully!');
            })
            .catch(error => {
                setMessage(`Error creating policy: ${error.message}`);
            });
    };

    const handleUpdatePolicies = (updatedPolicies) => {
        updatePolicy(apiUrl, updatedPolicies, policies)
            .then(() => {
                // Refresh current page after update
                loadPolicies(currentPage, pageSize, sort);
                setMessage('All changes saved successfully!');
            })
            .catch(error => {
                setMessage(`Error saving changes: ${error.message}`);
            });
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        loadPolicies(newPage, pageSize, sort);
    };

    const handleSortChange = (newSort) => {
        setSort(newSort);
        loadPolicies(0, pageSize, newSort); // Reset to first page when sorting changes
    };

    return (
        <div className="App">
            <header className="App-header">
                <ConnectionStatus message={message} apiUrl={apiUrl}/>

                <PolicyForm onCreatePolicy={handleCreatePolicy}/>

                <PolicyTable
                    policies={policies}
                    loading={loading}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    onSortChange={handleSortChange}
                    onRefresh={() => loadPolicies(currentPage, pageSize, sort)}
                    onUpdatePolicies={handleUpdatePolicies}
                    apiUrl={apiUrl}
                />

                <DeletedPolicies apiUrl={apiUrl} />
            </header>
        </div>
    );
}

export default App;