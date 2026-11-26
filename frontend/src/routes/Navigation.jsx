import { NavLink } from 'react-router-dom';
import { Container, Menu } from 'semantic-ui-react';
import { useAuth } from '../hooks/useAuth';

export function Navigation() {
  const { auth, logout } = useAuth();

  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item as={NavLink} to="/" end>
          Tienda Online
        </Menu.Item>
        <Menu.Menu position="right">
          {auth ? (
            <>
              <Menu.Item as={NavLink} to="/dashboard">Dashboard</Menu.Item>
              <Menu.Item onClick={logout}>Cerrar sesión</Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item as={NavLink} to="/login">Iniciar sesión</Menu.Item>
              <Menu.Item as={NavLink} to="/register">Registrarse</Menu.Item>
            </>
          )}
        </Menu.Menu>
      </Container>
    </Menu>
  );
}
