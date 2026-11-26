import { Container } from 'semantic-ui-react';

export function CommonLayout({ children }) {
  return <Container className="page-container">{children}</Container>;
}
