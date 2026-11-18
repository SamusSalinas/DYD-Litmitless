# D&D Beyond Clone (5e 2014)

Monorepo local para un gestor interactivo de personajes y compendio basado en el SRD de D&D 5e (2014).

> 📚 **Documentación Completa:** Consulta la bóveda de Obsidian en [`Documentacion Clon D&D Beyond/`](file:///c:/Users/Samuel/Desktop/dnd-beyond-clone/Documentacion%20Clon%20D&D%20Beyond/00%20-%20%C3%8Dndice%20General.md) para la arquitectura detallada, modelos de datos, endpoints y guías.

---

## ⚡ Stack Tecnológico

- **Backend:** FastAPI, SQLModel, PostgreSQL 15 y Alembic.
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui y TanStack Query.
- **Infraestructura:** Docker Compose (PostgreSQL y pgAdmin 4).

---

## 🚀 Inicio Rápido (Windows / PowerShell)

### 1. Variables de entorno e Infraestructura
```powershell
Copy-Item .env.example .env
docker compose up -d
```
*PostgreSQL disponible en `localhost:5432` y pgAdmin en `http://localhost:5050`.*

### 2. Backend (FastAPI)
```powershell
Set-Location backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```
*API y Swagger en `http://localhost:8000/docs`.*

### 3. Frontend (React)
```powershell
Set-Location frontend
Copy-Item .env.example .env.local
npm install
npm run dev
```
*Aplicación web en `http://localhost:5173`.*

### 4. Carga de Datos Iniciales (Seed)
```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:8000/api/seed/
```

---

## 🧪 Pruebas y Build

```powershell
# Backend (requiere base dnd_beyond_clone_test)
cd backend; pytest

# Frontend
cd frontend; npm run build; npm run lint
```
