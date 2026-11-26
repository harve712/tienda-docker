# Tienda Online — Django REST + React + MySQL + Docker

Proyecto escolar que implementa una tienda en línea con:
- **Backend**: Django 5.2, Django REST Framework, JWT (SimpleJWT), Swagger (drf-yasg), SOAP (zeep), django-cors-headers
- **Frontend**: React 18 + Vite
- **Base de datos**: MySQL 8.0
- **Contenedores**: Docker Compose (un solo comando para levantar todo)

---

## Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución.  
  No se necesita Python, Node.js ni MySQL instalado localmente.

---

## Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd proyecto_docker
```

### 2. Crear el archivo `.env`

Copia el archivo de ejemplo y edita **todos** los valores marcados:

```bash
cp .env.example .env
```

Abre `.env` y reemplaza las claves de ejemplo por valores reales:

```env
MYSQL_ROOT_PASSWORD=una_clave_root_segura
MYSQL_DATABASE=tienda_db
MYSQL_USER=tienda_user
MYSQL_PASSWORD=una_clave_segura
DB_HOST=db
DB_PORT=3306
DJANGO_SECRET_KEY=una_clave_secreta_larga_y_aleatoria
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=*
VITE_BASE_API_URL=http://localhost:8000
VITE_LOCAL_STORAGE_ITEM_NAME=TOKEN
```

> [!CAUTION]
> **Nunca** subas el archivo `.env` a Git. Ya está incluido en `.gitignore`.

### 3. Levantar los contenedores

```bash
docker compose up --build -d
```

Este comando:
1. Construye las imágenes de backend y frontend.
2. Levanta MySQL y espera a que esté saludable.
3. Ejecuta `migrate` automáticamente.
4. Inicia el backend en el puerto 8000 y el frontend en el 5173.

---

## URLs disponibles

| Servicio   | URL                              |
|------------|----------------------------------|
| Frontend   | http://localhost:5173            |
| API Swagger| http://localhost:8000/swagger/   |
| API Redoc  | http://localhost:8000/redoc/     |
| Django Admin | http://localhost:8000/admin/   |

---

## Apagar los contenedores

```bash
docker compose down
```

> [!WARNING]
> **NO uses `docker compose down -v`** — ese flag elimina el volumen `mysql_data` y borra toda la base de datos permanentemente.

Para detener sin eliminar contenedores:

```bash
docker compose stop
```

---

## Probar la persistencia de datos

1. Crea un usuario o producto desde la interfaz o la API.
2. Apaga los contenedores: `docker compose down`
3. Vuelve a levantarlos: `docker compose up -d`
4. Los datos siguen ahí — el volumen `mysql_data` los conserva.

---

## Estructura del repositorio

```
proyecto_docker/
├── backend/                   # Proyecto Django
│   ├── tienda_online/         # Configuración principal (settings, urls, wsgi)
│   ├── users/                 # App de usuarios (modelo personalizado por email, JWT)
│   │   └── migrations/
│   ├── products/              # App de productos (SOAP con zeep)
│   │   └── migrations/
│   ├── templates/
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/                  # Proyecto React + Vite
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile
│   └── .dockerignore
├── docker-compose.yml
├── .env.example               # Plantilla de variables de entorno
├── .gitignore
└── README.md
```

---

## Comandos útiles

```bash
# Ver logs en tiempo real
docker compose logs -f

# Ver logs solo del backend
docker compose logs -f backend

# Acceder al shell del backend
docker compose exec backend bash

# Crear superusuario de Django
docker compose exec backend python manage.py createsuperuser

# Reconstruir una sola imagen (ej. tras cambiar requirements.txt)
docker compose up --build backend -d
```
