import { Home } from '../pages/client/Home';
import { ClientLayout } from '../layouts';

export const routesClient = [
  { path: '/', element: <Home />, layout: ClientLayout },
  { path: '/home', element: <Home />, layout: ClientLayout },
];
