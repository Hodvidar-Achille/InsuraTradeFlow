import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const LoginPage = () => {
    const { login } = useContext(AuthContext);

    return (
        <div>
            <h1>Login Page</h1>
            <button onClick={login}>Login with Keycloak</button>
        </div>
    );
};

export default LoginPage;