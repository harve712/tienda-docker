import { Login } from '../pages/common/Login';
import { Register } from '../pages/common/Register';
import { Error404 } from '../pages/common/Error404';
import { CommonLayout } from '../layouts';

export const routesCommon = [
  { path: '/login', element: <Login />, layout: CommonLayout },
  { path: '/register', element: <Register />, layout: CommonLayout },
  { path: '*', element: <Error404 />, layout: CommonLayout },
];
