import { Container } from 'semantic-ui-react';

export function ClientLayout({ children }) {
  return <Container className="page-container">{children}</Container>;
}
