# D&D Beyond Clone (5e 2014)

Monorepo local para un MVP de gestión de personajes y consulta de un compendio inicial. El MVP no incluye cuentas ni autenticación: los personajes se comparten en la instancia local.

## Stack

- **Backend:** FastAPI, SQLModel y PostgreSQL.
- **Frontend:** React, TypeScript, Vite, Tailwind CSS y TanStack Query.
- **Infraestructura local:** Docker Compose para PostgreSQL y pgAdmin.

## Requisitos

- Python 3.12 o posterior.
- Node.js y npm.
- Docker Desktop con Docker Compose.

## Puesta en marcha en Windows (PowerShell)

### 1. Configurar variables locales

Desde la raíz del repositorio, crea el archivo local de variables a partir de la plantilla:

```powershell
Copy-Item .env.example .env
```

Edita `.env` antes de iniciar los servicios: establece contraseñas locales propias para PostgreSQL y pgAdmin, y mantén la contraseña de PostgreSQL sincronizada en `DATABASE_URL` y `TEST_DATABASE_URL`. El archivo `.env` no se versiona. El backend lee este archivo desde la raíz del repositorio, incluso al iniciarse desde `backend`.

### 2. Iniciar PostgreSQL y pgAdmin

```powershell
docker compose up -d db pgadmin
docker compose ps
```

PostgreSQL queda disponible en `localhost:5432`; pgAdmin, en <http://localhost:5050>. Los puertos se pueden cambiar con `POSTGRES_PORT` y `PGADMIN_PORT`.

### 3. Iniciar el backend

En una terminal:

```powershell
Set-Location backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
```

La API y documentación interactiva estarán en <http://localhost:8000> y <http://localhost:8000/docs>. El endpoint `/api/health` comprueba también la conexión a PostgreSQL. En el arranque local, las tablas se crean desde los modelos SQLModel.

### 4. Iniciar el frontend

En otra terminal:

```powershell
Set-Location frontend
Copy-Item .env.example .env.local
npm ci
npm run dev
```

Abre <http://localhost:5173>. `VITE_API_BASE_URL` configura el prefijo de la API; por defecto apunta a `http://localhost:8000/api`.

### 5. Cargar el compendio inicial

Una vez que el backend esté disponible, carga los datos de ejemplo (la operación es idempotente):

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:8000/api/seed/
```

Se cargan hechizos, clases, razas, monstruos y equipo. Después se pueden consultar desde la interfaz y crear, consultar, editar y eliminar personajes.

### Importar contenido SRD autorizado

Para ampliar el compendio con datos abiertos, desde una terminal PowerShell:

```powershell
Set-Location backend
.\.venv\Scripts\Activate.ps1
python -m scripts.import_srd --dry-run
python -m scripts.import_srd
```

El importador descarga los datos de 5etools 2014 y solo incorpora registros marcados explícitamente `srd: true`; la importación es idempotente y actualiza las entradas por nombre. No importa contenido exclusivo de los libros ni registros sin esa marca. `--dry-run` muestra cuántas entradas SRD se importarían sin escribir en PostgreSQL. Los registros guardan atribución al System Reference Document 5.1 de Wizards of the Coast, publicado bajo [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). La licencia MIT del código de 5etools no se interpreta como licencia de los datos de los libros.

### Leer los manuales PDF locales

La opción **Compendium → My Rulebooks** permite abrir los PDF que ya están en la raíz del proyecto dentro de la web local. El servidor los sirve directamente desde esos archivos, sin extraer, duplicar ni enviar su texto a un servicio externo. Conserva la API en `localhost` (no la expongas a la red) y mantén los PDF fuera de repositorios o despliegues públicos.

## Pruebas y build

El backend requiere una base de datos de pruebas separada para no tocar la base local. Con la configuración de ejemplo, créala una vez:

```powershell
docker compose exec db createdb -U dnd_user dnd_beyond_clone_test
```

Desde `backend` y con el entorno virtual activo:

```powershell
pytest
```

Las pruebas usan `TEST_DATABASE_URL` de `.env` y rechazan bases cuyo nombre no termina en `_test`; eliminan y recrean tablas únicamente en esa base aislada.

Desde `frontend`:

```powershell
npm run build
npm run lint
```

## Endpoints del MVP

- `GET /api/health`
- `GET /api/spells/`, `/api/classes/`, `/api/races/`, `/api/monsters/` y `/api/equipment/`
- `POST /api/seed/`
- `GET /api/manuals/` y `GET /api/manuals/{manual_id}` para los tres PDF locales permitidos.
- `GET` y `POST /api/characters/`; `GET`, `PUT` y `DELETE /api/characters/{id}`

## Seguridad y alcance

No guardes `.env` en Git ni uses las contraseñas de ejemplo fuera de una máquina local. No publiques PostgreSQL ni pgAdmin en una red pública. Este MVP no incorpora autenticación, migraciones de producción ni aislamiento multiusuario.
