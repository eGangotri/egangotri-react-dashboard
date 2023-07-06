/* ***************************************************************************
 * Copyright © Biqmind Pte Ltd – 2021 - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * ************************************************************************ */
import React, { PropsWithChildren, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Layout from 'pages/Layout2';

const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
  return <Layout>{children?children:<Outlet />}</Layout>;
};

export default ProtectedRoute;
