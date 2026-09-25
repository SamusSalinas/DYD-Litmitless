# Clon de D&D Beyond (Full-Stack)

Este es un monorepo para el desarrollo de un clon de D&D Beyond (edición 2014), enfocado en la gestión de personajes, hechizos y manuales. 

El proyecto utiliza una arquitectura de repositorio unificado separando el cliente y el servidor en directorios dedicados.

## 🚀 Tecnologías Principales
* **Backend:** FastAPI (Python), PostgreSQL, SQLModel.
* **Frontend:** React (JavaScript/TypeScript), HTML, CSS.
* **Infraestructura:** Docker Compose.

## 📂 Estructura del Proyecto

* `/backend`: Contiene la API RESTful construida con FastAPI, los modelos de base de datos y la lógica de negocio (Arquitectura Limpia).
* `/frontend`: Contiene la interfaz de usuario construida con React (SPA).
* `/docker-compose.yml`: Orquestación de servicios (Base de datos PostgreSQL y pgAdmin).

## 🛠️ Cómo levantar el entorno local

### 1. Base de Datos (Docker)
En la raíz del proyecto, ejecuta:
```bash
docker compose up -d

Esto iniciará PostgreSQL (puerto 5432) y pgAdmin (http://localhost:5050).

2. Iniciar el Backend
Ve a la carpeta del backend, crea el entorno virtual e instala las dependencias:

cd backend
python -m venv env
source env/Scripts/activate # En Windows MINGW64
pip install fastapi uvicorn sqlmodel
# Ejecutar servidor:
# fastapi dev app/main.py

3. Iniciar el Frontend
(Instrucciones pendientes de configurar cuando se inicialice React)

cd frontend
# npm install
# npm run dev