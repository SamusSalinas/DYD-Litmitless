# 🐳 07 - Infraestructura y Docker

#docker #infraestructura #postgresql #pgadmin #devops

La infraestructura local de base de datos se orquesta a través de **Docker Compose** en la raíz del proyecto.

---

## 1. Servicios Orquestados

```mermaid
flowchart LR
    Host["Host Local (Windows)"] -->|"Puerto 5432"| DB["Contenedor: db (Postgres 15)"]
    Host -->|"Puerto 5050"| Admin["Contenedor: pgadmin (pgAdmin 4)"]
    Admin -->|"Red Docker interna (db:5432)"| DB
    DB --> Vol[("Volumen: postgres_data")]
```

El archivo `docker-compose.yml` levanta dos contenedores:

```yaml
services:
  db:
    image: postgres:15
    restart: unless-stopped
    ports:
      - "127.0.0.1:5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \"$${POSTGRES_USER}\" -d \"$${POSTGRES_DB}\""]
      interval: 5s
      timeout: 5s
      retries: 10

  pgadmin:
    image: dpage/pgadmin4
    restart: unless-stopped
    ports:
      - "127.0.0.1:5050:80"
    depends_on:
      db:
        condition: service_healthy
```

---

## 2. Variables de Configuración (`.env`)

El archivo `.env` en la raíz contiene las credenciales requeridas:

| Variable | Descripción | Valor Típico / Ejemplo |
| :--- | :--- | :--- |
| `POSTGRES_USER` | Usuario administrador de PostgreSQL | `dnd_user` |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL | `secretpassword` |
| `POSTGRES_DB` | Base de datos principal | `dnd_beyond_clone` |
| `POSTGRES_PORT` | Puerto de PostgreSQL expuesto en host | `5432` |
| `PGADMIN_DEFAULT_EMAIL` | Correo de acceso a pgAdmin web | `admin@admin.com` |
| `PGADMIN_DEFAULT_PASSWORD`| Contraseña de pgAdmin | `admin` |
| `PGADMIN_PORT` | Puerto web de pgAdmin | `5050` |
| `DATABASE_URL` | URL de conexión para la aplicación | `postgresql://dnd_user:secretpassword@localhost:5432/dnd_beyond_clone` |
| `TEST_DATABASE_URL` | URL para la base de datos de test | `postgresql://dnd_user:secretpassword@localhost:5432/dnd_beyond_clone_test` |

---

## 3. Conexión a pgAdmin desde el Navegador

1. Acceder a `http://localhost:5050`.
2. Iniciar sesión con `PGADMIN_DEFAULT_EMAIL` y `PGADMIN_DEFAULT_PASSWORD`.
3. Registrar un nuevo servidor:
   - **Nombre:** `Clon D&D`
   - **Host name / address:** `db` *(importante: usar el nombre de servicio de Docker, no localhost)*.
   - **Port:** `5432`
   - **Maintenance database:** `dnd_beyond_clone`
   - **Username:** `dnd_user`
   - **Password:** `secretpassword`

---

## 4. Comandos de Gestión Docker

```powershell
# Iniciar servicios en segundo plano
docker compose up -d

# Consultar estado de los contenedores
docker compose ps

# Ver registros en tiempo real
docker compose logs -f

# Detener los contenedores preservando los datos
docker compose down
```

---

## 5. Enlaces Relacionados

- [[01 - Arquitectura y Stack]]
- [[03 - Base de Datos y Modelos]]
- [[08 - Guía de Instalación y Puesta en Marcha]]
- Volver al [[00 - Índice General]]

