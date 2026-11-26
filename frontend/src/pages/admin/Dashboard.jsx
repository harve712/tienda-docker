import { useEffect, useState } from 'react';
import { Button, Card, Container, Header } from 'semantic-ui-react';
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useUser';

const LAT = 19.4326;
const LON = -99.1332;

function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,wind_speed_10m`;
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error('Error al consultar el clima');
        return response.json();
      })
      .then((data) => setWeather(data.current))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <Card.Content>
        <Card.Header>Clima actual</Card.Header>
        <Card.Description>
          {loading && 'Cargando...'}
          {error && 'No se pudo cargar el clima.'}
          {weather && (
            <>
              Temperatura: {weather.temperature_2m} °C
              <br />
              Viento: {weather.wind_speed_10m} km/h
            </>
          )}
        </Card.Description>
      </Card.Content>
    </Card>
  );
}

export function Dashboard() {
  const { logout } = useAuth();
  const user = useUser();

  const nombre =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
    user?.email;

  return (
    <Container className="page-container">
      <Header as="h1">Dashboard</Header>
      <p>Bienvenido {nombre}</p>
      <Button onClick={logout}>Cerrar sesión</Button>
      <WeatherWidget />
    </Container>
  );
}
