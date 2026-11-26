import { Link } from 'react-router-dom';
import { Button, Container, Header } from 'semantic-ui-react';

export function Error404() {
  return (
    <Container text textAlign="center" className="page-container">
      <Header as="h1" icon>
        <i className="frown outline icon" />
        404
        <Header.Subheader>Página no encontrada</Header.Subheader>
      </Header>
      <Button as={Link} to="/" primary>
        Volver al inicio
      </Button>
    </Container>
  );
}
