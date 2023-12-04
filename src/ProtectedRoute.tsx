import React, { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';
import Layout from 'pages/Layout';

const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
  return <Layout>{children?children:<Outlet />}</Layout>;
};

export default ProtectedRoute;
