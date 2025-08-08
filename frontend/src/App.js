import { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [message, setMessage] = useState('Loading...');
    const apiUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:8080'
        : 'http://app:8080';

    useEffect(() => {
        fetch(`${apiUrl}/api/greeting`, {
            headers: {
                'Authorization': 'Basic ' + btoa('user:password'),
                'Content-Type': 'application/json'
            }
        })
            .then(async (response) => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return await response.json();
            })
            .then(data => setMessage(data.message))
            .catch(error => setMessage(`Error: ${error.message}`));
    }, [apiUrl]);

    return (
        <div className="App">
            <header className="App-header">
                <h1>{message}</h1>
                <p>Connected to: {apiUrl}</p>
            </header>
        </div>
    );
}

export default App;
