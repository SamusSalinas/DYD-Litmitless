# Contexto del Proyecto: Clon de D&D Beyond (Edición 2014)

Este es un monorepo Full-Stack destinado a construir un gestor interactivo de personajes, hechizos y compendios basados en el SRD de Dungeons & Dragons 5a Edición (2014).

## 1. Arquitectura y Stack Tecnológico

Somos un Monorepo con una estricta separación de responsabilidades:

- **Backend (`/backend`):** FastAPI (Python), PostgreSQL, SQLModel (Pydantic V2 + SQLAlchemy 2.0).
  - _Patrón:_ Arquitectura Limpia (Clean Architecture). Capas: API Routes -> Services -> Repositories -> Database.
- **Frontend (`/frontend`):** React (Vite, TypeScript), Tailwind CSS, shadcn/ui, TanStack Query.
- **Infraestructura:** Docker Compose (raíz) para orquestación de PostgreSQL y pgAdmin.

## 2. Invariantes del Workspace (Reglas de Oro)

- **Aislamiento de Dominios:** Nunca mezcles lógica de backend en la carpeta de frontend, ni viceversa.
- **Persistencia Híbrida (Backend):** Utiliza PostgreSQL para las tablas relacionales base (ej. Usuarios, Personajes) pero utiliza columnas JSONB (a través de SQLModel) para almacenar las propiedades heterogéneas del compendio de reglas o conjuros complejos.
- **Componentes de UI (Frontend):** Antes de crear un componente visual desde cero, verifica si existe una implementación en shadcn/ui.
- **Seguridad y Credenciales:** Nunca expongas cadenas de conexión (`DATABASE_URL`) en el código. Lee siempre desde el archivo `.env` o a través de `core/config.py` en el backend.

## 3. Comportamiento del Agente

- **Verificación Visual:** Al implementar cambios en `/frontend`, utiliza la herramienta MCP de navegador (si está disponible) o el visor de Diff para verificar que los componentes renderizan correctamente.
- **Generación de Artefactos:** Cuando realices cambios a los modelos de base de datos (`models.py`) o esquemas (`schemas.py`), usa el comando `/plan` para que pueda aprobar la estructura antes de que modifiques el código.
