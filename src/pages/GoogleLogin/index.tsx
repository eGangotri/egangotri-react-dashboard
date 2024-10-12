import React, { PropsWithChildren } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useRecoilState } from 'recoil';
import { loggedInState, loggedUser, loggedUserRole, loginToken } from 'pages/Dashboard';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import Layout from 'pages/Layout';
import { jwtDecode } from "jwt-decode";

interface DecodedJWT {
    iss?: string;
    sub?: string;
    aud?: string;
    exp?: number;
    nbf?: number;
    iat?: number;
    jti?: string;
    [key: string]: any; // This allows for additional custom claims
  }

const Login: React.FC<PropsWithChildren> = ({ children }) => {
    const [_isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState);
    const [_loggedUser, setLoggedUser] = useRecoilState(loggedUser);
    const [_loggedUserRole, setLoggedUserRole] = useRecoilState(loggedUserRole);
    const [_loginToken, setLoginToken] = useRecoilState(loginToken);

    const navigate = useNavigate();
    const location = useLocation();

    const handleLoginSuccess = (response: any) => {
        console.log(`Login Success:${JSON.stringify(response, null, 2)}`);
        setIsLoggedIn(true);
        const token = response.credential;
        // setLoggedUser(response.profileObj?.name);
        // setLoggedUserRole(response.profileObj?.role);
        setLoginToken(token);
        const from = location.state?.from?.pathname || '/';

        const decoded:DecodedJWT = jwtDecode(token);
        console.log('Login Success:', JSON.stringify(decoded, null, 2));
        console.log('Email:', decoded?.name);

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