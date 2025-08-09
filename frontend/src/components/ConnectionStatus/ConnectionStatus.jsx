import './ConnectionStatus.css';

const ConnectionStatus = ({ message, apiUrl }) => (
    <div className="connection-status">
        <h1>{message}</h1>
        <p>Connected to: {apiUrl}</p>
    </div>
);

export default ConnectionStatus;