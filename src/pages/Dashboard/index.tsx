import React from 'react';
import 'index.css';
import { ThemeProvider } from '@mui/material/styles';
import DashboardRoutes from 'Routes';
import AppError from 'components/Error/AppError';
import ErrorBoundary from 'components/ErrorBoundary';
import eGangotriTheme from 'themes/DWSTheme';
import { RecoilRoot } from 'recoil';

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
