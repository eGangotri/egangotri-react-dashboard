import { Link, Typography } from "@mui/material";
import { DecodedJWT } from "components/common/types";
import { jwtDecode } from "jwt-decode";
import { loggedInState, loggedUser, loggedUserRole, loginToken } from "pages/Dashboard";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsLoggedIn(false);
        setLoggedUser('');
        setLoggedUserRole('');
        setLoginToken('');
        navigate('/', { replace: true });
    };

    const [_loginToken, setLoginToken] = useRecoilState(loginToken);
    const [_isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState);
    const [_loggedUser, setLoggedUser] = useRecoilState(loggedUser);
    const [_loggedUserRole, setLoggedUserRole] = useRecoilState(loggedUserRole);

    const decoded: DecodedJWT | undefined = _loginToken ? jwtDecode(_loginToken) : undefined;

    const welcomeMessage = decoded?.hd ? `Welcome ${decoded?.hd}` : "Welcome localhost";

    return (
        <header className="Header flex justify-between items-center text-center mt-5">
            <Typography variant="h5" className="text-turquoise-900 flex-1 text-center">
            <Link href="/" sx={{ textDecoration: 'none' }}>{title}</Link>
            </Typography>
            <div className="flex items-center">
                <Typography variant="body1" className="text-turquoise-900 text-right pr-2">{welcomeMessage}</Typography>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
            </div>
        </header>

    )
}

export default Header