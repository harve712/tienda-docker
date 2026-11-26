import { Container, Header } from 'semantic-ui-react';

export function Home() {
  return (
    <Container text className="page-container">
      <Header as="h1">Tienda Online</Header>
      <p>Bienvenido a la tienda.</p>
    </Container>
  );
}
