# 🤖 10 - Agentes de IA y Skills

#agentes #skills #ai #automatizacion #srd-extractor

El repositorio cuenta con una configuración especializada de agentes de soporte y habilidades operativas dentro del directorio `.agents/`.

---

## 1. Roles de Agente

1. **`backend-expert` (`.agents/agents/backend-expert.md`):**
   - Especialista en Clean Architecture con FastAPI, SQLModel, PostgreSQL y Alembic.
   - Vela por la integridad relacional, el uso correcto de columnas JSONB y el desacoplamiento de capas (Routes -> Services -> Repositories -> Database).
2. **`frontend-expert` (`.agents/agents/frontend-expert.md`):**
   - Especialista en React 19, TypeScript, Tailwind CSS, componentes accesibles de shadcn/ui y TanStack Query.
   - Asegura la consistencia visual del tema oscuro de D&D y la responsividad de la interfaz.

---

## 2. Habilidades Especializadas (Skills)

1. **`srd-extractor` (`.agents/skills/srd-extractor/SKILL.md`):**
   - Habilidad diseñada para extraer y parsear información desde manuales PDF oficiales de D&D 5e (2014) estructurándola automáticamente en modelos SQLModel o JSON.
2. **`generador_de_pruebas` (`.agents/skills/generador_de_pruebas.md`):**
   - Automatiza la creación de suites de pruebas con `pytest` y `TestClient` para cada nuevo endpoint o servicio añadido.
3. **`refactorizaci_n_segura` (`.agents/skills/refactorizaci_n_segura.md`):**
   - Pautas para refactorizaciones atómicas sin romper compatibilidad regresiva ni migraciones de base de datos.
4. **`regla_de_base_de_datos` (`.agents/skills/regla_de_base_de_datos.md`):**
   - Reglas estrictas para el diseño de esquemas híbridos relacionales + JSONB en PostgreSQL.

---

## 3. Enlaces Relacionados

- [[01 - Arquitectura y Stack]]
- [[02 - Backend - FastAPI y SQLModel]]
- [[05 - Frontend - React y UI]]
- Volver al [[00 - Índice General]]

