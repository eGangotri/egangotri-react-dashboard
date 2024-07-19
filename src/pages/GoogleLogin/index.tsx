import React, { PropsWithChildren } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useRecoilState } from 'recoil';
import { loggedInState, loggedUser, loggedUserRole, loginToken } from 'pages/Dashboard';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Layout from 'pages/Layout';

const Login: React.FC<PropsWithChildren> = ({ children }) => {
    const [_isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState);
    const [_loggedUser, setLoggedUser] = useRecoilState(loggedUser);
    const [_loggedUserRole, setLoggedUserRole] = useRecoilState(loggedUserRole);
    const [_loginToken, setLoginToken] = useRecoilState(loginToken);

    const navigate = useNavigate();
    const location = useLocation();

    const handleLoginSuccess = (response: any) => {
        console.log(`Login Success:${JSON.stringify(response, null, 2)} , ${JSON.stringify(response.profileObj)}`);
        setIsLoggedIn(true);
        // setLoggedUser(response.profileObj?.name);
        // setLoggedUserRole(response.profileObj?.role);
        setLoginToken(response.credential);
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });

        // Handle login success (e.g., save token, redirect, etc.)
    };

    const handleLoginFailure = (error: any) => {
        console.error('Login Failed:', error);
        setIsLoggedIn(false);
        setLoginToken("");
    };

    return (
        <>
            {_isLoggedIn ? (
                <Layout>{children ? children : <Outlet />}</Layout>
            ) : (
                <div>
                    <h2>Login</h2>
                    <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={() => {
                            console.error('Login Failed:');
                            handleLoginFailure('');
                        }}
                        useOneTap
                    />
                </div>
            )}
        </>
    );
};

export default Login;