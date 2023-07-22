import React from 'react';
import 'index.css';
import { ThemeProvider } from '@mui/material/styles';
import DWRRoutes from 'Routes';
import AppError from 'components/Error/AppError';
import ErrorBoundary from 'components/ErrorBoundary';
import caepeTheme from 'themes/DWSTheme';
import { RecoilRoot } from 'recoil';

const Dashboard:React.FC = () => {
  return (
    <RecoilRoot>
    <ThemeProvider theme={caepeTheme}>
    <ErrorBoundary fallbackComponent={AppError}>
      <DWRRoutes />
    </ErrorBoundary>
  </ThemeProvider>
  </RecoilRoot>
  );
}

export default Dashboard;
