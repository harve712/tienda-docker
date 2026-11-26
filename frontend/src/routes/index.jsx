import { Route, Routes } from 'react-router-dom';
import { Navigation } from './Navigation';
import { routes } from './routes';

export function IndexRoutes() {
  return (
    <>
      <Navigation />
      <Routes>
        {routes.map(({ path, element, layout: Layout }) => (
          <Route
            key={path}
            path={path}
            element={<Layout>{element}</Layout>}
          />
        ))}
      </Routes>
    </>
  );
}
