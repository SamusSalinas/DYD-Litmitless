---
trigger: glob
globs: "backend/models/**/*.py, backend/alembic/**/*.py"
description: "Invariantes y reglas arquitectónicas exclusivas para cuando se modifiquen modelos de base de datos o migraciones."
---

# Reglas de Migración y Modelado de Base de Datos

*Esta regla se carga automáticamente SOLO cuando modificas archivos de base de datos, ahorrando tokens el resto del tiempo.*

1. **Campos Dinámicos de D&D:** Para características que varían inmensamente (ej. Atributos especiales de un Monstruo), utiliza campos `JSONB` de PostgreSQL.
2. **Migraciones Seguras:** Nunca elimines ni renombres una columna en un solo paso. Utiliza el patrón de "expandir y contraer" (crear nueva columna, migrar datos, luego eliminar la vieja) en Alembic.
3. **Tipado:** Asegúrate de que las clases de SQLModel hereden correctamente de `SQLModel` y que los campos opcionales usen `Optional[Tipo]`.