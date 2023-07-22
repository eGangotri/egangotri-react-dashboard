import React, { PropsWithChildren, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Layout from 'pages/Layout2';

const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
  return <Layout>{children?children:<Outlet />}</Layout>;
};

export default ProtectedRoute;
