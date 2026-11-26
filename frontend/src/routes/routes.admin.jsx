import { Dashboard } from '../pages/admin/Dashboard';
import { AdminLayout } from '../layouts';

export const routesAdmin = [
  { path: '/dashboard', element: <Dashboard />, layout: AdminLayout },
];
