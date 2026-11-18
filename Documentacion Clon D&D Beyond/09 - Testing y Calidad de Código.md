# 🧪 09 - Testing y Calidad de Código

#testing #pytest #calidad #oxlint #ci

El proyecto cuenta con suites de pruebas automatizadas y herramientas de análisis estático en ambas capas.

---

## 1. Pruebas de Backend (`pytest`)

### Requisito: Base de Datos de Prueba Aislada
Para garantizar que las pruebas nunca alteren ni eliminen datos de la base de desarrollo local, el runner exige una base de datos exclusiva cuyo nombre termine obligatoriamente en `_test`.

Crear la base de pruebas (una única vez):
```powershell
docker compose exec db createdb -U dnd_user dnd_beyond_clone_test
```

### Ejecución de Pruebas
Desde el directorio `backend` con el entorno virtual activo:
```powershell
pytest -v
```

### Cobertura de Pruebas (`backend/tests/`)
1. **`test_mvp_api.py`**:
   - `test_character_create_schema_accepts_builder_payload`: Valida el esquema base de personaje y valores por defecto.
   - `test_character_update_rejects_null_for_required_fields`: Impide que campos obligatorios sean anulados en peticiones PUT.
   - `test_character_level_up_updates_db`: Verifica que una petición `PUT /api/characters/{id}` con `level: 5` persista correctamente y retorne los datos actualizados.
   - `test_character_crud_and_validation`: Ciclo completo de creación, rechazo de nivel inválido (>20), consulta, edición y eliminación.
   - `test_health_reports_database_available`: Verifica conectividad con PostgreSQL.
   - `test_seed_populates_all_compendium_sections_idempotently`: Comprueba que múltiples ejecuciones de seed no dupliquen datos.
   - `test_manual_endpoint_serves_known_pdf_and_rejects_unknown_ids`: Verifica streaming de manuales por bytes y rechaza ataques de path traversal (`../../.env`).
2. **`test_srd_import.py`**:
   - Valida el filtrado de entradas marcadas con `srd: true` y la conversión a modelos SQLModel.

---

## 2. Calidad de Código en Frontend

Desde la carpeta `frontend`:

```powershell
# Comprobación de tipos y empaquetado de producción
npm run build

# Análisis estático ultrarrápido con Oxlint
npm run lint
```

---

## 3. Enlaces Relacionados

- [[02 - Backend - FastAPI y SQLModel]]
- [[04 - API REST y Endpoints]]
- [[08 - Guía de Instalación y Puesta en Marcha]]
- Volver al [[00 - Índice General]]

