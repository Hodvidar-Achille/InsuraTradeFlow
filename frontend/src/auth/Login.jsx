import { useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { authenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (authenticated) {
            navigate('/');
        }
    }, [authenticated, navigate]);

    return (
        <div className="login-container">
            <h2>Redirecting to login...</h2>
        </div>
    );
};

export default Login;