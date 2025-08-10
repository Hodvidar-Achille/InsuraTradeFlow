import { createContext, useEffect, useState } from 'react';
import keycloak from './keycloak';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeKeycloak = async () => {
            try {
                const auth = await keycloak.init({
                    onLoad: 'login-required',
                    pkceMethod: 'S256'
                });

                if (auth) {
                    setAuthenticated(true);
                    const profile = await keycloak.loadUserProfile();
                    setUser({
                        username: profile.username,
                        email: profile.email,
                        roles: keycloak.tokenParsed?.realm_access?.roles || []
                    });
                }
            } catch (error) {
                console.error('Keycloak initialization error:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeKeycloak();
    }, []);

    const login = () => keycloak.login();
    const logout = () => keycloak.logout();
    const getToken = () => keycloak.token;

    return (
        <AuthContext.Provider value={{ authenticated, user, loading, login, logout, getToken }}>
            {children}
        </AuthContext.Provider>
    );
};