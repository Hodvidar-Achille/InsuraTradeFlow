import { useState, useEffect } from 'react';
import './App.css';
import ConnectionStatus from './components/ConnectionStatus/ConnectionStatus';
import PolicyForm from './components/PolicyForm/PolicyForm';
import PolicyTable from './components/PolicyTable/PolicyTable';
import { fetchGreeting, fetchPolicies, createPolicy, updatePolicy } from './services/api';

function App() {
    const [message, setMessage] = useState('Loading...');
    const [allPolicies, setAllPolicies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const policiesPerPage = 5;

    const apiUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:8080'
        : 'http://app:8080';

    useEffect(() => {
        fetchGreeting(apiUrl, setMessage);
        loadPolicies();
    }, [apiUrl]);

    const loadPolicies = () => {
        setLoading(true);
        fetchPolicies(apiUrl)
            .then(data => {
                setAllPolicies(data);
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
                setAllPolicies([createdPolicy, ...allPolicies]);
                setCurrentPage(1);
                setMessage('Policy created successfully!');
            })
            .catch(error => {
                setMessage(`Error creating policy: ${error.message}`);
            });
    };

    const handleUpdatePolicies = (updatedPolicies, allPolicies) => {
        updatePolicy(apiUrl, updatedPolicies, allPolicies)
            .then(() => {
                loadPolicies();
                setMessage('All changes saved successfully!');
            })
            .catch(error => {
                setMessage(`Error saving changes: ${error.message}`);
            });
    };

    return (
        <div className="App">
            <header className="App-header">
                <ConnectionStatus message={message} apiUrl={apiUrl} />

                <PolicyForm onCreatePolicy={handleCreatePolicy} />

                <PolicyTable
                    allPolicies={allPolicies}
                    loading={loading}
                    currentPage={currentPage}
                    policiesPerPage={policiesPerPage}
                    onPageChange={setCurrentPage}
                    onRefresh={loadPolicies}
                    onUpdatePolicies={handleUpdatePolicies}
                    apiUrl={apiUrl}
                />
            </header>
        </div>
    );
}

export default App;