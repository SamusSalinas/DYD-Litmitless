# 🚀 08 - Guía de Instalación y Puesta en Marcha

#instalacion #despliegue #powershell #setup #guia

Guía paso a paso para levantar el entorno completo de desarrollo en Windows usando PowerShell.

---

## 1. Requisitos Previos

- **Python:** 3.12 o superior.
- **Node.js:** Versión 18 o superior con `npm`.
- **Docker Desktop:** En ejecución con soporte de Docker Compose.
- **Compilador C++ (Windows):** Si una dependencia requiere compilar extensiones C (ej. PyYAML), disponer de *Microsoft C++ Build Tools 14+*.

---

## 2. Paso a Paso

### Paso 1: Configurar Variables de Entorno
En la raíz del proyecto:
```powershell
Copy-Item .env.example .env
```
Asegúrate de que las contraseñas en `.env` coincidan para `POSTGRES_PASSWORD`, `DATABASE_URL` y `TEST_DATABASE_URL`.

---

### Paso 2: Iniciar Base de Datos con Docker
```powershell
docker compose up -d
docker compose ps
```
Verifica que el contenedor `dnd-beyond-clone-db-1` reporte estado **Healthy**.

---

### Paso 3: Configurar y Arrancar el Backend
Abre una terminal PowerShell dedicada:
```powershell
Set-Location backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
```
> La API queda escuchando en `http://localhost:8000`. Comprueba `http://localhost:8000/api/health` para validar la conexión a PostgreSQL.

Para aplicar migraciones de esquema pendientes:
```powershell
.\.venv\Scripts\alembic.exe upgrade head
```

---

### Paso 4: Configurar y Arrancar el Frontend
Abre una segunda terminal PowerShell dedicada:
```powershell
Set-Location frontend
Copy-Item .env.example .env.local
npm install
npm run dev
```
> La interfaz web queda disponible en `http://localhost:5173`.

---

### Paso 5: Cargar el Compendio Inicial (Seed)
Con el backend en ejecución, ejecuta en PowerShell:
```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:8000/api/seed/
```
Esto creará de forma idempotente las razas, clases, monstruos, hechizos y equipo base.

---

### Paso 6 (Opcional): Ampliar con el Compendio SRD Oficial
```powershell
Set-Location backend
.\.venv\Scripts\Activate.ps1
python -m scripts.import_srd --dry-run   # Simulación previa
python -m scripts.import_srd             # Importación definitiva
```

---

## 3. Enlaces Relacionados

- [[02 - Backend - FastAPI y SQLModel]]
- [[05 - Frontend - React y UI]]
- [[07 - Infraestructura y Docker]]
- [[09 - Testing y Calidad de Código]]
- Volver al [[00 - Índice General]]

