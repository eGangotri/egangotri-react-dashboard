import React from 'react';
import '../../index.css';
import { ThemeProvider } from '@mui/material/styles';
import DashboardRoutes from 'Routes';
import AppError from 'components/Error/AppError';
import ErrorBoundary from 'components/ErrorBoundary';
import eGangotriTheme from 'themes/DWSTheme';
import { atom, RecoilRoot } from 'recoil';
import { BASIC_ROLE } from 'mirror/CommonConstants';

export const loggedInState = atom({
  key: 'loggedInState',
  default: false,
});

export const loggedUser = atom({
  key: 'loggedUser',
  default: "",
});

export const loggedUserRole = atom({
  key: 'loggedUserRole',
  default: BASIC_ROLE,
});

export const loginToken = atom({
  key: 'loginToken',
  default: "",
});

const Dashboard:React.FC = () => {
  return (
    <RecoilRoot>
    <ThemeProvider theme={eGangotriTheme}>
    <ErrorBoundary fallbackComponent={AppError}>
      <DashboardRoutes />
    </ErrorBoundary>
  </ThemeProvider>
  </RecoilRoot>
  );
}

export default Dashboard;
